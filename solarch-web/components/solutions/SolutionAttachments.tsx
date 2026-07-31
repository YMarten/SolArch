"use client"

import { useEffect, useState } from "react"
import { Stack, Text, Paper, Group, Badge, Loader, Center, Anchor, ActionIcon } from "@mantine/core"
import { IconExternalLink } from "@tabler/icons-react"
import { api } from "@/lib/api"

interface Attachment {
  id: string
  title: string
  url: string
  category: string
  description?: string
}

const categoryColors: Record<string, string> = {
  DIAGRAM:        "blue",
  FUNCTIONAL_DOC: "green",
  TECHNICAL_DOC:  "teal",
  RUNBOOK:        "orange",
  ADR:            "gray",
  API_CONTRACT:   "yellow",
  OTHER:          "gray",
}

const categoryLabels: Record<string, string> = {
  DIAGRAM:        "Diagrama",
  FUNCTIONAL_DOC: "Doc. funcional",
  TECHNICAL_DOC:  "Doc. técnica",
  RUNBOOK:        "Runbook",
  ADR:            "ADR",
  API_CONTRACT:   "Contrato API",
  OTHER:          "Otro",
}

interface Props {
  solutionId: string
}

export function SolutionAttachments({ solutionId }: Props) {
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Attachment[]>(`/api/attachments?solutionId=${solutionId}`)
      .then(setAttachments)
      .finally(() => setLoading(false))
  }, [solutionId])

  if (loading) return <Center h={100}><Loader size="sm" /></Center>

  if (attachments.length === 0) {
    return <Text size="sm" c="dimmed">No hay adjuntos registrados.</Text>
  }

  return (
    <Stack gap="xs">
      {attachments.map(att => (
        <Paper key={att.id} withBorder p="sm" radius="md">
          <Group justify="space-between">
            <Group gap="sm">
              <Badge
                color={categoryColors[att.category] ?? "gray"}
                variant="light"
                size="sm"
              >
                {categoryLabels[att.category] ?? att.category}
              </Badge>
              <div>
                <Text size="sm" fw={500}>{att.title}</Text>
                {att.description && (
                  <Text size="xs" c="dimmed">{att.description}</Text>
                )}
              </div>
            </Group>
            <ActionIcon
              variant="subtle"
              component="a"
              href={att.url}
              target="_blank"
            >
              <IconExternalLink size={16} />
            </ActionIcon>
          </Group>
        </Paper>
      ))}
    </Stack>
  )
}