"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Alert, Badge, Button, Group, Loader, Modal, Paper, Select, Stack, Text, Title } from "@mantine/core"
import { groupsService } from "@/services/groups.service"
import { solutionsService } from "@/services/solutions.service"
import { participationOptions, SolutionGroup, SolutionParticipation } from "@/types/group"
import { Solution } from "@/types/solution"
import { GroupForm } from "@/components/groups/GroupForm"
import { SolutionPreview } from "@/components/solutions/SolutionPreview"

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
  return <Stack p="xl">
    <Group justify="space-between"><Button component={Link} href="/groups" variant="subtle">Volver a grupos</Button><Group>
      <Button variant="light" onClick={() => setEditing(true)} disabled={busy}>Editar grupo</Button>
      <Button color="red" variant="light" onClick={() => setDeleting(true)} disabled={busy}>Eliminar grupo</Button>
    </Group></Group>
    <Title order={2}>{group.name}</Title><Text>{group.description}</Text>
    {error && <Alert color="red" withCloseButton onClose={() => setError(null)}>{error}</Alert>}
    <Group>{participationOptions.map(option => <Badge key={option.value} variant="light">{option.label}: {group.members.filter(member => member.participation === option.value).length}</Badge>)}</Group>
    <Paper withBorder p="md"><Stack>
      <Title order={4}>Agregar solución</Title>
      <Select label="Solución" placeholder="Selecciona una solución" searchable clearable value={solutionId} onChange={setSolutionId} disabled={busy}
        data={solutions.filter(solution => !group.members.some(member => member.solutionId === solution.id)).map(solution => ({ value: solution.id, label: solution.name }))} />
      <Select label="Participación en este grupo" data={participationOptions} value={participation} allowDeselect={false} onChange={value => value && setParticipation(value as SolutionParticipation)} disabled={busy} />
      <Button disabled={!solutionId || busy} loading={busy} onClick={async () => {
        if (solutionId && await mutate(() => groupsService.setMember(id, solutionId, participation))) setSolutionId(null)
      }}>Agregar al grupo</Button>
    </Stack></Paper>
    <Title order={3}>Soluciones ({group.members.length})</Title>
    {!group.members.length && <Text c="dimmed">Agrega las soluciones que participan en este proyecto o iniciativa.</Text>}
    {group.members.map(member => <Paper key={member.solutionId} withBorder p="md"><Stack gap="sm">
      <Group justify="space-between"><Button variant="subtle" onClick={() => {
        const solution = solutions.find(item => item.id === member.solutionId)
        if (solution) setPreview(solution)
        else router.push(`/solutions/${member.solutionId}`)
      }}>{member.solution.name}</Button>
        <Button color="red" variant="subtle" disabled={busy} onClick={() => void mutate(() => groupsService.removeMember(id, member.solutionId))}>Quitar del grupo</Button>
      </Group>
      <Text size="sm">{member.solution.description}</Text>
      <Select label={`Participación de ${member.solution.name}`} data={participationOptions} value={member.participation} allowDeselect={false} disabled={busy}
        onChange={value => { if (value) void mutate(() => groupsService.setMember(id, member.solutionId, value as SolutionParticipation)) }} />
    </Stack></Paper>)}
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
    <SolutionPreview solution={preview} onClose={() => setPreview(null)} />
  </Stack>
}
