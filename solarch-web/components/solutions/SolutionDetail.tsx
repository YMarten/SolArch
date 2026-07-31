"use client"

import {
  Stack, Group, Title, Text, Badge, Tabs, Button,
  ActionIcon, SimpleGrid, Paper, Anchor
} from "@mantine/core"
import {
  IconArrowLeft, IconEdit, IconGitBranch,
  IconUser, IconCode, IconCalendar, IconBrandGithub
} from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { Solution } from "@/types/solution"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { CriticalityBadge } from "@/components/ui/CriticalityBadge"
import { SolutionConnections } from "./SolutionConnections"
import { SolutionAttachments } from "./SolutionAttachments"
import { SolutionEnvironments } from "./SolutionEnvironments"
import { ReviewsList } from "@/components/reviews/ReviewsList"

const roleConfig: Record<string, {
  label: string
  color: string
}> = {
  CORE_TRANSACTIONAL: { label: "Core transaccional", color: "indigo" },
  SATELLITE: { label: "Sistema satélite", color: "violet" },
  INTEGRATION: { label: "Plataforma de integración", color: "orange" },
  DATA_ANALYTICS: { label: "Información y analítica", color: "teal" },
  INTERACTION_CHANNEL: { label: "Canal e interacción", color: "pink" },
}

const originLabels: Record<string, string> = {
  INTERNAL: "Interna",
  EXTERNAL: "Externa",
  CUSTOM_THIRD: "A medida (tercero)",
}

const typeLabels: Record<string, string> = {
  WEB: "Web",
  MOBILE: "Mobile",
  DESKTOP: "Desktop",
  API: "API",
  BATCH: "Batch",
  INTEGRATION: "Integración",
  INFRASTRUCTURE: "Infraestructura",
  OTHER: "Otro",
}

const roleLabels: Record<string, string> = {
  CORE_TRANSACTIONAL: "Core transaccional",
  SATELLITE: "Sistema satélite",
  INTEGRATION: "Plataforma de integración",
  DATA_ANALYTICS: "Información y analítica",
  INTERACTION_CHANNEL: "Canal e interacción",
}

interface Props {
  solution: Solution
}

