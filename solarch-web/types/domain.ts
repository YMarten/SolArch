export interface Domain {
  id: string
  name: string
  description?: string
  parentId?: string
}

export interface CreateDomainDTO {
  name: string
  description?: string
  parentId?: string
}