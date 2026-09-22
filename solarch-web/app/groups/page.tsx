"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Alert, Button, Group, Loader, Modal, Paper, SimpleGrid, Stack, Text, TextInput, Title } from "@mantine/core"
import { groupsService } from "@/services/groups.service"
import { SolutionGroup } from "@/types/group"
import { GroupForm } from "@/components/groups/GroupForm"

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
  return <Stack p="xl">
    <Group justify="space-between"><Title order={2}>Grupos de soluciones</Title><Button onClick={() => setOpened(true)}>Crear grupo</Button></Group>
    <Text c="dimmed">Organiza las soluciones por proyecto o iniciativa e indica cuáles son nuevas, reutilizadas o adaptadas.</Text>
    <TextInput label="Buscar grupos" value={search} onChange={e => setSearch(e.currentTarget.value)} />
    {error && <Alert color="red">{error}</Alert>}
    {loading ? <Loader /> : <>
      {!filtered.length && <Text c="dimmed">{groups.length ? "No hay grupos que coincidan con la búsqueda." : "Todavía no hay grupos registrados."}</Text>}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>{filtered.map(group => <Paper key={group.id} withBorder p="md"><Stack gap="xs">
        <Title order={4}>{group.name}</Title><Text size="sm" lineClamp={3}>{group.description}</Text>
        <Text size="sm" c="dimmed">{group.members.length} soluciones</Text>
        <Button component={Link} href={`/groups/${group.id}`} variant="light">Abrir grupo</Button>
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
