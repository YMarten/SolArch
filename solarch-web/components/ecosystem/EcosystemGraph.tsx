"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { Stack, Title, Text, Group, Badge, Paper, Loader, Center, Select, Button, Alert } from "@mantine/core"
import { Solution } from "@/types/solution"
import { solutionsService } from "@/services/solutions.service"
import { connectionsService, Connection } from "@/services/connections.service"
import { SolutionConnectionForm } from "@/components/solutions/SolutionConnectionForm"


interface GraphNode extends d3.SimulationNodeDatum {
    id: string
    name: string
    role: string
    criticality: string
    status: string
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
    connection: Connection
    isActive: boolean
    type: string
}

const roleColors: Record<string, string> = {
    CORE_TRANSACTIONAL: "#4263eb", // indigo
    SATELLITE: "#7048e8", // violet
    INTEGRATION: "#f76707", // orange
    DATA_ANALYTICS: "#0ca678", // teal
}

const roleLabels: Record<string, string> = {
    CORE_TRANSACTIONAL: "Core transaccional",
    SATELLITE: "Sistema satélite",
    INTEGRATION: "Plataforma de integración",
    DATA_ANALYTICS: "Datos / Analítica e IA",
}

interface EcosystemGraphProps {
    solutionIds?: string[]
    title?: string
}

export function EcosystemGraph({ solutionIds, title = "Ecosistema de soluciones" }: EcosystemGraphProps = {}) {
    const svgRef = useRef<SVGSVGElement>(null)
    const [solutions, setSolutions] = useState<Solution[]>([])
    const [connections, setConnections] = useState<Connection[]>([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState<GraphNode | null>(null)
    const [filterRole, setFilterRole] = useState<string | null>(null)
    const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null)
    const [editingConnection, setEditingConnection] = useState<Connection | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let active = true
        async function load() {
            try {
                const sols = solutionIds
                    ? await Promise.all(solutionIds.map(id => solutionsService.getById(id)))
                    : await solutionsService.getAll()
                if (!active) return
                setSolutions(sols)
                const results = await Promise.all(sols.map(sol => connectionsService.getBySolution(sol.id)))
                if (active) setConnections([...new Map(results.flat().map(c => [c.id, c])).values()])
            } catch (e) {
                if (active) setError(e instanceof Error ? e.message : "No se pudo cargar el diagrama")
            } finally {
                if (active) setLoading(false)
            }
        }
        void load()
        return () => { active = false }
    }, [solutionIds])

    useEffect(() => {
        if (loading || !svgRef.current) return

        const filtered = filterRole
            ? solutions.filter(s => s.role === filterRole)
            : solutions

        const nodeIds = new Set(filtered.map(s => s.id))
        const visibleConnections = connections.filter(c => nodeIds.has(c.fromId) && nodeIds.has(c.toId))
        // Preserve intermediary nodes even when their role differs from the filter.
        for (const c of visibleConnections) if (c.intermediarySolutionId) nodeIds.add(c.intermediarySolutionId)

        const nodes: GraphNode[] = solutions.filter(s => nodeIds.has(s.id)).map(s => ({
            id: s.id,
            name: s.name,
            role: s.role,
            criticality: s.criticality,
            status: s.status,
        }))

        const links: GraphLink[] = visibleConnections.flatMap(c => {
            const path = c.intermediarySolutionId && solutions.some(s => s.id === c.intermediarySolutionId)
                ? [c.fromId, c.intermediarySolutionId, c.toId] : [c.fromId, c.toId]
            return path.slice(1).map((target, i) => ({ source: path[i], target, type: c.type, isActive: c.isActive, connection: c }))
        })

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
            .attr("refX", 32)
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
            .attr("stroke-dasharray", d => d.isActive ? null : "5 4")
            .attr("marker-end", "url(#arrow)")
            .style("cursor", "pointer")
            .attr("tabindex", 0)
            .attr("role", "button")
            .attr("aria-label", d => `${d.connection.from.name} a ${d.connection.to.name}${d.connection.intermediarySolution ? ` vía ${d.connection.intermediarySolution.name}` : ""}`)

        const selectConnection = (d: GraphLink) => {
            setSelectedConnection(d.connection)
            link.attr("stroke", item => item.connection.id === d.connection.id ? "#228be6" : "#adb5bd")
                .attr("stroke-width", item => item.connection.id === d.connection.id ? 4 : 1.5)
        }
        link.on("click", (_, d) => selectConnection(d))
            .on("keydown", (event, d) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectConnection(d) } })
        link.append("title").text(d => `${d.connection.from.name} → ${d.connection.intermediarySolution ? d.connection.intermediarySolution.name + " → " : ""}${d.connection.to.name}`)

        // Link labels
        const linkLabel = g.append("g")
            .selectAll("text")
            .data(links)
            .join("text")
            .attr("font-size", 10)
            .attr("fill", "#868e96")
            .attr("text-anchor", "middle")
            .text(d => `${d.type} · ${d.isActive ? "Activa" : "Inactiva"}`)
            .style("cursor", "pointer")
            .on("click", (_, d) => selectConnection(d))

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
            {error && <Alert color="red">{error}</Alert>}
            {selectedConnection && <Paper withBorder p="md"><Group justify="space-between">
                <Stack gap="xs"><Text fw={500}>{selectedConnection.from.name} → {selectedConnection.intermediarySolution ? selectedConnection.intermediarySolution.name + " → " : ""}{selectedConnection.to.name}</Text>
                <Text size="sm">{selectedConnection.type} · {selectedConnection.isActive ? "Activa" : "Inactiva"}</Text>
                <Text size="sm">{selectedConnection.description}</Text></Stack>
                <Button onClick={() => setEditingConnection(selectedConnection)}>Editar conexión</Button>
            </Group></Paper>}
            {editingConnection && <SolutionConnectionForm opened onClose={() => setEditingConnection(null)} connection={editingConnection} solutionId={editingConnection.fromId} onSuccess={() => {
                void connectionsService.getBySolution(editingConnection.fromId).then(updated => {
                    setConnections(current => current.map(c => updated.find(item => item.id === c.id) ?? c))
                    setSelectedConnection(null)
                }).catch(e => setError(e.message))
            }} />}
            <Group justify="space-between">
                <Title order={2}>{title}</Title>
                {!solutionIds && <Select
                    placeholder="Filtrar por rol..."
                    clearable
                    value={filterRole}
                    onChange={setFilterRole}
                    style={{ width: 220 }}
                    data={Object.entries(roleLabels).map(([value, label]) => ({ value, label }))}
                />}
            </Group>

            <Text size="sm" c="dimmed">La flecha indica quién llama a quién: origen → destino. No representa el flujo de datos.</Text>

            {/* Leyenda */}
            <Text size="xs" c="dimmed">{solutionIds
                ? "Se muestran todas las soluciones del grupo y sus conexiones internas. Si una conexión tiene un intermediario fuera del grupo, se muestra entre sus extremos; puedes consultar el intermediario en el detalle."
                : "Una conexión con intermediario se dibuja en dos segmentos del mismo registro. Selecciona un segmento para resaltar el recorrido completo. El filtro conserva los intermediarios necesarios."}</Text>
            <Group>
                {Object.entries(roleLabels).map(([role, label]) => (
                    <Group key={role} gap={6}>
                        <div style={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            background: roleColors[role] ?? "#868e96",
                        }} />
                        <Text size="xs" c="dimmed">{label}</Text>
                    </Group>
                ))}
            </Group>

            {solutionIds && solutions.length === 0 && <Text c="dimmed">Este grupo todavía no tiene soluciones asignadas.</Text>}
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
