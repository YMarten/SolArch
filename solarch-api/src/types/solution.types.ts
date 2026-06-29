import {
  SolutionStatus,
  SolutionType,
  SolutionRole,
  SolutionOrigin,
  Criticality
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
  // Relaciones
  technologyIds?: string[]
  domainIds?: string[]
  capabilityIds?: string[]
  areaIds?: string[]
}

export interface UpdateSolutionDTO extends Partial<CreateSolutionDTO> {}