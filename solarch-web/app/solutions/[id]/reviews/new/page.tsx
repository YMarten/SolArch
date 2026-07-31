import { solutionsService } from "@/services/solutions.service"
import { notFound } from "next/navigation"
import { ReviewForm } from "@/components/reviews/ReviewForm"

interface Props {
  params: Promise<{ id: string }>
}

export default async function NewReviewPage({ params }: Props) {
  const { id } = await params
  const solution = await solutionsService.getById(id).catch(() => null)

  if (!solution) notFound()

  return (
    <ReviewForm
      solutionId={solution.id}
      solutionName={solution.name}
    />
  )
}