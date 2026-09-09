"use client"

import { useEffect, useState } from "react"
import { Alert, Loader, Center } from "@mantine/core"
import { SolutionForm } from "@/components/solutions/SolutionForm"
import { technologiesService } from "@/services/technologies.service"
import { domainsService } from "@/services/domains.service"
import { areasService } from "@/services/areas.service"
import { capabilitiesService } from "@/services/capabilities.service"
import { Technology } from "@/types/technology"
import { Domain } from "@/types/domain"
import { Area } from "@/types/area"
import { Capability } from "@/types/capability"
import { Solution } from "@/types/solution"
import { solutionsService } from "@/services/solutions.service"

export default function NewSolutionPage() {
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [domains, setDomains]           = useState<Domain[]>([])
  const [areas, setAreas]               = useState<Area[]>([])
  const [capabilities, setCapabilities] = useState<Capability[]>([])
  const [loading, setLoading]           = useState(true)
  const [solutions, setSolutions]       = useState<Solution[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      technologiesService.getAll(),
      domainsService.getAll(),
      areasService.getAll(),
      capabilitiesService.getAll(),
      solutionsService.getAll(),
    ]).then(([techs, doms, areas, caps, sols]) => {
      setTechnologies(techs)
      setDomains(doms)
      setAreas(areas)
      setCapabilities(caps)
      setSolutions(sols)
    }).catch((error: unknown) => {
      setError(error instanceof Error ? error.message : "No se pudieron cargar los catálogos")
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <Center h={400}><Loader /></Center>
  if (error) return <Alert color="red" title="No se pudo cargar el formulario" m="xl">{error}</Alert>

  return (
    <SolutionForm
      technologies={technologies}
      domains={domains}
      areas={areas}
      capabilities={capabilities}
      solutions={solutions}
    />
  )
}
