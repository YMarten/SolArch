"use client"

import { Card, Text, Group, Stack, Badge } from "@mantine/core"
import { IconGitBranch } from "@tabler/icons-react"
import { Solution } from "@/types/solution"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { CriticalityBadge } from "@/components/ui/CriticalityBadge"
import { useRouter } from "next/navigation"

const roleLabels: Record<string, string> = {
  CORE_TRANSACTIONAL:  "Core transaccional",
  SATELLITE:           "Sistema satélite",
  INTEGRATION:         "Plataforma de integración",
  DATA_ANALYTICS:      "Información y analítica",
  INTERACTION_CHANNEL: "Canal e interacción",
}

interface Props {
  solution: Solution
}

export function SolutionCard({ solution }: Props) {
  const router = useRouter()

  return (
    <Card
      withBorder
      radius="md"
      padding="md"
      style={{ cursor: "pointer" }}
      onClick={() => router.push(`/solutions/${solution.id}`)}
    >
      <Stack gap="xs">
        <Group justify="space-between" align="flex-start">
          <Text fw={500} size="sm" lineClamp={1} style={{ flex: 1 }}>
            {solution.name}
          </Text>
          <StatusBadge status={solution.status} />
        </Group>

        {solution.description && (
          <Text size="xs" c="dimmed" lineClamp={2}>
            {solution.description}
          </Text>
        )}

        <Group gap="xs">
          <Badge variant="light" color="blue" size="xs">
            {roleLabels[solution.role] ?? solution.role}
          </Badge>
        </Group>

        {solution.technologies && solution.technologies.length > 0 && (
          <Group gap="xs">
            {solution.technologies.slice(0, 3).map(({ technology }) => (
              <Badge key={technology.id} variant="default" size="xs">
                {technology.name}
              </Badge>
            ))}
            {solution.technologies.length > 3 && (
              <Badge variant="default" size="xs" color="gray">
                +{solution.technologies.length - 3}
              </Badge>
            )}
          </Group>
        )}

        <Group justify="space-between" mt="xs">
          <CriticalityBadge criticality={solution.criticality} />
          {solution.version && (
            <Group gap={4}>
              <IconGitBranch size={12} color="gray" />
              <Text size="xs" c="dimmed">{solution.version}</Text>
            </Group>
          )}
        </Group>
      </Stack>
    </Card>
  )
}