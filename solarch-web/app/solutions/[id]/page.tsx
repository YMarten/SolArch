"use client"

import { useEffect, useState } from "react"
import { Loader, Center } from "@mantine/core"
import { useParams } from "next/navigation"
import { solutionsService } from "@/services/solutions.service"
import { Solution } from "@/types/solution"
import { SolutionDetail } from "@/components/solutions/SolutionDetail"
import { notFound } from "next/navigation"

export default function SolutionDetailPage() {
  const { id }                        = useParams<{ id: string }>()
  const [solution, setSolution]       = useState<Solution | null>(null)
  const [loading, setLoading]         = useState(true)
  const [notFoundError, setNotFound]  = useState(false)

  useEffect(() => {
    solutionsService.getById(id)
      .then(setSolution)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Center h={400}><Loader /></Center>
  if (notFoundError) return notFound()

  return solution ? <SolutionDetail solution={solution} /> : null
}