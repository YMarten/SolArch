"use client"

import { useEffect, useState } from "react"
import { Loader, Center } from "@mantine/core"
import { useParams } from "next/navigation"
import { SolutionForm } from "@/components/solutions/SolutionForm"
import { solutionsService } from "@/services/solutions.service"
import { technologiesService } from "@/services/technologies.service"
import { domainsService } from "@/services/domains.service"
import { areasService } from "@/services/areas.service"
import { capabilitiesService } from "@/services/capabilities.service"
import { Solution } from "@/types/solution"
import { Technology } from "@/types/technology"
import { Domain } from "@/types/domain"
import { Area } from "@/types/area"
import { Capability } from "@/types/capability"

export default function EditSolutionPage() {
  const { id } = useParams<{ id: string }>()

  const [solution, setSolution]         = useState<Solution | null>(null)
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [domains, setDomains]           = useState<Domain[]>([])
  const [areas, setAreas]               = useState<Area[]>([])
  const [capabilities, setCapabilities] = useState<Capability[]>([])
  const [loading, setLoading]           = useState(true)
  const [solutions, setSolutions]       = useState<Solution[]>([])

  useEffect(() => {
    Promise.all([
      solutionsService.getById(id),
      technologiesService.getAll(),
      domainsService.getAll(),
      areasService.getAll(),
      capabilitiesService.getAll(),
      solutionsService.getAll(),
    ]).then(([sol, techs, doms, areas, caps, sols]) => {
      setSolution(sol)
      setTechnologies(techs)
      setDomains(doms)
      setAreas(areas)
      setCapabilities(caps)
      setSolutions(sols)
    }).finally(() => setLoading(false))
  }, [id])

  if (loading || !solution) return <Center h={400}><Loader /></Center>

  return (
    <SolutionForm
      solutionId={solution.id}
      technologies={technologies}
      domains={domains}
      areas={areas}
      capabilities={capabilities}
      solutions={solutions}
      initialValues={{
        name:          solution.name,
        description:   solution.description,
        version:       solution.version,
        status:        solution.status,
        type:          solution.type,
        role:          solution.role,
        criticality:   solution.criticality,
        origin:        solution.origin,
        vendor:        solution.vendor,
        owner:         solution.owner,
        techOwner:     solution.techOwner,
        repoUrl:       solution.repoUrl,
        lastDeploy:    solution.lastDeploy?.split("T")[0],
        tags:          solution.tags,
        responsibleAreaId: solution.responsibleAreaId ?? null,
        businessProcess: solution.businessProcess,
        userGroups: solution.userGroups,
        usageStatus: solution.usageStatus ?? null,
        usageFrequency: solution.usageFrequency,
        hasSimilarSolution: solution.hasSimilarSolution,
        similarSolutionId: solution.similarSolutionId ?? null,
        supportStatus: solution.supportStatus,
        receivesUpdates: solution.receivesUpdates,
        licenseStatus: solution.licenseStatus,
        hostingMode: solution.hostingMode,
        knownDependencies: solution.knownDependencies,
        failureImpact: solution.failureImpact,
        failureImpactDetails: solution.failureImpactDetails,
        hasProblems: solution.hasProblems,
        problemDetails: solution.problemDetails,
        hasReplacementInitiative: solution.hasReplacementInitiative,
        replacementSolutionId: solution.replacementSolutionId ?? null,
        proposedReplacementName: solution.proposedReplacementName,
        additionalNotes: solution.additionalNotes,
        technologyIds: solution.technologies?.map(t => t.technology.id) ?? [],
        domainIds:     solution.domains?.map(d => d.domain.id) ?? [],
        areaIds:       solution.areas?.map(a => a.area.id) ?? [],
        capabilityIds: solution.capabilities?.map(c => c.capability.id) ?? [],
      }}
    />
  )
}
