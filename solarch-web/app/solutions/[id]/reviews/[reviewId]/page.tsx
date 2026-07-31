import { reviewsService } from "@/services/reviews.service"
import { solutionsService } from "@/services/solutions.service"
import { notFound } from "next/navigation"
import { ReviewDetail } from "@/components/reviews/ReviewDetail"
import { Stack, Title, Text, Group, ActionIcon, Button } from "@mantine/core"

interface Props {
  params: Promise<{ id: string; reviewId: string }>
}

export default async function ReviewDetailPage({ params }: Props) {
  const { id, reviewId } = await params

  const [solution, review] = await Promise.all([
    solutionsService.getById(id).catch(() => null),
    reviewsService.getById(reviewId).catch(() => null),
  ])

  if (!solution || !review) notFound()

  return (
    <Stack p="xl" gap="md" maw={860} mx="auto">
      <Group>
        <Stack gap={0}>
          <Title order={3}>Revisión arquitectónica</Title>
          <Text size="sm" c="dimmed">{solution.name}</Text>
        </Stack>
      </Group>
      <ReviewDetail review={review} />
    </Stack>
  )
}