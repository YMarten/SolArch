"use client"

import { useEffect, useState } from "react"
import { SimpleGrid, Text, Paper, Group, Badge, Loader, Center } from "@mantine/core"
import { api } from "@/lib/api"

interface Environment {
  id: string
  name: string
  url?: string
  isActive: boolean
  notes?: string
}

interface Props {
  solutionId: string
}

export function SolutionEnvironments({ solutionId }: Props) {
  const [environments, setEnvironments] = useState<Environment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Environment[]>(`/api/environments?solutionId=${solutionId}`)
      .then(setEnvironments)
      .finally(() => setLoading(false))
  }, [solutionId])

  if (loading) return <Center h={100}><Loader size="sm" /></Center>

  if (environments.length === 0) {
    return <Text size="sm" c="dimmed">No hay ambientes registrados.</Text>
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
      {environments.map(env => (
        <Paper key={env.id} withBorder p="md" radius="md">
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={500}>{env.name}</Text>
            <Badge
              color={env.isActive ? "green" : "gray"}
              variant="dot"
              size="sm"
            >
              {env.isActive ? "Activo" : "Inactivo"}
            </Badge>
          </Group>
          {env.url
            ? <Text size="xs" c="blue" style={{ wordBreak: "break-all" }}>{env.url}</Text>
            : <Text size="xs" c="dimmed">Sin URL registrada</Text>
          }
          {env.notes && (
            <Text size="xs" c="dimmed" mt="xs">{env.notes}</Text>
          )}
        </Paper>
      ))}
    </SimpleGrid>
  )
}