import { Badge } from "@mantine/core"
import { SolutionStatus } from "@/types/solution"

const config: Record<SolutionStatus, { label: string; color: string }> = {
  ACTIVE:          { label: "Activa",          color: "green"  },
  DEPRECATED:      { label: "Obsoleta",       color: "red"    },
  IN_SUBSTITUTION: { label: "En sustitución",  color: "orange" },
  IN_DEVELOPMENT:  { label: "En desarrollo",   color: "blue"   },
  MAINTENANCE:     { label: "Solo mantenimiento",   color: "yellow" },
  RETIRED:         { label: "Retirada", color: "gray" },
}

export function StatusBadge({ status }: { status: SolutionStatus }) {
  const { label, color } = config[status]
  return <Badge color={color} variant="light" size="sm">{label}</Badge>
}
