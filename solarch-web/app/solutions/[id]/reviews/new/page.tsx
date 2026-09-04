"use client"

import { useEffect, useState } from "react"
import { Loader, Center } from "@mantine/core"
import { useParams } from "next/navigation"
import { solutionsService } from "@/services/solutions.service"
import { ReviewForm } from "@/components/reviews/ReviewForm"

export default function NewReviewPage() {
  const { id } = useParams<{ id: string }>()
  const [name, setName]   = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    solutionsService.getById(id)
      .then(s => setName(s.name))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Center h={400}><Loader /></Center>

  return <ReviewForm solutionId={id} solutionName={name} />
}