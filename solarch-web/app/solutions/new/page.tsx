import { solutionsService } from "@/services/solutions.service"
import { technologiesService } from "@/services/technologies.service"
import { domainsService } from "@/services/domains.service"
import { areasService } from "@/services/areas.service"
import { SolutionForm } from "@/components/solutions/SolutionForm"

export default async function NewSolutionPage() {
  const [technologies, domains, areas] = await Promise.all([
    technologiesService.getAll(),
    domainsService.getAll(),
    areasService.getAll(),
  ])

  return (
    <SolutionForm
      technologies={technologies}
      domains={domains}
      areas={areas}
    />
  )
}