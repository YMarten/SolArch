import { Solution } from "./solution"

export type SolutionParticipation = "NEW" | "REUSED" | "ADAPTED"
export const participationOptions = [
  { value: "NEW", label: "Nueva", description: "Se crea o incorpora una nueva solución para cubrir las necesidades de este proyecto o iniciativa." },
  { value: "REUSED", label: "Reutilizada", description: "Se utiliza una solución existente, sin modificar sus funcionalidades para este proyecto o iniciativa." },
  { value: "ADAPTED", label: "Adaptada", description: "Se modifica o amplía una solución existente para cubrir las necesidades de este proyecto o iniciativa." },
]
export interface SolutionGroup {
  id: string
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
  members: {
    groupId: string
    solutionId: string
    participation: SolutionParticipation
    solution: Pick<Solution, "id" | "name" | "description" | "status">
  }[]
}
export interface GroupInput { name: string; description?: string | null }
