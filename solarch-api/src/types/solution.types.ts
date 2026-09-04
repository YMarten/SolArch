import {
  SolutionStatus,
  SolutionType,
  SolutionRole,
  SolutionOrigin,
  Criticality,
  UsageStatus,
  UsageFrequency,
  AnswerStatus,
  HostingMode,
  FailureImpact
} from "@prisma/client"

export interface CreateSolutionDTO {
  name: string
  description?: string
  version?: string
  status: SolutionStatus
  type: SolutionType
  role: SolutionRole
  criticality: Criticality
  origin: SolutionOrigin
  vendor?: string
  owner: string
  techOwner?: string
  repoUrl?: string
  lastDeploy?: Date
  tags?: string[]
  responsibleAreaId?: string | null
  businessProcess?: string
  userGroups?: string[]
  usageStatus?: UsageStatus | null
  usageFrequency?: UsageFrequency | null
  hasSimilarSolution?: boolean
  similarSolutionId?: string | null
  supportStatus?: AnswerStatus
  receivesUpdates?: AnswerStatus
  licenseStatus?: AnswerStatus
  hostingMode?: HostingMode
  knownDependencies?: string
  failureImpact?: FailureImpact
  failureImpactDetails?: string
  hasProblems?: boolean
  problemDetails?: string
  hasReplacementInitiative?: boolean
  replacementSolutionId?: string | null
  proposedReplacementName?: string
  additionalNotes?: string
  // Relaciones
  technologyIds?: string[]
  domainIds?: string[]
  capabilityIds?: string[]
  areaIds?: string[]
}

export interface UpdateSolutionDTO extends Partial<CreateSolutionDTO> {}
