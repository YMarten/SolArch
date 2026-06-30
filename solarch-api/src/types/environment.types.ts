export interface CreateEnvironmentDTO {
  name: string
  url?: string
  isActive?: boolean
  notes?: string
  solutionId: string
}

export interface UpdateEnvironmentDTO extends Partial<CreateEnvironmentDTO> {}