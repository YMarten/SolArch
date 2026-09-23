"use client"

import { useCallback, useEffect, useState } from "react"
import {
  Stack, Text, Paper, Group, Badge, Loader,
  Center, Anchor, Button, ActionIcon, Modal, Tooltip, Alert
} from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { IconPlus, IconTrash, IconEdit } from "@tabler/icons-react"
import { connectionsService, Connection } from "@/services/connections.service"
import { SolutionConnectionForm } from "./SolutionConnectionForm"


const typeColors: Record<string, string> = {
  SOAP: "cyan",
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
  const [editing, setEditing] = useState<Connection | null>(null)
  const [deleting, setDeleting] = useState<Connection | null>(null)
  const [busy, setBusy] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  const load = useCallback(() => {
    return connectionsService.getBySolution(solutionId)
      .then(data => { setConnections(data); setLoadError(null) })
      .catch((e: unknown) => setLoadError(e instanceof Error ? e.message : "No se pudieron cargar las conexiones"))
      .finally(() => setLoading(false))
  }, [solutionId])

  useEffect(() => { void load() }, [load])

  const handleDelete = async () => {
    if (!deleting || busy) return
    setBusy(true)
    setDeleteError(null)
    try {
      await connectionsService.remove(deleting.id)
      setConnections(current => current.filter(connection => connection.id !== deleting.id))
      setDeleting(null)
      notifications.show({ message: "Conexión eliminada", color: "green" })
    } catch (e: unknown) {
      setDeleteError(e instanceof Error ? e.message : "No se pudo eliminar la conexión")
    } finally {
      setBusy(false)
    }
  }

  const actions = (connection: Connection) => <>
    <Tooltip label="Editar conexión">
      <ActionIcon variant="subtle" size="sm" aria-label={`Editar conexión de ${connection.from.name} a ${connection.to.name}`} onClick={() => { setEditing(connection); open() }}>
        <IconEdit size={14} />
      </ActionIcon>
    </Tooltip>
    <Tooltip label="Eliminar conexión">
      <ActionIcon variant="subtle" color="red" size="sm" aria-label={`Eliminar conexión de ${connection.from.name} a ${connection.to.name}`} onClick={() => { setDeleteError(null); setDeleting(connection) }}>
        <IconTrash size={14} />
      </ActionIcon>
    </Tooltip>
  </>

  if (loading) return <Center h={100}><Loader size="sm" /></Center>

  const incoming = connections.filter(c => c.to.id === solutionId)
  const outgoing = connections.filter(c => c.from.id === solutionId)

  return (
    <Stack gap="md">
      {loadError && <Alert color="red">{loadError}<Button variant="subtle" onClick={() => void load()}>Reintentar</Button></Alert>}
      <Group justify="flex-end">
        <Button
          size="xs"
          leftSection={<IconPlus size={12} />}
          onClick={() => { setEditing(null); open() }}
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
              <Text size="sm" fw={500} mb="xs">Recibe llamadas de</Text>
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
                        <Badge color="blue" variant="outline" size="sm">Recibe llamada</Badge>
                        {actions(c)}
                      </Group>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            </div>
          )}

          {outgoing.length > 0 && (
            <div>
              <Text size="sm" fw={500} mb="xs">Llama a</Text>
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
                        <Badge color="gray" variant="outline" size="sm">Inicia llamada</Badge>
                        {actions(c)}
                      </Group>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            </div>
          )}
        </>
      )}

      {opened && <SolutionConnectionForm
        opened={opened}
        onClose={close}
        onSuccess={load}
        solutionId={solutionId}
        connection={editing}
      />}
      <Modal opened={deleting !== null} onClose={() => { if (!busy) setDeleting(null) }} title="Eliminar conexión" centered closeOnClickOutside={!busy} closeOnEscape={!busy} withCloseButton={!busy}>
        <Stack gap="md">
          <Text>¿Quieres eliminar esta conexión?</Text>
          <Paper withBorder p="sm" radius="md">
            <Text fw={500}>{deleting?.from.name} → {deleting?.to.name}</Text>
            <Text size="sm" c="dimmed">Quién llama → Solución llamada · {deleting?.type}</Text>
            {deleting?.description && <Text size="sm" mt="xs">{deleting.description}</Text>}
          </Paper>
          <Text size="sm">Las soluciones se conservarán. Para recuperar la conexión tendrás que crearla de nuevo.</Text>
          {deleteError && <Alert color="red" role="alert">{deleteError}</Alert>}
          <Group justify="flex-end">
            <Button variant="default" data-autofocus disabled={busy} onClick={() => setDeleting(null)}>Cancelar</Button>
            <Button color="red" loading={busy} onClick={() => void handleDelete()}>Eliminar conexión</Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  )
}
