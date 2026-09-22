"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Alert, Badge, Button, Group, Loader, Paper, Stack, Text } from "@mantine/core"
import { groupsService } from "@/services/groups.service"
import { participationOptions, SolutionGroup } from "@/types/group"

export function SolutionGroups({ solutionId }: { solutionId: string }) {
  const [groups, setGroups] = useState<SolutionGroup[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    let active = true
    groupsService.getAll(solutionId).then(data => { if (active) setGroups(data) }).catch(e => { if (active) setError(e.message) })
    return () => { active = false }
  }, [solutionId])
  if (error) return <Alert color="red">{error}</Alert>
  if (!groups) return <Loader size="sm" />
  return <Stack>
    <Group justify="space-between"><Text size="sm">Proyectos e iniciativas en los que participa esta solución.</Text><Button component={Link} href="/groups" variant="light">Gestionar grupos</Button></Group>
    {!groups.length && <Text c="dimmed">Esta solución todavía no pertenece a ningún grupo.</Text>}
    {groups.map(group => <Paper key={group.id} withBorder p="md">
      <Group justify="space-between">
        <Button component={Link} href={`/groups/${group.id}`} variant="subtle">{group.name}</Button>
        <Badge>{participationOptions.find(option => option.value === group.members.find(member => member.solutionId === solutionId)?.participation)?.label}</Badge>
      </Group>
      {group.description && <Text size="sm">{group.description}</Text>}
    </Paper>)}
  </Stack>
}
