"use client"

import { Card, Text, Group, Stack, Badge, ThemeIcon } from "@mantine/core"
import {
  IconGitBranch, IconDatabase, IconPuzzle,
  IconArrowsExchange, IconChartBar, IconDevices
} from "@tabler/icons-react"
import { Solution } from "@/types/solution"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { CriticalityBadge } from "@/components/ui/CriticalityBadge"
import { useRouter } from "next/navigation"

const roleConfig: Record<string, {
  label:  string
  color:  string
  icon:   React.ElementType
}> = {
  CORE_TRANSACTIONAL:  { label: "Core transaccional",       color: "indigo",  icon: IconDatabase        },
  SATELLITE:           { label: "Sistema satélite",          color: "violet",  icon: IconPuzzle          },
  INTEGRATION:         { label: "Plataforma de integración", color: "orange",  icon: IconArrowsExchange  },
  DATA_ANALYTICS:      { label: "Información y analítica",   color: "teal",    icon: IconChartBar        },
  INTERACTION_CHANNEL: { label: "Canal e interacción",       color: "pink",    icon: IconDevices         },
}

interface Props {
  solution: Solution
}

export function SolutionCard({ solution }: Props) {
  const router = useRouter()
  const role   = roleConfig[solution.role] ?? {
    label: solution.role,
    color: "gray",
    icon:  IconDatabase,
  }
  const Icon = role.icon

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
          <ThemeIcon
            variant="light"
            color={role.color}
            size="md"
            radius="md"
          >
            <Icon size={16} />
          </ThemeIcon>
        </Group>

        {solution.description && (
          <Text size="xs" c="dimmed" lineClamp={2}>
            {solution.description}
          </Text>
        )}

        <Badge
          variant="light"
          color={role.color}
          size="xs"
        >
          {role.label}
        </Badge>

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

        <StatusBadge status={solution.status} />
      </Stack>
    </Card>
  )
}