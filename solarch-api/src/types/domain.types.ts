export interface CreateDomainDTO {
  name: string
  description?: string
  parentId?: string
}

export interface UpdateDomainDTO extends Partial<CreateDomainDTO> {}