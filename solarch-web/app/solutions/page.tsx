"use client"

import { useEffect, useState, useMemo } from "react"
import { SimpleGrid, Text, Stack, Title, Loader, Center, Alert } from "@mantine/core"
import { IconAlertCircle } from "@tabler/icons-react"
import { solutionsService } from "@/services/solutions.service"
import { Solution } from "@/types/solution"
import { SolutionCard } from "@/components/solutions/SolutionCard"
import { SolutionFilters } from "@/components/solutions/SolutionFilters"

export default function SolutionsPage() {
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)
  const [filters, setFilters]     = useState({
    search:      "",
    status:      "",
    criticality: "",
    role:        "",
    usageStatus: "",
    hostingMode: "",
    managementModel: "",
    supportStatus: "",
    hasProblems: "",
    hasReplacementInitiative: "",
  })

  useEffect(() => {
    solutionsService.getAll()
      .then(setSolutions)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return solutions.filter(s => {
      const matchSearch =
        !filters.search ||
        s.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        s.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
        s.vendor?.toLowerCase().includes(filters.search.toLowerCase()) ||
        s.owner?.toLowerCase().includes(filters.search.toLowerCase()) ||
        s.businessProcess?.toLowerCase().includes(filters.search.toLowerCase()) ||
        s.knownDependencies?.toLowerCase().includes(filters.search.toLowerCase()) ||
        s.problemDetails?.toLowerCase().includes(filters.search.toLowerCase()) ||
        s.userGroups?.some(group => group.toLowerCase().includes(filters.search.toLowerCase()))

      const matchStatus =
        !filters.status || s.status === filters.status

      const matchCriticality =
        !filters.criticality || s.criticality === filters.criticality

      const matchRole =
        !filters.role || s.role === filters.role

      const matchSurvey =
        (!filters.usageStatus || s.usageStatus === filters.usageStatus) &&
        (!filters.hostingMode || s.hostingMode === filters.hostingMode) &&
        (!filters.managementModel || s.managementModel === filters.managementModel) &&
        (!filters.supportStatus || s.supportStatus === filters.supportStatus) &&
        (!filters.hasProblems || String(s.hasProblems) === filters.hasProblems) &&
        (!filters.hasReplacementInitiative || String(s.hasReplacementInitiative) === filters.hasReplacementInitiative)

      return matchSearch && matchStatus && matchCriticality && matchRole && matchSurvey
    })
  }, [solutions, filters])

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
            <SolutionCard key={solution.id} solution={solution} />
          ))}
        </SimpleGrid>
      )}
    </Stack>
  )
}
