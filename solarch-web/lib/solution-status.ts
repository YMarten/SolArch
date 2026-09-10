import type { SolutionStatus, UsageStatus } from "@/types/solution"

export const statusExplanation = "El estado de uso indica cómo se utiliza la solución. El estado arquitectónico indica su ciclo de vida."
export const solutionStatusOptions: { value: SolutionStatus; label: string }[] = [
  { value: "ACTIVE", label: "Activa" },
  { value: "MAINTENANCE", label: "Solo mantenimiento" },
  { value: "DEPRECATED", label: "Obsoleta" },
  { value: "IN_SUBSTITUTION", label: "En sustitución" },
  { value: "IN_DEVELOPMENT", label: "En desarrollo" },
  { value: "RETIRED", label: "Retirada" },
]
export const usageStatusOptions: { value: UsageStatus; label: string }[] = [
  { value: "IN_USE", label: "En uso" },
  { value: "LIMITED_USE", label: "Uso limitado" },
  { value: "NOT_IN_USE", label: "Fuera de uso" },
]
