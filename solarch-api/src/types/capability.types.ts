export interface CreateCapabilityDTO {
  name: string
  description?: string
  level?: number
  parentId?: string
  domainId: string
}

export interface UpdateCapabilityDTO extends Partial<CreateCapabilityDTO> {}