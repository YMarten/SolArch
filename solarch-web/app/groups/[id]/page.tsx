"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ActionIcon, Alert, Badge, Button, Group, Loader, Modal, Paper, Select, SimpleGrid, Stack, Text, Title } from "@mantine/core"
import { IconChevronLeft, IconHierarchy, IconEdit, IconTrash, IconX } from "@tabler/icons-react"
import { groupsService } from "@/services/groups.service"
import { solutionsService } from "@/services/solutions.service"
import { participationOptions, SolutionGroup, SolutionParticipation } from "@/types/group"
import { Solution } from "@/types/solution"
import { EcosystemGraph } from "@/components/ecosystem/EcosystemGraph"
import { GroupForm } from "@/components/groups/GroupForm"
import { SolutionPreview } from "@/components/solutions/SolutionPreview"
import { DescribedSelect } from "@/components/ui/DescribedSelect"
import { FieldLabelHelp } from "@/components/ui/FieldLabelHelp"

const participationHelp = "Indica cómo se incorpora la solución al proyecto o iniciativa de este grupo: como una solución nueva, reutilizando una existente o adaptándola. La clasificación aplica solo a este grupo; la misma solución puede tener otra participación en otros grupos."

export default function GroupPage() {
  const { id } = useParams<{ id: string }>()
  return <GroupContent key={id} id={id} />
}

