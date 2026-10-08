"use client"

import { useEffect, useMemo, useState } from "react"
import { Stack, Title, Text, Group, Badge, Paper, Loader, Center, Select, Button, Alert, SimpleGrid, Collapse, ActionIcon, Tooltip } from "@mantine/core"
import { IconArrowsMaximize } from "@tabler/icons-react"
import Link from "next/link"
import { Solution } from "@/types/solution"
import { SolutionGroup } from "@/types/group"
import { solutionsService } from "@/services/solutions.service"
import { groupsService } from "@/services/groups.service"
import { connectionsService, Connection } from "@/services/connections.service"
import { SolutionConnectionForm } from "@/components/solutions/SolutionConnectionForm"
import { ecosystemView } from "@/lib/ecosystem"
import { EcosystemCanvas, roleColors } from "./EcosystemCanvas"

const roleLabels: Record<string, string> = { CORE_TRANSACTIONAL: "Core transaccional", SATELLITE: "Sistema satélite", INTEGRATION: "Plataforma de integración", DATA_ANALYTICS: "Datos / Analítica e IA" }
interface EcosystemGraphProps { solutionIds?: string[]; title?: string }

export function EcosystemGraph({ solutionIds, title = "Ecosistema de soluciones" }: EcosystemGraphProps = {}) {
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [groups, setGroups] = useState<SolutionGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [protocol, setProtocol] = useState<string | null>(null)
  const [activity, setActivity] = useState<string>("all")
  const [group, setGroup] = useState<string | null>(null)
  const [focus, setFocus] = useState<string | null>(null)
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null)
  const [editing, setEditing] = useState<Connection | null>(null)
  const [expanded, setExpanded] = useState(true)
  const [fitVersion, setFitVersion] = useState(0)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true); setError(null)
      try {
        const sols = await solutionsService.getAll()
        const all: Connection[] = []
        // Bound concurrency; failed requests must not classify solutions as isolated.
        for (let i = 0; i < sols.length; i += 8) {
          const batch = await Promise.all(sols.slice(i, i + 8).map(s => connectionsService.getBySolution(s.id)))
          if (!active) return
          all.push(...batch.flat())
        }
        const catalog = await groupsService.getAll()
        if (active) { setSolutions(sols); setConnections([...new Map(all.map(c => [c.id, c])).values()]); setGroups(catalog) }
      } catch (e) { if (active) setError(e instanceof Error ? e.message : "No se pudo cargar el ecosistema") }
      finally { if (active) setLoading(false) }
    }
    void load()
    return () => { active = false }
  }, [refresh])

  const scope = solutionIds ?? (group ? groups.find(g => g.id === group)?.members.map(m => m.solutionId) ?? [] : undefined)
  const scopeKey = scope ? [...scope].sort().join("|") : null
  const view = useMemo(() => ecosystemView(solutions, connections, scopeKey === null ? undefined : scopeKey.split("|"), role, protocol, activity), [solutions, connections, scopeKey, role, protocol, activity])
  const selected = solutions.find(s => s.id === focus)
  const clearSelection = () => { setFocus(null); setSelectedConnection(null) }
  const resetFilters = () => { setRole(null); setProtocol(null); setActivity("all"); setGroup(null); clearSelection() }
  const choose = (id: string | null) => { setFocus(id); setSelectedConnection(null); setExpanded(true) }
  const searchOptions = solutions.filter(s => !solutionIds || solutionIds.includes(s.id) || view.nodes.some(n => n.id === s.id)).map(s => ({ value: s.id, label: s.name }))
  const cards = (items: Solution[]) => <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }}>{items.map(s => <Paper key={s.id} withBorder p="sm" radius="md" style={{ borderColor: focus === s.id ? "var(--mantine-color-blue-6)" : undefined }}>
    <Stack gap={6}><Text fw={600}>{s.name}</Text><Text size="xs" c="dimmed">{roleLabels[s.role] ?? s.role}</Text><Button component={Link} href={`/solutions/${s.id}`} size="xs" variant="light">Ver detalle</Button></Stack>
  </Paper>)}</SimpleGrid>

  if (loading) return <Center h={500}><Stack align="center"><Loader /><Text size="sm">Cargando soluciones y conexiones…</Text></Stack></Center>
  if (error) return <Alert color="red" title="No se pudo cargar el ecosistema" m="xl"><Stack><Text>{error}</Text><Button onClick={() => setRefresh(v => v + 1)}>Reintentar</Button></Stack></Alert>

  return <Stack gap="md" p="xl">
    <Group justify="space-between"><div><Title order={2}>{title}</Title><Text c="dimmed" size="sm">Explora las relaciones o localiza una solución por su nombre.</Text></div><Button variant="default" onClick={() => { clearSelection(); setRefresh(v => v + 1) }}>Actualizar</Button></Group>
    <Paper withBorder p="md" radius="md"><Group align="flex-end">
      <Select label="Buscar y enfocar solución" placeholder="Nombre de la solución" searchable clearable data={searchOptions} value={focus} onChange={choose} style={{ minWidth: 240, flex: 1 }} />
      {!solutionIds && <Select label="Grupo" placeholder="Todos" clearable searchable value={group} onChange={v => { setGroup(v); clearSelection() }} data={groups.map(g => ({ value: g.id, label: g.name }))} />}
      <Select label="Rol" placeholder="Todos" clearable value={role} onChange={v => { setRole(v); clearSelection() }} data={Object.entries(roleLabels).map(([value, label]) => ({ value, label }))} />
      <Select label="Protocolo" placeholder="Todos" clearable value={protocol} onChange={v => { setProtocol(v); clearSelection() }} data={[...new Set(connections.map(c => c.type))].sort()} />
      <Select label="Conexiones" value={activity} onChange={v => { setActivity(v ?? "all"); clearSelection() }} data={[{ value: "all", label: "Todas" }, { value: "active", label: "Activas" }, { value: "inactive", label: "Inactivas" }]} />
      <Button variant="subtle" onClick={resetFilters}>Limpiar filtros</Button>
    </Group></Paper>
    <Group gap="xs"><Badge variant="light">{view.nodes.length} soluciones en el mapa</Badge><Badge variant="light">{view.connections.length} conexiones</Badge><Badge color="gray" variant="light">{view.isolated.length} sin conexiones registradas</Badge></Group>
    <Group gap="sm">{Object.entries(roleLabels).map(([value, label]) => <Group key={value} gap={5}><span style={{ width: 10, height: 10, borderRadius: "50%", background: roleColors[value] }} /><Text size="xs">{label}</Text></Group>)}</Group>
    <Text size="xs" c="dimmed">La flecha indica quién llama a quién. Las líneas discontinuas son conexiones inactivas. Los intermediarios se conservan aunque tengan otro rol o estén fuera del grupo.</Text>
    {selected && <Paper withBorder p="md" radius="md"><Group justify="space-between"><div><Text fw={600}>{selected.name}</Text><Text size="sm" c="dimmed">{view.nodes.some(n => n.id === selected.id) ? "Se resaltan sus relaciones completas, incluidos los intermediarios." : view.isolated.some(n => n.id === selected.id) ? "Esta solución no tiene conexiones registradas. Está en la sección inferior." : "Esta solución queda fuera del mapa con los filtros o el grupo actuales."}</Text></div><Group><Button component={Link} href={`/solutions/${selected.id}`} variant="light">Ver detalle</Button>{!solutionIds && !view.nodes.some(n => n.id === selected.id) && !view.isolated.some(n => n.id === selected.id) && <Button variant="light" onClick={() => { setRole(null); setProtocol(null); setActivity("all"); setGroup(null) }}>Mostrar en el ecosistema</Button>}<Button variant="subtle" onClick={clearSelection}>Quitar enfoque</Button></Group></Group></Paper>}
    {selectedConnection && <Paper withBorder p="md" radius="md"><Group justify="space-between"><Stack gap={4}><Text fw={600}>{selectedConnection.from.name} → {selectedConnection.intermediarySolution ? `${selectedConnection.intermediarySolution.name} → ` : ""}{selectedConnection.to.name}</Text><Text size="sm">{selectedConnection.type} · {selectedConnection.isActive ? "Activa" : "Inactiva"}</Text><Text size="sm">{selectedConnection.description || "Sin descripción"}</Text></Stack><Group><Button onClick={() => setEditing(selectedConnection)}>Editar conexión</Button><Button variant="subtle" onClick={clearSelection}>Cerrar</Button></Group></Group></Paper>}
    <Paper withBorder radius="md" style={{ overflow: "hidden", position: "relative" }}>
      {view.nodes.length > 0 && <Tooltip label="Ver todo: ajustar gráfico" position="left">
        <ActionIcon
          aria-label="Ver todo: ajustar gráfico"
          variant="default"
          size="lg"
          radius="md"
          style={{ position: "absolute", top: 12, right: 12, zIndex: 1, boxShadow: "var(--mantine-shadow-xs)" }}
          onClick={() => { clearSelection(); setFitVersion(v => v + 1) }}
        >
          <IconArrowsMaximize size={20} />
        </ActionIcon>
      </Tooltip>}
      {view.nodes.length ? <EcosystemCanvas solutions={view.nodes} connections={view.connections} focus={focus} selectedConnection={selectedConnection?.id ?? null} fitVersion={fitVersion} onSelect={choose} onConnection={c => { setSelectedConnection(c); setFocus(null) }} /> : <Center h={250}><Text c="dimmed">No hay conexiones para mostrar con esta selección.</Text></Center>}
    </Paper>
    <Text size="xs" c="dimmed" ta="center">Arrastra para reorganizar · Rueda para zoom · Selecciona una solución para enfocar · Selecciona una línea para ver protocolo y descripción</Text>
    <Paper withBorder radius="md" p="md"><Stack><Group justify="space-between"><div><Title order={3}>Sin conexiones registradas · {view.isolated.length}</Title><Text size="sm" c="dimmed">Sin relaciones como origen, destino o intermediario. No significa que estén fuera de uso.</Text></div><Button variant="subtle" aria-expanded={expanded} onClick={() => setExpanded(v => !v)}>{expanded ? "Contraer" : "Expandir"}</Button></Group><Collapse expanded={expanded}>{view.isolated.length ? cards(view.isolated) : <Text size="sm" c="dimmed">No hay soluciones sin conexiones en esta selección.</Text>}</Collapse></Stack></Paper>
    {view.hidden.length > 0 && <Paper withBorder p="md" radius="md"><Stack><Title order={3}>Sin conexiones visibles en esta selección · {view.hidden.length}</Title><Text size="sm" c="dimmed">Sí tienen conexiones registradas, pero sus relaciones quedan fuera de los filtros o del grupo actual.</Text>{cards(view.hidden)}</Stack></Paper>}
    {editing && <SolutionConnectionForm opened connection={editing} solutionId={editing.fromId} onClose={() => setEditing(null)} onSuccess={() => { setEditing(null); clearSelection(); setRefresh(v => v + 1) }} />}
  </Stack>
}