export function SolutionDetail({ solution }: Props) {
  const router = useRouter()

  return (
    <Stack p="xl" gap="md">
      {/* Topbar */}
      <Group justify="space-between">
        <Group>
          <ActionIcon variant="subtle" onClick={() => router.push("/solutions")}>
            <IconArrowLeft size={18} />
          </ActionIcon>
          <Text size="sm" c="dimmed">Catálogo / {solution.name}</Text>
        </Group>
        <Button
          leftSection={<IconEdit size={14} />}
          onClick={() => router.push(`/solutions/${solution.id}/edit`)}
        >
          Editar
        </Button>
      </Group>

      {/* Hero */}
      <Paper withBorder p="lg" radius="md">
        <SimpleGrid cols={2} spacing="xl">
          <Stack gap="sm">
            <Group gap="xs" wrap="wrap">
              <Title order={3}>{solution.name}</Title>
              <StatusBadge status={solution.status} />
              <Badge variant="light" color="gray">
                {typeLabels[solution.type]}
              </Badge>
              <CriticalityBadge criticality={solution.criticality} />
              <Badge
                variant="light"
                color={roleConfig[solution.role]?.color ?? "gray"}
              >
                {roleConfig[solution.role]?.label ?? solution.role}
              </Badge>
              <Badge variant="light" color="gray">
                {originLabels[solution.origin]}
              </Badge>
              {solution.vendor && (
                <Badge variant="outline" color="gray">
                  {solution.vendor}
                </Badge>
              )}
            </Group>

            {solution.description && (
              <Text size="sm" c="dimmed">{solution.description}</Text>
            )}

            <Group gap="lg" wrap="wrap">
              {solution.owner && (
                <Group gap={4}>
                  <IconUser size={14} color="gray" />
                  <Text size="xs" c="dimmed">Funcional: <strong>{solution.owner}</strong></Text>
                </Group>
              )}
              {solution.techOwner && (
                <Group gap={4}>
                  <IconCode size={14} color="gray" />
                  <Text size="xs" c="dimmed">Técnico: <strong>{solution.techOwner}</strong></Text>
                </Group>
              )}
              {solution.version && (
                <Group gap={4}>
                  <IconGitBranch size={14} color="gray" />
                  <Text size="xs" c="dimmed"><strong>{solution.version}</strong></Text>
                </Group>
              )}
              {solution.lastDeploy && (
                <Group gap={4}>
                  <IconCalendar size={14} color="gray" />
                  <Text size="xs" c="dimmed">
                    Deploy: <strong>{new Date(solution.lastDeploy).toLocaleDateString("es")}</strong>
                  </Text>
                </Group>
              )}
              {solution.repoUrl && (
                <Group gap={4}>
                  <IconBrandGithub size={14} color="gray" />
                  <Anchor href={solution.repoUrl} target="_blank" size="xs">
                    {solution.repoUrl}
                  </Anchor>
                </Group>
              )}
            </Group>

            {solution.tags && solution.tags.length > 0 && (
              <Group gap="xs">
                {solution.tags.map(tag => (
                  <Badge key={tag} variant="default" size="xs">{tag}</Badge>
                ))}
              </Group>
            )}
          </Stack>

          {/* Stats */}
          <SimpleGrid cols={3} spacing="sm">
            <Paper withBorder p="sm" radius="md" ta="center">
              <Text size="xs" c="dimmed">Tecnologías</Text>
              <Text fw={500}>{solution.technologies?.length ?? 0}</Text>
            </Paper>
            <Paper withBorder p="sm" radius="md" ta="center">
              <Text size="xs" c="dimmed">Dominios</Text>
              <Text fw={500}>{solution.domains?.length ?? 0}</Text>
            </Paper>
            <Paper withBorder p="sm" radius="md" ta="center">
              <Text size="xs" c="dimmed">Áreas</Text>
              <Text fw={500}>{solution.areas?.length ?? 0}</Text>
            </Paper>
          </SimpleGrid>
        </SimpleGrid>
      </Paper>

      {/* Contexto de negocio y tecnologías */}
      <SimpleGrid cols={2} spacing="md">
        <Paper withBorder p="md" radius="md">
          <Text size="sm" fw={500} mb="sm">Contexto de negocio</Text>
          <Stack gap="xs">
            <div>
              <Text size="xs" c="dimmed">Dominios</Text>
              <Group gap="xs" mt={4}>
                {solution.domains && solution.domains.length > 0
                  ? solution.domains.map(({ domain }) => (
                    <Badge key={domain.id} variant="light">{domain.name}</Badge>
                  ))
                  : <Text size="xs" c="dimmed">Sin dominios asignados</Text>
                }
              </Group>
            </div>
            <div>
              <Text size="xs" c="dimmed">Áreas responsables</Text>
              <Group gap="xs" mt={4}>
                {solution.areas && solution.areas.length > 0
                  ? solution.areas.map(({ area }) => (
                    <Badge key={area.id} variant="light" color="orange">{area.name}</Badge>
                  ))
                  : <Text size="xs" c="dimmed">Sin áreas asignadas</Text>
                }
              </Group>
            </div>
          </Stack>
        </Paper>

        <Paper withBorder p="md" radius="md">
          <Text size="sm" fw={500} mb="sm">Tecnologías</Text>
          <Group gap="xs">
            {solution.technologies && solution.technologies.length > 0
              ? solution.technologies.map(({ technology }) => (
                <Badge key={technology.id} variant="light" color="blue">
                  {technology.name}
                </Badge>
              ))
              : <Text size="xs" c="dimmed">Sin tecnologías registradas</Text>
            }
          </Group>
        </Paper>
      </SimpleGrid>

      {/* Tabs */}
      <Tabs defaultValue="connections">
        <Tabs.List>
          <Tabs.Tab value="connections">Conexiones</Tabs.Tab>
          <Tabs.Tab value="attachments">Adjuntos</Tabs.Tab>
          <Tabs.Tab value="environments">Ambientes</Tabs.Tab>
          <Tabs.Tab value="reviews">Revisiones</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="connections" pt="md">
          <SolutionConnections solutionId={solution.id} />
        </Tabs.Panel>

        <Tabs.Panel value="attachments" pt="md">
          <SolutionAttachments solutionId={solution.id} />
        </Tabs.Panel>

        <Tabs.Panel value="environments" pt="md">
          <SolutionEnvironments solutionId={solution.id} />
        </Tabs.Panel>

        <Tabs.Panel value="reviews" pt="md">
          <ReviewsList solutionId={solution.id} />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  )
}