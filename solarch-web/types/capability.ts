export interface Capability {
  id: string
  name: string
  description?: string
  level: number
  domainId: string
  parentId?: string
}

export interface CreateCapabilityDTO {
  name: string
  description?: string
  level?: number
  domainId: string
  parentId?: string
}