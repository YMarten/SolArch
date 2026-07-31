"use client"

import { useEffect, useState } from "react"
import {
  Stack, Title, Text, Group, Paper, Badge,
  Loader, Center, SimpleGrid, Tooltip
} from "@mantine/core"
import { domainsService } from "@/services/domains.service"
import { capabilitiesService } from "@/services/capabilities.service"
import { solutionsService } from "@/services/solutions.service"
import { Domain } from "@/types/domain"
import { Capability } from "@/types/capability"
import { Solution } from "@/types/solution"

interface CapabilityWithCount extends Capability {
  solutionCount: number
  solutions:     Solution[]
}

interface DomainWithCapabilities extends Domain {
  capabilities: CapabilityWithCount[]
}

function getHeatColor(count: number, max: number): string {
  if (count === 0) return "var(--mantine-color-gray-1)"
  const ratio = count / Math.max(max, 1)
  if (ratio >= 0.75) return "var(--mantine-color-blue-6)"
  if (ratio >= 0.5)  return "var(--mantine-color-blue-4)"
  if (ratio >= 0.25) return "var(--mantine-color-blue-2)"
  return "var(--mantine-color-blue-1)"
}

function getTextColor(count: number, max: number): string {
  const ratio = count / Math.max(max, 1)
  return ratio >= 0.5 ? "white" : "var(--mantine-color-dark-6)"
}

