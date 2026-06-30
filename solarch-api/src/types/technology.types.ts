import { TechCategory } from "@prisma/client"

export interface CreateTechnologyDTO {
  name: string
  category: TechCategory
  description?: string
}

export interface UpdateTechnologyDTO extends Partial<CreateTechnologyDTO> {}