function GroupContent({ id }: { id: string }) {
  const router = useRouter()
  const [group, setGroup] = useState<SolutionGroup | null>(null)
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [solutionId, setSolutionId] = useState<string | null>(null)
  const [participation, setParticipation] = useState<SolutionParticipation>("NEW")
  const [diagramOpened, setDiagramOpened] = useState(false)
  const diagramSolutionIds = useMemo(() => group?.members.map(member => member.solutionId) ?? [], [group])
  const [preview, setPreview] = useState<Solution | null>(null)
  useEffect(() => {
    let active = true
    Promise.all([groupsService.getById(id), solutionsService.getAll()])
      .then(([result, catalog]) => { if (active) { setGroup(result); setSolutions(catalog) } })
      .catch(e => { if (active) setError(e.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])
  async function mutate(action: () => Promise<unknown>) {
    setBusy(true); setError(null)
    try { await action(); setGroup(await groupsService.getById(id)); return true }
    catch (e) { setError(e instanceof Error ? e.message : "No se pudo guardar el cambio"); return false }
    finally { setBusy(false) }
  }
  if (loading) return <Stack p="xl"><Loader /></Stack>
  if (!group) return <Stack p="xl"><Alert color="red">{error ?? "Grupo no encontrado"}</Alert><Button component={Link} href="/groups">Volver a grupos</Button></Stack>
  return <Stack p="xl" gap="lg" className="group-detail-page">
    <Group justify="space-between" gap="sm"><Button component={Link} href="/groups" variant="subtle" leftSection={<IconChevronLeft size={16} />}>Volver a grupos</Button><Group gap="xs">
      <Button size="xs" variant="light" leftSection={<IconHierarchy size={14} />} onClick={() => setDiagramOpened(true)}>Ver diagrama</Button>
      <Button size="xs" variant="light" leftSection={<IconEdit size={14} />} onClick={() => setEditing(true)} disabled={busy}>Editar grupo</Button>
      <Button size="xs" color="red" variant="light" leftSection={<IconTrash size={14} />} onClick={() => setDeleting(true)} disabled={busy}>Eliminar grupo</Button>
    </Group></Group>
    <Stack gap={4}><Title order={2} style={{ overflowWrap: "anywhere" }}>{group.name}</Title><Text size="sm" c="dimmed">{group.description}</Text></Stack>
    {error && <Alert color="red" withCloseButton onClose={() => setError(null)}>{error}</Alert>}
    <Group gap="xs">{participationOptions.map(option => <Badge key={option.value} color={option.value === "NEW" ? "blue" : option.value === "REUSED" ? "green" : "gray"} variant="light">{option.label}: {group.members.filter(member => member.participation === option.value).length}</Badge>)}</Group>
    <Paper withBorder p="lg" className="group-add-solution"><Stack gap="md">
      <Title order={4}>Agregar solución</Title>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
      <Select label="Solución" placeholder="Selecciona una solución" searchable clearable value={solutionId} onChange={setSolutionId} disabled={busy}
        data={solutions.filter(solution => !group.members.some(member => member.solutionId === solution.id)).map(solution => ({ value: solution.id, label: solution.name }))} />
      <DescribedSelect label={<FieldLabelHelp label="Participación en este grupo" help={participationHelp} />} data={participationOptions} value={participation} allowDeselect={false} onChange={value => value && setParticipation(value as SolutionParticipation)} disabled={busy} />
      </SimpleGrid>
      <Button disabled={!solutionId || busy} loading={busy} onClick={async () => {
        if (solutionId && await mutate(() => groupsService.setMember(id, solutionId, participation))) setSolutionId(null)
      }}>Agregar al grupo</Button>
    </Stack></Paper>
    <Title order={3}>Soluciones ({group.members.length})</Title>
    {!group.members.length && <Text c="dimmed">Agrega las soluciones que participan en este proyecto o iniciativa.</Text>}
    <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }} spacing="md">
    {group.members.map(member => <Paper key={member.solutionId} withBorder p="lg" className="group-member-card"><Stack gap="sm" h="100%">
      <Group justify="space-between" align="flex-start" wrap="nowrap" gap="xs"><Button variant="subtle" className="group-member-name" onClick={() => {
        const solution = solutions.find(item => item.id === member.solutionId)
        if (solution) setPreview(solution)
        else router.push(`/solutions/${member.solutionId}`)
      }}>{member.solution.name}</Button>
        <ActionIcon size="sm" color="red" variant="subtle" className="group-member-remove" aria-label={`Quitar ${member.solution.name} del grupo`} title="Quitar del grupo" disabled={busy} onClick={() => void mutate(() => groupsService.removeMember(id, member.solutionId))}><IconX size={16} /></ActionIcon>
      </Group>
      <Text size="xs" c="dimmed" lh={1.6} lineClamp={3} title={member.solution.description ?? undefined}>{member.solution.description}</Text>
      <div className="group-member-participation">
      <DescribedSelect label={<FieldLabelHelp label="Participación" help={participationHelp} />} aria-label={`Participación de ${member.solution.name}`} data={participationOptions} value={member.participation} allowDeselect={false} disabled={busy}
        onChange={value => { if (value) void mutate(() => groupsService.setMember(id, member.solutionId, value as SolutionParticipation)) }} />
      </div>
    </Stack></Paper>)}
    </SimpleGrid>
    <Modal opened={editing} onClose={() => setEditing(false)} title="Editar grupo" closeOnClickOutside={false}>
      <GroupForm key={`${group.updatedAt}-${editing}`} initial={group} onSave={async data => { setGroup(await groupsService.update(id, data)); setEditing(false) }} />
    </Modal>
    <Modal opened={deleting} onClose={() => { if (!busy) setDeleting(false) }} title="Eliminar grupo" closeOnClickOutside={false}>
      <Stack><Text>¿Eliminar «{group.name}»? Se quitarán sus asociaciones. Las soluciones se conservarán.</Text>
        <Button color="red" loading={busy} onClick={async () => {
          setBusy(true)
          try { await groupsService.remove(id); router.push("/groups") }
          catch (e) { setError(e instanceof Error ? e.message : "No se pudo eliminar el grupo"); setDeleting(false) }
          finally { setBusy(false) }
        }}>Eliminar grupo</Button>
      </Stack>
    </Modal>
    <Modal opened={diagramOpened} onClose={() => setDiagramOpened(false)} title={`Diagrama de ${group.name}`} size="90%">
      {diagramOpened && <EcosystemGraph solutionIds={diagramSolutionIds} title={group.name} />}
    </Modal>
    <SolutionPreview solution={preview} onClose={() => setPreview(null)} />
  </Stack>
}
