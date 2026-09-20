import type { SolutionStatus, UsageStatus } from "@/types/solution"

export const statusExplanation = "El estado de uso indica cómo se utiliza la solución. El estado arquitectónico indica su ciclo de vida."
export const solutionStatusOptions: { value: SolutionStatus; label: string; description: string }[] = [
  {"value":"ACTIVE","label":"Activa","description":"Forma parte de la arquitectura vigente y puede evolucionar."},
  {"value":"MAINTENANCE","label":"Solo mantenimiento","description":"Se mantiene operativa con correcciones, sin evolución funcional planificada."},
  {"value":"DEPRECATED","label":"Obsoleta","description":"Ya no es la opción recomendada; puede seguir en uso mientras se define su futuro."},
  {"value":"IN_SUBSTITUTION","label":"En sustitución","description":"Está en proceso de reemplazo por otra solución."},
  {"value":"IN_DEVELOPMENT","label":"En desarrollo","description":"Está en construcción o preparación para su puesta en operación."},
  {"value":"RETIRED","label":"Retirada","description":"Su retiro de la operación se ha completado."},
]
export const usageStatusOptions: { value: UsageStatus; label: string; description: string }[] = [
  {"value":"IN_USE","label":"En uso","description":"Se utiliza actualmente para sus funciones previstas."},
  {"value":"LIMITED_USE","label":"Uso limitado","description":"Se utiliza solo para algunos usuarios, funciones o casos específicos."},
  {"value":"NOT_IN_USE","label":"Fuera de uso","description":"Actualmente no se utiliza, aunque todavía puede estar instalada."},
]
