"use client"

import { useEffect, useState, useMemo } from "react"
import { SimpleGrid, Text, Stack, Title, Loader, Center, Alert } from "@mantine/core"
import { IconAlertCircle } from "@tabler/icons-react"
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
    <Stack p="xl" gap="md">
      <Title order={2}>Catálogo de soluciones</Title>

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
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
          {filtered.map(solution => (
            <SolutionCard key={solution.id} solution={solution} onPreview={() => setPreviewSolution(solution)} />
          ))}
        </SimpleGrid>
      )}
      <SolutionPreview solution={previewSolution} onClose={() => setPreviewSolution(null)} />
    </Stack>
  )
}
