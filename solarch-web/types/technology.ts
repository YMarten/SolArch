export type TechCategory =
  | "LANGUAGE"
  | "FRAMEWORK"
  | "DATABASE"
  | "INFRASTRUCTURE"
  | "MESSAGING"
  | "SECURITY"
  | "MONITORING"
  | "OTHER"

export interface Technology {
  id: string
  name: string
  category: TechCategory
  description?: string
}

export interface CreateTechnologyDTO {
  name: string
  category: TechCategory
  description?: string
}