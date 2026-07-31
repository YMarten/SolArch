"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { Stack, Title, Text, Group, Badge, Paper, Loader, Center, Select } from "@mantine/core"
import { Solution } from "@/types/solution"
import { solutionsService } from "@/services/solutions.service"
import { api } from "@/lib/api"

interface Connection {
    id: string
    type: string
    fromId: string
    toId: string
    from: { id: string; name: string }
    to: { id: string; name: string }
}

interface GraphNode extends d3.SimulationNodeDatum {
    id: string
    name: string
    role: string
    criticality: string
    status: string
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
    type: string
}

const roleColors: Record<string, string> = {
    CORE_TRANSACTIONAL: "#4c6ef5",
    SATELLITE: "#7950f2",
    INTEGRATION: "#f59f00",
    DATA_ANALYTICS: "#12b886",
    INTERACTION_CHANNEL: "#f03e3e",
}

const roleLabels: Record<string, string> = {
    CORE_TRANSACTIONAL: "Core transaccional",
    SATELLITE: "Sistema satélite",
    INTEGRATION: "Plataforma de integración",
    DATA_ANALYTICS: "Información y analítica",
    INTERACTION_CHANNEL: "Canal e interacción",
}

export function EcosystemGraph() {
    const svgRef = useRef<SVGSVGElement>(null)
    const [solutions, setSolutions] = useState<Solution[]>([])
    const [connections, setConnections] = useState<Connection[]>([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState<GraphNode | null>(null)
    const [filterRole, setFilterRole] = useState<string | null>(null)

    useEffect(() => {
        Promise.all([
            solutionsService.getAll(),
        ]).then(async ([sols]) => {
            setSolutions(sols)
            // Obtener conexiones de cada solución
            const allConnections: Connection[] = []
            for (const sol of sols) {
                const conns = await api.get<Connection[]>(`/api/connections?solutionId=${sol.id}`)
                conns.forEach(c => {
                    if (!allConnections.find(ac => ac.id === c.id)) {
                        allConnections.push(c)
                    }
                })
            }
            setConnections(allConnections)
        }).finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        if (loading || !svgRef.current) return

        const filtered = filterRole
            ? solutions.filter(s => s.role === filterRole)
            : solutions

        const nodeIds = new Set(filtered.map(s => s.id))

        const nodes: GraphNode[] = filtered.map(s => ({
            id: s.id,
            name: s.name,
            role: s.role,
            criticality: s.criticality,
            status: s.status,
        }))

        const links: GraphLink[] = connections
            .filter(c => nodeIds.has(c.fromId) && nodeIds.has(c.toId))
            .map(c => ({
                source: c.fromId,
                target: c.toId,
                type: c.type,
            }))

        const svg = d3.select(svgRef.current)
        const width = svgRef.current.clientWidth
        const height = svgRef.current.clientHeight

        svg.selectAll("*").remove()

        // Zoom
        const g = svg.append("g")
        svg.call(
            d3.zoom<SVGSVGElement, unknown>()
                .scaleExtent([0.3, 3])
                .on("zoom", (event) => g.attr("transform", event.transform))
        )

        // Arrow marker
        svg.append("defs").append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 22)
            .attr("refY", 0)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr("fill", "#adb5bd")

        // Simulation
        const simulation = d3.forceSimulation<GraphNode>(nodes)
            .force("link", d3.forceLink<GraphNode, GraphLink>(links).id(d => d.id).distance(140))
            .force("charge", d3.forceManyBody().strength(-400))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collision", d3.forceCollide(50))

        // Links
        const link = g.append("g")
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("stroke", "#adb5bd")
            .attr("stroke-width", 1.5)
            .attr("marker-end", "url(#arrow)")

        // Link labels
        const linkLabel = g.append("g")
            .selectAll("text")
            .data(links)
            .join("text")
            .attr("font-size", 10)
            .attr("fill", "#868e96")
            .attr("text-anchor", "middle")
            .text(d => d.type)

        // Nodes group
        const node = g.append("g")
            .selectAll("g")
            .data(nodes)
            .join("g")
            .style("cursor", "pointer")
            .on("click", (_, d) => setSelected(d))
            .call(
                d3.drag<SVGGElement, GraphNode>()
                    .on("start", (event, d) => {
                        if (!event.active) simulation.alphaTarget(0.3).restart()
                        d.fx = d.x
                        d.fy = d.y
                    })
                    .on("drag", (event, d) => {
                        d.fx = event.x
                        d.fy = event.y
                    })
                    .on("end", (event, d) => {
                        if (!event.active) simulation.alphaTarget(0)
                        d.fx = null
                        d.fy = null
                    }) as unknown as (selection: d3.Selection<d3.BaseType, GraphNode, SVGGElement, unknown>) => void
            )

        // Node circles
        node.append("circle")
            .attr("r", 20)
            .attr("fill", d => roleColors[d.role] ?? "#868e96")
            .attr("fill-opacity", 0.85)
            .attr("stroke", "white")
            .attr("stroke-width", 2)

        // Node labels
        node.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", 34)
            .attr("font-size", 11)
            .attr("fill", "currentColor")
            .text(d => d.name.length > 18 ? d.name.slice(0, 16) + "…" : d.name)

        // Tick
        simulation.on("tick", () => {
            link
                .attr("x1", d => (d.source as GraphNode).x!)
                .attr("y1", d => (d.source as GraphNode).y!)
                .attr("x2", d => (d.target as GraphNode).x!)
                .attr("y2", d => (d.target as GraphNode).y!)

            linkLabel
                .attr("x", d => ((d.source as GraphNode).x! + (d.target as GraphNode).x!) / 2)
                .attr("y", d => ((d.source as GraphNode).y! + (d.target as GraphNode).y!) / 2 - 6)

            node.attr("transform", d => `translate(${d.x},${d.y})`)
        })

        return () => { simulation.stop() }
    }, [solutions, connections, loading, filterRole])

    if (loading) return <Center h={500}><Loader /></Center>

    return (
        <Stack gap="md" p="xl">
            <Group justify="space-between">
                <Title order={2}>Ecosistema de soluciones</Title>
                <Select
                    placeholder="Filtrar por rol..."
                    clearable
                    value={filterRole}
                    onChange={setFilterRole}
                    style={{ width: 220 }}
                    data={Object.entries(roleLabels).map(([value, label]) => ({ value, label }))}
                />
            </Group>

            {/* Leyenda */}
            <Group gap="sm">
                {Object.entries(roleLabels).map(([role, label]) => (
                    <Group key={role} gap={6}>
                        <div style={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            background: roleColors[role],
                        }} />
                        <Text size="xs" c="dimmed">{label}</Text>
                    </Group>
                ))}
            </Group>

            <Paper withBorder radius="md" style={{ position: "relative" }}>
                <svg
                    ref={svgRef}
                    style={{ width: "100%", height: 560, display: "block" }}
                />

                {/* Panel de detalle del nodo seleccionado */}
                {selected && (
                    <Paper
                        withBorder
                        shadow="md"
                        p="md"
                        radius="md"
                        style={{
                            position: "absolute",
                            top: 16,
                            right: 16,
                            width: 220,
                            background: "var(--mantine-color-body)",
                        }}
                    >
                        <Stack gap="xs">
                            <Text fw={500} size="sm">{selected.name}</Text>
                            <Badge
                                color={Object.keys(roleColors).includes(selected.role)
                                    ? undefined : "gray"}
                                style={{ background: roleColors[selected.role] }}
                                variant="filled"
                                size="sm"
                            >
                                {roleLabels[selected.role] ?? selected.role}
                            </Badge>
                            <Group gap="xs">
                                <Badge variant="light" size="xs"
                                    color={selected.criticality === "HIGH" ? "red" : selected.criticality === "MEDIUM" ? "yellow" : "gray"}>
                                    {selected.criticality === "HIGH" ? "Alta" : selected.criticality === "MEDIUM" ? "Media" : "Baja"}
                                </Badge>
                                <Badge variant="light" size="xs"
                                    color={selected.status === "ACTIVE" ? "green" : "gray"}>
                                    {selected.status === "ACTIVE" ? "Activa" : selected.status}
                                </Badge>
                            </Group>
                            <Text
                                size="xs"
                                c="blue"
                                style={{ cursor: "pointer" }}
                                onClick={() => window.location.href = `/solutions/${selected.id}`}
                            >
                                Ver detalle →
                            </Text>
                            <Text
                                size="xs"
                                c="dimmed"
                                style={{ cursor: "pointer" }}
                                onClick={() => setSelected(null)}
                            >
                                Cerrar
                            </Text>
                        </Stack>
                    </Paper>
                )}
            </Paper>

            <Text size="xs" c="dimmed" ta="center">
                Arrastra los nodos para reorganizar · Scroll para zoom · Clic en un nodo para ver detalles
            </Text>
        </Stack>
    )
}