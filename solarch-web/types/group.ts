import { Solution } from "./solution"

export type SolutionParticipation = "NEW" | "REUSED" | "ADAPTED"
export const participationOptions = [
  { value: "NEW", label: "Nueva" },
  { value: "REUSED", label: "Reutilizada" },
  { value: "ADAPTED", label: "Adaptada" },
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
