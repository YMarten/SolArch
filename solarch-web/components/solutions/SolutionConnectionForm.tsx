"use client"

import { useState, useEffect } from "react"
import {
  Modal, Select, Textarea, Button, Group, Stack
} from "@mantine/core"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { solutionsService } from "@/services/solutions.service"
import { connectionsService, Connection } from "@/services/connections.service"
import { Solution } from "@/types/solution"

interface Props {
  opened:     boolean
  onClose:    () => void
  onSuccess:  () => void
  solutionId: string
  connection?: Connection | null
}

const connectionTypes = [
  { value: "SOAP", label: "SOAP" },
  { value: "REST",      label: "REST"             },
  { value: "GRAPHQL",   label: "GraphQL"          },
  { value: "EVENT",     label: "Evento (Kafka/RabbitMQ)" },
  { value: "SHARED_DB", label: "BD compartida"    },
  { value: "FILE",      label: "Archivo"          },
  { value: "WEBHOOK",   label: "Webhook"          },
  { value: "GRPC",      label: "gRPC"             },
  { value: "OTHER",     label: "Otro"             },
]

export function SolutionConnectionForm({ opened, onClose, onSuccess, solutionId, connection }: Props) {
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [loading, setLoading]     = useState(false)

  useEffect(() => {
    solutionsService.getAll().then(all =>
      setSolutions(all.filter(s => s.id !== solutionId))
    ).catch((e: unknown) => notifications.show({ message: e instanceof Error ? e.message : "No se pudieron cargar las soluciones", color: "red" }))
  }, [solutionId])

  const form = useForm({
    initialValues: {
      direction:   connection && connection.from.id !== solutionId ? "incoming" : "outgoing",
      targetId:    connection ? (connection.from.id === solutionId ? connection.to.id : connection.from.id) : "",
      type:        connection?.type ?? "REST",
      description: connection?.description ?? "",
    },
    validate: {
      targetId: v => !v ? "Selecciona una solución" : null,
      type:     v => !v ? "Selecciona el tipo"      : null,
    }
  })

  const handleSubmit = async (values: typeof form.values) => {
    if (loading) return
    setLoading(true)
    try {
      const payload = {
        fromId:      values.direction === "outgoing" ? solutionId : values.targetId,
        toId:        values.direction === "outgoing" ? values.targetId : solutionId,
        type:        values.type,
        description: values.description,
      }
      if (connection) await connectionsService.update(connection.id, payload)
      else await connectionsService.create(payload)
      notifications.show({ message: connection ? "Conexión actualizada correctamente" : "Conexión registrada correctamente", color: "green" })
      form.reset()
      onSuccess()
      onClose()
    } catch (e: unknown) {
      notifications.show({ message: e instanceof Error ? e.message : "No se pudo guardar la conexión", color: "red" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={() => { if (!loading) onClose() }}
      title={connection ? "Editar conexión" : "Nueva conexión"}
      closeOnClickOutside={!loading}
      closeOnEscape={!loading}
      withCloseButton={!loading}
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="sm">

          <Select
            label="¿Quién llama?"
            allowDeselect={false}
            disabled={loading}
            description="Indica quién inicia la llamada, independientemente de si envía o recibe datos."
            data={[
              { value: "outgoing", label: "Esta solución llama a →" },
              { value: "incoming", label: "Esta solución recibe llamadas de ←" },
            ]}
            {...form.getInputProps("direction")}
          />

          <Select
            label="Solución relacionada"
            disabled={loading}
            placeholder="Buscar solución..."
            searchable
            required
            data={solutions.map(s => ({ value: s.id, label: s.name }))}
            {...form.getInputProps("targetId")}
          />

          <Select
            label="Tipo de conexión"
            disabled={loading}
            allowDeselect={false}
            required
            data={connectionTypes}
            {...form.getInputProps("type")}
          />

          <Textarea
            label="Descripción"
            disabled={loading}
            placeholder="Describe brevemente qué se intercambia o para qué sirve esta conexión..."
            rows={3}
            {...form.getInputProps("description")}
          />

          <Group justify="flex-end" mt="sm">
            <Button type="button" variant="default" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" loading={loading}>
              Guardar conexión
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
