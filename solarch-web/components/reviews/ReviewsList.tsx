"use client"

import { useEffect, useState } from "react"
import {
  Stack, Text, Paper, Group, Badge, Button,
  Loader, Center, ActionIcon, Divider
} from "@mantine/core"
import { IconPlus, IconTrash, IconEye } from "@tabler/icons-react"
import { notifications } from "@mantine/notifications"
import { useRouter } from "next/navigation"
import { reviewsService } from "@/services/reviews.service"
import { ArchReview, ReviewResult } from "@/types/review"

const resultConfig: Record<ReviewResult, { label: string; color: string }> = {
  COMPLIANT:            { label: "Cumple",                   color: "green"  },
  COMPLIANT_WITH_NOTES: { label: "Cumple con observaciones", color: "yellow" },
  NON_COMPLIANT:        { label: "No cumple",                color: "red"    },
  IN_REVIEW:            { label: "En revisión",              color: "blue"   },
}

interface Props {
  solutionId: string
}

export function ReviewsList({ solutionId }: Props) {
  const router = useRouter()
  const [reviews, setReviews]   = useState<ArchReview[]>([])
  const [loading, setLoading]   = useState(true)

  const load = () => {
    reviewsService.getBySolution(solutionId)
      .then(setReviews)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [solutionId])

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta revisión?")) return
    try {
      await reviewsService.remove(id)
      notifications.show({ message: "Revisión eliminada", color: "green" })
      load()
    } catch (e: any) {
      notifications.show({ message: e.message, color: "red" })
    }
  }

  if (loading) return <Center h={100}><Loader size="sm" /></Center>

  return (
    <Stack gap="sm">
      <Group justify="flex-end">
        <Button
          size="xs"
          leftSection={<IconPlus size={12} />}
          onClick={() => router.push(`/solutions/${solutionId}/reviews/new`)}
        >
          Nueva revisión
        </Button>
      </Group>

      {reviews.length === 0 ? (
        <Text size="sm" c="dimmed">No hay revisiones registradas.</Text>
      ) : reviews.map(r => (
        <Paper key={r.id} withBorder p="md" radius="md">
          <Group justify="space-between" mb="xs">
            <Group gap="sm">
              <Badge
                color={resultConfig[r.result].color}
                variant="light"
              >
                {resultConfig[r.result].label}
              </Badge>
              <Text size="sm" fw={500}>{r.reviewedBy}</Text>
              <Text size="xs" c="dimmed">
                {new Date(r.reviewedAt).toLocaleDateString("es")}
              </Text>
              {r.reviewedVersion && (
                <Badge variant="default" size="sm">{r.reviewedVersion}</Badge>
              )}
            </Group>
            <Group gap="xs">
              <ActionIcon
                variant="subtle"
                onClick={() => router.push(`/solutions/${solutionId}/reviews/${r.id}`)}
              >
                <IconEye size={16} />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={() => handleDelete(r.id)}
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
          </Group>

          {r.summary && (
            <Text size="sm" c="dimmed" lineClamp={2}>{r.summary}</Text>
          )}

          <Divider my="xs" />

          <Group gap="xs">
            <Text size="xs" c="dimmed">{r.dimensions.length} dimensiones evaluadas</Text>
            <Text size="xs" c="dimmed">·</Text>
            <Text size="xs" c="dimmed">{r.actions.length} acciones de remediación</Text>
            {r.nextReviewDate && (
              <>
                <Text size="xs" c="dimmed">·</Text>
                <Text size="xs" c="dimmed">
                  Próxima revisión: {new Date(r.nextReviewDate).toLocaleDateString("es")}
                </Text>
              </>
            )}
          </Group>
        </Paper>
      ))}
    </Stack>
  )
}