import { solutionsService } from "@/services/solutions.service"
import { technologiesService } from "@/services/technologies.service"
import { domainsService } from "@/services/domains.service"
import { areasService } from "@/services/areas.service"
import { capabilitiesService } from "@/services/capabilities.service"
import { SolutionForm } from "@/components/solutions/SolutionForm"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditSolutionPage({ params }: Props) {
  const { id } = await params

const [solution, technologies, domains, areas, capabilities] = await Promise.all([
  solutionsService.getById(id).catch(() => null),
  technologiesService.getAll(),
  domainsService.getAll(),
  areasService.getAll(),
  capabilitiesService.getAll(),
])

  if (!solution) notFound()

  return (
    <SolutionForm
      solutionId={solution.id}
      technologies={technologies}
      domains={domains}
      areas={areas}
      capabilities={capabilities}
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
        tags:          solution.tags,
        technologyIds: solution.technologies?.map(t => t.technology.id) ?? [],
        domainIds:     solution.domains?.map(d => d.domain.id) ?? [],
        areaIds:       solution.areas?.map(a => a.area.id) ?? [],
        capabilityIds: solution.capabilities?.map(c => c.capability.id) ?? [],
      }}
    />
  )
}