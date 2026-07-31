export type ReviewResult =
  | "COMPLIANT"
  | "COMPLIANT_WITH_NOTES"
  | "NON_COMPLIANT"
  | "IN_REVIEW"

export type ReviewDimensionType =
  | "SECURITY"
  | "SCALABILITY"
  | "MAINTAINABILITY"
  | "DOCUMENTATION"
  | "TECH_ALIGNMENT"
  | "INTEGRATION_PATTERNS"
  | "DATA_MANAGEMENT"
  | "RESILIENCE"
  | "OTHER"

export type ActionStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"

export interface ReviewDimension {
  id:          string
  dimension:   ReviewDimensionType
  result:      ReviewResult
  observation?: string
}

export interface ReviewAction {
  id:          string
  description: string
  responsible: string
  dueDate?:    string
  status:      ActionStatus
  notes?:      string
}

export interface ArchReview {
  id:              string
  solutionId:      string
  reviewedAt:      string
  reviewedBy:      string
  result:          ReviewResult
  summary?:        string
  reviewedVersion?: string
  nextReviewDate?: string
  dimensions:      ReviewDimension[]
  actions:         ReviewAction[]
  solution?:       { id: string; name: string }
}

export interface CreateReviewDTO {
  solutionId:       string
  reviewedAt:       string
  reviewedBy:       string
  result:           ReviewResult
  summary?:         string
  reviewedVersion?: string
  nextReviewDate?:  string
  dimensions?:      Omit<ReviewDimension, "id">[]
  actions?:         Omit<ReviewAction, "id" | "status">[]
}

export interface UpdateReviewActionDTO {
  description?:  string
  responsible?:  string
  dueDate?:      string
  status?:       ActionStatus
  notes?:        string
}