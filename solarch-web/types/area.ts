export interface Area {
  id: string
  name: string
  description?: string
}

export interface CreateAreaDTO {
  name: string
  description?: string
}