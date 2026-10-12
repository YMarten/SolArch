"use client"

import { useEffect, useState, useMemo } from "react"
import { SimpleGrid, Text, Stack, Title, Loader, Center, Alert, Paper, Group, ThemeIcon } from "@mantine/core"
import { IconAlertCircle, IconApps, IconShieldExclamation, IconHeadset, IconReplace } from "@tabler/icons-react"
import { solutionsService } from "@/services/solutions.service"
import { Solution } from "@/types/solution"
import { SolutionCard } from "@/components/solutions/SolutionCard"
import { SolutionFilters } from "@/components/solutions/SolutionFilters"
import { emptySolutionFilters, filterSolutions } from "@/lib/solution-filters"
import { SolutionPreview } from "@/components/solutions/SolutionPreview"

export default function SolutionsPage() {
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [previewSolution, setPreviewSolution] = useState<Solution | null>(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)
  const [filters, setFilters] = useState(emptySolutionFilters)

  useEffect(() => {
    solutionsService.getAll()
      .then(setSolutions)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => filterSolutions(solutions, filters), [solutions, filters])

  if (loading) {
    return (
      <Center h={400}>
        <Loader />
      </Center>
    )
  }

  if (error) {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        color="red"
        title="Error al cargar las soluciones"
        m="md"
      >
        {error}
      </Alert>
    )
  }

  return (
    <Stack p="xl" gap="lg" className="solutions-page">
      <Title order={2}>Catálogo de soluciones</Title>
      <SimpleGrid cols={{ base: 2, md: 4 }} spacing="sm" aria-label="Resumen del inventario">
        {[
          { label: "Total de soluciones", value: solutions.length, icon: IconApps, color: "blue" },
          { label: "Alta criticidad", value: solutions.filter(s => s.criticality === "HIGH").length, icon: IconShieldExclamation, color: "red" },
          { label: "Sin soporte vigente", value: solutions.filter(s => s.supportStatus === "NO").length, icon: IconHeadset, color: "orange" },
          { label: "Con iniciativa de retiro o sustitución", value: solutions.filter(s => s.hasReplacementInitiative).length, icon: IconReplace, color: "violet" },
        ].map(metric => <Paper key={metric.label} withBorder p="md" className="inventory-kpi">
          <Group justify="space-between" wrap="nowrap" gap="xs"><Text size="xs" c="dimmed" fw={550}>{metric.label}</Text><ThemeIcon size={28} radius="md" variant="light" color={metric.color}><metric.icon size={16} /></ThemeIcon></Group>
          <Text size="xl" fw={700} mt={4}>{metric.value}</Text>
        </Paper>)}
      </SimpleGrid>
      <Text size="xs" c="dimmed">Indicadores del inventario completo; los filtros se aplican al listado.</Text>

      <SolutionFilters filters={filters} onChange={setFilters} />

      <Text size="sm" c="dimmed" fw={500}>
        {filtered.length} {filtered.length === 1 ? "solución encontrada" : "soluciones encontradas"}
      </Text>

      {filtered.length === 0 ? (
        <Center h={300}>
          <Text c="dimmed">
            {solutions.length === 0
              ? "No hay soluciones registradas aún."
              : "No hay soluciones que coincidan con los filtros."}
          </Text>
        </Center>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing="sm">
          {filtered.map(solution => (
            <SolutionCard key={solution.id} solution={solution} onPreview={() => setPreviewSolution(solution)} />
          ))}
        </SimpleGrid>
      )}
      <SolutionPreview solution={previewSolution} onClose={() => setPreviewSolution(null)} />
    </Stack>
  )
}
