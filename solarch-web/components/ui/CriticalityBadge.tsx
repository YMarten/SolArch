import { Badge } from "@mantine/core"
import { Criticality } from "@/types/solution"

const config: Record<Criticality, { label: string; color: string }> = {
  HIGH:   { label: "Alta criticidad",   color: "red"    },
  MEDIUM: { label: "Media criticidad",  color: "yellow" },
  LOW:    { label: "Baja criticidad",   color: "gray"   },
}

export function CriticalityBadge({ criticality }: { criticality: Criticality }) {
  const { label, color } = config[criticality]
  return <Badge color={color} variant="light" size="sm">{label}</Badge>
}