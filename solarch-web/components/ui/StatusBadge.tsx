import { Badge } from "@mantine/core"
import { SolutionStatus } from "@/types/solution"

const config: Record<SolutionStatus, { label: string; color: string }> = {
  ACTIVE:          { label: "Activa",          color: "green"  },
  DEPRECATED:      { label: "Deprecada",       color: "red"    },
  IN_SUBSTITUTION: { label: "En sustitución",  color: "orange" },
  IN_DEVELOPMENT:  { label: "En desarrollo",   color: "blue"   },
  MAINTENANCE:     { label: "Mantenimiento",   color: "yellow" },
}

export function StatusBadge({ status }: { status: SolutionStatus }) {
  const { label, color } = config[status]
  return <Badge color={color} variant="light" size="sm">{label}</Badge>
}