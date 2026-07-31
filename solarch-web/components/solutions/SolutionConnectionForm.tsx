"use client"

import { useState, useEffect } from "react"
import {
  Modal, Select, Textarea, Button, Group, Stack, Text
} from "@mantine/core"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { solutionsService } from "@/services/solutions.service"
import { api } from "@/lib/api"
import { Solution } from "@/types/solution"

interface Props {
  opened:     boolean
  onClose:    () => void
  onSuccess:  () => void
  solutionId: string
}

const connectionTypes = [
  { value: "REST",      label: "REST"             },
  { value: "GRAPHQL",   label: "GraphQL"          },
  { value: "EVENT",     label: "Evento (Kafka/RabbitMQ)" },
  { value: "SHARED_DB", label: "BD compartida"    },
  { value: "FILE",      label: "Archivo"          },
  { value: "WEBHOOK",   label: "Webhook"          },
  { value: "GRPC",      label: "gRPC"             },
  { value: "OTHER",     label: "Otro"             },
]

export function SolutionConnectionForm({ opened, onClose, onSuccess, solutionId }: Props) {
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [loading, setLoading]     = useState(false)

  useEffect(() => {
    solutionsService.getAll().then(all =>
      setSolutions(all.filter(s => s.id !== solutionId))
    )
  }, [solutionId])

  const form = useForm({
    initialValues: {
      direction:   "outgoing",
      targetId:    "",
      type:        "REST",
      description: "",
    },
    validate: {
      targetId: v => !v ? "Selecciona una solución" : null,
      type:     v => !v ? "Selecciona el tipo"      : null,
    }
  })

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true)
    try {
      const payload = {
        fromId:      values.direction === "outgoing" ? solutionId : values.targetId,
        toId:        values.direction === "outgoing" ? values.targetId : solutionId,
        type:        values.type,
        description: values.description || undefined,
      }
      await api.post("/api/connections", payload)
      notifications.show({ message: "Conexión registrada correctamente", color: "green" })
      form.reset()
      onSuccess()
      onClose()
    } catch (e: any) {
      notifications.show({ message: e.message, color: "red" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Nueva conexión"
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="sm">

          <Select
            label="Dirección"
            description="¿Esta solución consume o provee?"
            data={[
              { value: "outgoing", label: "Esta solución provee a →" },
              { value: "incoming", label: "Esta solución consume de ←" },
            ]}
            {...form.getInputProps("direction")}
          />

          <Select
            label="Solución relacionada"
            placeholder="Buscar solución..."
            searchable
            required
            data={solutions.map(s => ({ value: s.id, label: s.name }))}
            {...form.getInputProps("targetId")}
          />

          <Select
            label="Tipo de conexión"
            required
            data={connectionTypes}
            {...form.getInputProps("type")}
          />

          <Textarea
            label="Descripción"
            placeholder="Describe brevemente qué se intercambia o para qué sirve esta conexión..."
            rows={3}
            {...form.getInputProps("description")}
          />

          <Group justify="flex-end" mt="sm">
            <Button type="button" variant="default" onClick={onClose}>
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