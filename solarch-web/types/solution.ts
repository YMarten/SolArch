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
  | "INTERACTION_CHANNEL"

export type SolutionOrigin =
  | "INTERNAL"
  | "EXTERNAL"
  | "CUSTOM_THIRD"

export type Criticality = "HIGH" | "MEDIUM" | "LOW"

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
  technologyIds?: string[]
  domainIds?: string[]
  capabilityIds?: string[]
  areaIds?: string[]
}

export interface UpdateSolutionDTO extends Partial<CreateSolutionDTO> {}