"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Alert, Button, Group, Loader, Modal, Paper, SimpleGrid, Stack, Text, TextInput, Title } from "@mantine/core"
import { groupsService } from "@/services/groups.service"
import { SolutionGroup } from "@/types/group"
import { GroupForm } from "@/components/groups/GroupForm"
import { IconFolder, IconSearch } from "@tabler/icons-react"

export default function GroupsPage() {
  const [groups, setGroups] = useState<SolutionGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [opened, setOpened] = useState(false)
  const [search, setSearch] = useState("")
  useEffect(() => {
    groupsService.getAll().then(setGroups).catch(e => setError(e.message)).finally(() => setLoading(false))
  }, [])
  const filtered = groups.filter(group => `${group.name} ${group.description ?? ""}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
  return <Stack p="xl" gap="lg" className="groups-page">
    <Group justify="space-between"><Title order={2}>Grupos de soluciones</Title><Button onClick={() => setOpened(true)}>Crear grupo</Button></Group>
    <Text c="dimmed">Organiza las soluciones por proyecto o iniciativa e indica cuáles son nuevas, reutilizadas o adaptadas.</Text>
    <TextInput label="Buscar grupos" leftSection={<IconSearch size={16} />} value={search} onChange={e => setSearch(e.currentTarget.value)} />
    {error && <Alert color="red">{error}</Alert>}
    {loading ? <Loader /> : <>
      {!filtered.length && <Text c="dimmed">{groups.length ? "No hay grupos que coincidan con la búsqueda." : "Todavía no hay grupos registrados."}</Text>}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing="sm">{filtered.map(group => <Paper key={group.id} withBorder p="md" radius={20} className="group-card" style={{ display: "flex", flexDirection: "column", minWidth: 0 }}><Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
        <span className="group-card-icon" aria-hidden="true"><IconFolder size={22} /></span>
        <Title order={4} style={{ overflowWrap: "anywhere" }}>{group.name}</Title>
        <Text size="sm" c="dimmed" lh={1.6} lineClamp={3} style={{ overflowWrap: "anywhere", overflow: "hidden" }}>{group.description}</Text>
        <Stack gap="sm" mt="auto" className="group-card-footer">
          <Text size="sm" c="dimmed">{group.members.length} soluciones</Text>
          <Button component={Link} href={`/groups/${group.id}`} variant="light">Abrir grupo</Button>
        </Stack>
      </Stack></Paper>)}</SimpleGrid>
    </>}
    <Modal opened={opened} onClose={() => setOpened(false)} title="Crear grupo" closeOnClickOutside={false}>
      <GroupForm key={String(opened)} onSave={async data => {
        const group = await groupsService.create(data)
        setGroups(current => [...current, group].sort((a, b) => a.name.localeCompare(b.name)))
        setOpened(false)
      }} />
    </Modal>
  </Stack>
}
