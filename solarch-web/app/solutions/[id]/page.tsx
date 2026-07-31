import { solutionsService } from "@/services/solutions.service"
import { notFound } from "next/navigation"
import { SolutionDetail } from "@/components/solutions/SolutionDetail"

interface Props {
  params: Promise<{ id: string }>
}

export default async function SolutionDetailPage({ params }: Props) {
  const { id } = await params
  const solution = await solutionsService.getById(id).catch(() => null)

  if (!solution) notFound()

  return <SolutionDetail solution={solution} />
}