export function CapabilityMap() {
  const [data, setData]       = useState<DomainWithCapabilities[]>([])
  const [loading, setLoading] = useState(true)
  const [maxCount, setMaxCount] = useState(1)
  const [selected, setSelected] = useState<CapabilityWithCount | null>(null)

  useEffect(() => {
    Promise.all([
      domainsService.getAll(),
      capabilitiesService.getAll(),
      solutionsService.getAll(),
    ]).then(([domains, capabilities, solutions]) => {
      let max = 0

      const mapped: DomainWithCapabilities[] = domains.map(domain => {
        const domainCaps = capabilities.filter(c => c.domainId === domain.id)

        const capsWithCount: CapabilityWithCount[] = domainCaps.map(cap => {
          const capSolutions = solutions.filter(s =>
            s.capabilities?.some(sc => sc.capability.id === cap.id)
          )
          if (capSolutions.length > max) max = capSolutions.length
          return {
            ...cap,
            solutionCount: capSolutions.length,
            solutions:     capSolutions,
          }
        })

        return {
          ...domain,
          capabilities: capsWithCount,
        }
      }).filter(d => d.capabilities.length > 0)

      setMaxCount(max || 1)
      setData(mapped)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <Center h={400}><Loader /></Center>

  if (data.length === 0) {
    return (
      <Center h={400}>
        <Stack align="center" gap="xs">
          <Text c="dimmed">No hay dominios ni capacidades registrados.</Text>
          <Text size="xs" c="dimmed">
            Agrega dominios y capacidades desde los catálogos para ver el mapa.
          </Text>
        </Stack>
      </Center>
    )
  }

  return (
    <Stack gap="xl" p="xl">
      <Group justify="space-between" align="flex-start">
        <Stack gap={4}>
          <Title order={2}>Mapa de capacidades</Title>
          <Text size="sm" c="dimmed">
            Visualización de capacidades empresariales por dominio y su cobertura de soluciones.
          </Text>
        </Stack>

        {/* Leyenda */}
        <Stack gap={4}>
          <Text size="xs" c="dimmed" fw={500}>Cobertura</Text>
          <Group gap="xs">
            {[
              { label: "Sin cobertura", color: "var(--mantine-color-gray-1)"  },
              { label: "Baja",          color: "var(--mantine-color-blue-1)"  },
              { label: "Media",         color: "var(--mantine-color-blue-3)"  },
              { label: "Alta",          color: "var(--mantine-color-blue-5)"  },
              { label: "Máxima",        color: "var(--mantine-color-blue-7)"  },
            ].map(l => (
              <Group key={l.label} gap={4}>
                <div style={{
                  width:        14,
                  height:       14,
                  borderRadius: 3,
                  background:   l.color,
                  border:       "1px solid var(--mantine-color-gray-3)",
                }} />
                <Text size="xs" c="dimmed">{l.label}</Text>
              </Group>
            ))}
          </Group>
        </Stack>
      </Group>

      {/* Mapa por dominio */}
      <Stack gap="xl">
        {data.map(domain => (
          <Paper key={domain.id} withBorder radius="md" p="md">
            <Group mb="md" gap="sm">
              <Text fw={600} size="md">{domain.name}</Text>
              <Badge variant="light" size="sm">
                {domain.capabilities.length} capacidades
              </Badge>
              {domain.description && (
                <Text size="xs" c="dimmed">{domain.description}</Text>
              )}
            </Group>

            <SimpleGrid
              cols={{ base: 2, sm: 3, md: 4, lg: 5 }}
              spacing="sm"
            >
              {domain.capabilities.map(cap => (
                <Tooltip
                  key={cap.id}
                  label={
                    <Stack gap={4} p={4}>
                      <Text size="xs" fw={500}>{cap.name}</Text>
                      <Text size="xs">
                        {cap.solutionCount === 0
                          ? "Sin soluciones asignadas"
                          : `${cap.solutionCount} solución${cap.solutionCount > 1 ? "es" : ""}`
                        }
                      </Text>
                      {cap.solutions.length > 0 && (
                        <Stack gap={2}>
                          {cap.solutions.map(s => (
                            <Text key={s.id} size="xs" c="dimmed">· {s.name}</Text>
                          ))}
                        </Stack>
                      )}
                    </Stack>
                  }
                  withArrow
                  multiline
                  maw={200}
                >
                  <Paper
                    p="sm"
                    radius="md"
                    style={{
                      background:  getHeatColor(cap.solutionCount, maxCount),
                      cursor:      "pointer",
                      border:      selected?.id === cap.id
                        ? "2px solid var(--mantine-color-blue-6)"
                        : "1px solid var(--mantine-color-gray-3)",
                      transition:  "transform 0.1s",
                    }}
                    onClick={() => setSelected(
                      selected?.id === cap.id ? null : cap
                    )}
                  >
                    <Text
                      size="xs"
                      fw={500}
                      ta="center"
                      lineClamp={2}
                      style={{ color: getTextColor(cap.solutionCount, maxCount) }}
                    >
                      {cap.name}
                    </Text>
                    <Text
                      size="xs"
                      ta="center"
                      mt={4}
                      style={{ color: getTextColor(cap.solutionCount, maxCount) }}
                    >
                      {cap.solutionCount > 0 ? cap.solutionCount : "—"}
                    </Text>
                  </Paper>
                </Tooltip>
              ))}
            </SimpleGrid>
          </Paper>
        ))}
      </Stack>

      {/* Panel de detalle de capacidad seleccionada */}
      {selected && (
        <Paper withBorder p="md" radius="md">
          <Group justify="space-between" mb="sm">
            <Group gap="sm">
              <Text fw={500}>{selected.name}</Text>
              <Badge variant="light">
                {selected.solutionCount} solución{selected.solutionCount !== 1 ? "es" : ""}
              </Badge>
            </Group>
            <Text
              size="xs"
              c="dimmed"
              style={{ cursor: "pointer" }}
              onClick={() => setSelected(null)}
            >
              Cerrar
            </Text>
          </Group>

          {selected.description && (
            <Text size="sm" c="dimmed" mb="sm">{selected.description}</Text>
          )}

          {selected.solutions.length === 0 ? (
            <Text size="sm" c="dimmed">
              Ninguna solución soporta esta capacidad todavía.
            </Text>
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="sm">
              {selected.solutions.map(s => (
                <Paper
                  key={s.id}
                  withBorder
                  p="sm"
                  radius="md"
                  style={{ cursor: "pointer" }}
                  onClick={() => window.location.href = `/solutions/${s.id}`}
                >
                  <Text size="sm" fw={500}>{s.name}</Text>
                  <Text size="xs" c="dimmed">{s.status}</Text>
                </Paper>
              ))}
            </SimpleGrid>
          )}
        </Paper>
      )}
    </Stack>
  )
}