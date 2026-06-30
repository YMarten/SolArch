import { ReviewResult, ReviewDimensionType, ActionStatus } from "@prisma/client"

export interface CreateReviewDimensionDTO {
  dimension: ReviewDimensionType
  result: ReviewResult
  observation?: string
}

export interface CreateReviewActionDTO {
  description: string
  responsible: string
  dueDate?: Date
  notes?: string
}

export interface CreateReviewDTO {
  solutionId: string
  reviewedAt: Date
  reviewedBy: string
  result: ReviewResult
  summary?: string
  reviewedVersion?: string
  nextReviewDate?: Date
  dimensions?: CreateReviewDimensionDTO[]
  actions?: CreateReviewActionDTO[]
}

export interface UpdateReviewActionDTO {
  description?: string
  responsible?: string
  dueDate?: Date
  status?: ActionStatus
  notes?: string
}

export interface UpdateReviewDTO {
  reviewedAt?: Date
  reviewedBy?: string
  result?: ReviewResult
  summary?: string
  reviewedVersion?: string
  nextReviewDate?: Date
}