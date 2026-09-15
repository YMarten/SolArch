import type { Technology } from "./technology"
import type { Domain } from "./domain"
import type { Area } from "./area"
import type { Capability } from "./capability"

export type SolutionStatus =
  | "ACTIVE"
  | "DEPRECATED"
  | "IN_SUBSTITUTION"
  | "IN_DEVELOPMENT"
  | "MAINTENANCE"
  | "RETIRED"

export type SolutionType =
  | "WEB"
  | "DESKTOP"
  | "MOBILE"
  | "API"
  | "BATCH"
  | "INTEGRATION"
  | "INFRASTRUCTURE"
  | "OTHER"

export type SolutionRole =
  | "CORE_TRANSACTIONAL"
  | "SATELLITE"
  | "INTEGRATION"
  | "DATA_ANALYTICS"

export type SolutionOrigin =
  | "INTERNAL"
  | "EXTERNAL"
  | "CUSTOM_THIRD"

export type Criticality = "HIGH" | "MEDIUM" | "LOW"
export type UsageStatus = "IN_USE" | "LIMITED_USE" | "NOT_IN_USE"
export type UsageFrequency = "CONTINUOUS" | "DAILY" | "WEEKLY" | "MONTHLY" | "OCCASIONAL" | "UNKNOWN"
export type AnswerStatus = "YES" | "NO" | "UNKNOWN"
export type HostingMode = "ON_PREMISE" | "CLOUD_COMPANY" | "EXTERNAL" | "HYBRID" | "UNKNOWN"
export type ManagementModel = "COMPANY_MANAGED" | "PROVIDER_MANAGED" | "SHARED_MANAGEMENT" | "UNKNOWN"
export type FailureImpact = "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN"

export interface Solution {
  id: string
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
  lastDeploy?: string
  tags: string[]
  responsibleAreaId?: string
  responsibleArea?: Area
  businessProcess?: string
  userGroups: string[]
  usageStatus?: UsageStatus | null
  legacyUsageStatus?: string | null
  usageFrequency?: UsageFrequency
  hasSimilarSolution: boolean
  similarSolutionId?: string
  similarSolution?: Pick<Solution, "id" | "name">
  supportStatus: AnswerStatus
  receivesUpdates: AnswerStatus
  licenseStatus: AnswerStatus
  hostingMode: HostingMode
  managementModel: ManagementModel
  knownDependencies?: string
  failureImpact: FailureImpact
  failureImpactDetails?: string
  hasProblems: boolean
  problemDetails?: string
  hasReplacementInitiative: boolean
  replacementSolutionId?: string
  replacementSolution?: Pick<Solution, "id" | "name">
  proposedReplacementName?: string
  additionalNotes?: string
  createdAt: string
  updatedAt: string
  technologies?: { technology: Technology }[]
  domains?: { domain: Domain }[]
  areas?: { area: Area }[]
  capabilities?: { capability: Capability }[]
}

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
  lastDeploy?: string
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
  managementModel?: ManagementModel
  knownDependencies?: string
  failureImpact?: FailureImpact
  failureImpactDetails?: string
  hasProblems?: boolean
  problemDetails?: string
  hasReplacementInitiative?: boolean
  replacementSolutionId?: string | null
  proposedReplacementName?: string
  additionalNotes?: string
  technologyIds?: string[]
  domainIds?: string[]
  capabilityIds?: string[]
  areaIds?: string[]
}

export type UpdateSolutionDTO = Partial<CreateSolutionDTO>
