"use client"

import { useEffect, useState } from "react"
import { Loader, Center, Stack, Title, Text, Group } from "@mantine/core"
import { useParams } from "next/navigation"
import { solutionsService } from "@/services/solutions.service"
import { reviewsService } from "@/services/reviews.service"
import { ArchReview } from "@/types/review"
import { Solution } from "@/types/solution"
import { ReviewDetail } from "@/components/reviews/ReviewDetail"

export default function ReviewDetailPage() {
  const { id, reviewId }              = useParams<{ id: string; reviewId: string }>()
  const [solution, setSolution]       = useState<Solution | null>(null)
  const [review, setReview]           = useState<ArchReview | null>(null)
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    Promise.all([
      solutionsService.getById(id),
      reviewsService.getById(reviewId),
    ]).then(([sol, rev]) => {
      setSolution(sol)
      setReview(rev)
    }).finally(() => setLoading(false))
  }, [id, reviewId])

  if (loading) return <Center h={400}><Loader /></Center>
  if (!solution || !review) return null

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