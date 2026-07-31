"use client"

import {
  Stack, Title, Text, Paper, Group, Badge,
  Divider, Select, ActionIcon, Textarea, Button
} from "@mantine/core"
import { useState } from "react"
import { notifications } from "@mantine/notifications"
import { ArchReview, ReviewResult, ActionStatus } from "@/types/review"
import { reviewsService } from "@/services/reviews.service"

const resultConfig: Record<ReviewResult, { label: string; color: string }> = {
  COMPLIANT:            { label: "Cumple",                   color: "green"  },
  COMPLIANT_WITH_NOTES: { label: "Cumple con observaciones", color: "yellow" },
  NON_COMPLIANT:        { label: "No cumple",                color: "red"    },
  IN_REVIEW:            { label: "En revisión",              color: "blue"   },
}

const actionStatusOptions = [
  { value: "PENDING",     label: "Pendiente"   },
  { value: "IN_PROGRESS", label: "En progreso" },
  { value: "COMPLETED",   label: "Completada"  },
  { value: "CANCELLED",   label: "Cancelada"   },
]

const actionStatusColors: Record<ActionStatus, string> = {
  PENDING:     "gray",
  IN_PROGRESS: "blue",
  COMPLETED:   "green",
  CANCELLED:   "red",
}

const dimensionLabels: Record<string, string> = {
  SECURITY:             "Seguridad",
  SCALABILITY:          "Escalabilidad",
  MAINTAINABILITY:      "Mantenibilidad",
  DOCUMENTATION:        "Documentación",
  TECH_ALIGNMENT:       "Alineación tecnológica",
  INTEGRATION_PATTERNS: "Patrones de integración",
  DATA_MANAGEMENT:      "Gestión de datos",
  RESILIENCE:           "Resiliencia",
  OTHER:                "Otro",
}

interface Props {
  review: ArchReview
}

export function ReviewDetail({ review }: Props) {
  const [actionStatuses, setActionStatuses] = useState<Record<string, ActionStatus>>(
    Object.fromEntries(review.actions.map(a => [a.id, a.status]))
  )
  const [saving, setSaving] = useState<string | null>(null)

  const handleStatusChange = async (actionId: string, status: ActionStatus) => {
    setSaving(actionId)
    try {
      await reviewsService.updateAction(actionId, { status })
      setActionStatuses(prev => ({ ...prev, [actionId]: status }))
      notifications.show({ message: "Estado actualizado", color: "green" })
    } catch (e: any) {
      notifications.show({ message: e.message, color: "red" })
    } finally {
      setSaving(null)
    }
  }

  return (
    <Stack gap="md">

      {/* Header */}
      <Paper withBorder p="md" radius="md">
        <Group justify="space-between" mb="sm">
          <Group gap="sm">
            <Badge
              color={resultConfig[review.result].color}
              variant="light"
              size="lg"
            >
              {resultConfig[review.result].label}
            </Badge>
            {review.reviewedVersion && (
              <Badge variant="default">{review.reviewedVersion}</Badge>
            )}
          </Group>
          <Text size="sm" c="dimmed">
            {new Date(review.reviewedAt).toLocaleDateString("es")}
          </Text>
        </Group>

        <Text size="sm"><strong>Arquitecto:</strong> {review.reviewedBy}</Text>

        {review.nextReviewDate && (
          <Text size="sm" c="dimmed" mt={4}>
            Próxima revisión: {new Date(review.nextReviewDate).toLocaleDateString("es")}
          </Text>
        )}

        {review.summary && (
          <>
            <Divider my="sm" />
            <Text size="sm">{review.summary}</Text>
          </>
        )}
      </Paper>

      {/* Dimensiones */}
      <Paper withBorder p="md" radius="md">
        <Title order={5} mb="md">Dimensiones evaluadas</Title>
        <Stack gap="xs">
          {review.dimensions.map(d => (
            <Paper key={d.id} withBorder p="sm" radius="md">
              <Group justify="space-between" mb={d.observation ? "xs" : 0}>
                <Text size="sm" fw={500}>
                  {dimensionLabels[d.dimension] ?? d.dimension}
                </Text>
                <Badge
                  color={resultConfig[d.result].color}
                  variant="light"
                  size="sm"
                >
                  {resultConfig[d.result].label}
                </Badge>
              </Group>
              {d.observation && (
                <Text size="xs" c="dimmed">{d.observation}</Text>
              )}
            </Paper>
          ))}
        </Stack>
      </Paper>

      {/* Acciones */}
      {review.actions.length > 0 && (
        <Paper withBorder p="md" radius="md">
          <Title order={5} mb="md">Acciones de remediación</Title>
          <Stack gap="xs">
            {review.actions.map(a => (
              <Paper key={a.id} withBorder p="sm" radius="md">
                <Group justify="space-between" align="flex-start">
                  <Stack gap={2} style={{ flex: 1 }}>
                    <Text size="sm" fw={500}>{a.description}</Text>
                    <Text size="xs" c="dimmed">Responsable: {a.responsible}</Text>
                    {a.dueDate && (
                      <Text size="xs" c="dimmed">
                        Fecha límite: {new Date(a.dueDate).toLocaleDateString("es")}
                      </Text>
                    )}
                    {a.notes && (
                      <Text size="xs" c="dimmed" mt={4}>{a.notes}</Text>
                    )}
                  </Stack>
                  <Select
                    size="xs"
                    style={{ width: 140 }}
                    data={actionStatusOptions}
                    value={actionStatuses[a.id]}
                    onChange={v => handleStatusChange(a.id, v as ActionStatus)}
                    disabled={saving === a.id}
                  />
                </Group>
              </Paper>
            ))}
          </Stack>
        </Paper>
      )}
    </Stack>
  )
}