"use client"

import { useEffect, useState } from "react"
import {
  Stack, Text, Paper, Group, Badge, Loader,
  Center, Anchor, Button, ActionIcon
} from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { IconPlus, IconTrash } from "@tabler/icons-react"
import { api } from "@/lib/api"
import { SolutionConnectionForm } from "./SolutionConnectionForm"

interface Connection {
  id:          string
  type:        string
  description?: string
  from:        { id: string; name: string }
  to:          { id: string; name: string }
}

const typeColors: Record<string, string> = {
  REST:      "blue",
  GRAPHQL:   "violet",
  EVENT:     "orange",
  SHARED_DB: "red",
  FILE:      "gray",
  WEBHOOK:   "teal",
  GRPC:      "indigo",
  OTHER:     "gray",
}

interface Props {
  solutionId: string
}

export function SolutionConnections({ solutionId }: Props) {
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading]         = useState(true)
  const [opened, { open, close }]     = useDisclosure(false)

  const load = () => {
    api.get<Connection[]>(`/api/connections?solutionId=${solutionId}`)
      .then(setConnections)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [solutionId])

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta conexión?")) return
    try {
      await api.delete(`/api/connections/${id}`)
      notifications.show({ message: "Conexión eliminada", color: "green" })
      load()
    } catch (e: any) {
      notifications.show({ message: e.message, color: "red" })
    }
  }

  if (loading) return <Center h={100}><Loader size="sm" /></Center>

  const incoming = connections.filter(c => c.to.id === solutionId)
  const outgoing = connections.filter(c => c.from.id === solutionId)

  return (
    <Stack gap="md">
      <Group justify="flex-end">
        <Button
          size="xs"
          leftSection={<IconPlus size={12} />}
          onClick={open}
        >
          Nueva conexión
        </Button>
      </Group>

      {connections.length === 0 ? (
        <Text size="sm" c="dimmed">No hay conexiones registradas.</Text>
      ) : (
        <>
          {incoming.length > 0 && (
            <div>
              <Text size="sm" fw={500} mb="xs">Consume de</Text>
              <Stack gap="xs">
                {incoming.map(c => (
                  <Paper key={c.id} withBorder p="sm" radius="md">
                    <Group justify="space-between">
                      <div>
                        <Anchor size="sm" fw={500} href={`/solutions/${c.from.id}`}>
                          {c.from.name}
                        </Anchor>
                        {c.description && (
                          <Text size="xs" c="dimmed">{c.description}</Text>
                        )}
                      </div>
                      <Group gap="xs">
                        <Badge color={typeColors[c.type] ?? "gray"} variant="light" size="sm">
                          {c.type}
                        </Badge>
                        <Badge color="blue" variant="outline" size="sm">Entrada</Badge>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          size="sm"
                          onClick={() => handleDelete(c.id)}
                        >
                          <IconTrash size={14} />
                        </ActionIcon>
                      </Group>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            </div>
          )}

          {outgoing.length > 0 && (
            <div>
              <Text size="sm" fw={500} mb="xs">Provee a</Text>
              <Stack gap="xs">
                {outgoing.map(c => (
                  <Paper key={c.id} withBorder p="sm" radius="md">
                    <Group justify="space-between">
                      <div>
                        <Anchor size="sm" fw={500} href={`/solutions/${c.to.id}`}>
                          {c.to.name}
                        </Anchor>
                        {c.description && (
                          <Text size="xs" c="dimmed">{c.description}</Text>
                        )}
                      </div>
                      <Group gap="xs">
                        <Badge color={typeColors[c.type] ?? "gray"} variant="light" size="sm">
                          {c.type}
                        </Badge>
                        <Badge color="gray" variant="outline" size="sm">Salida</Badge>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          size="sm"
                          onClick={() => handleDelete(c.id)}
                        >
                          <IconTrash size={14} />
                        </ActionIcon>
                      </Group>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            </div>
          )}
        </>
      )}

      <SolutionConnectionForm
        opened={opened}
        onClose={close}
        onSuccess={load}
        solutionId={solutionId}
      />
    </Stack>
  )
}