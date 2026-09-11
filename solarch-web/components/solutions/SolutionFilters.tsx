"use client"

import { solutionStatusOptions, usageStatusOptions } from "@/lib/solution-status"
import { hostingModeOptions, managementModelOptions } from "@/lib/hosting-mode"
import { Group, TextInput, Select, Button } from "@mantine/core"
import { IconSearch, IconPlus } from "@tabler/icons-react"
import { useRouter } from "next/navigation"

interface Filters {
  search: string
  status: string
  criticality: string
  role: string
  usageStatus: string
  hostingMode: string
  managementModel: string
  supportStatus: string
  hasProblems: string
  hasReplacementInitiative: string
}

interface Props {
  filters: Filters
  onChange: (filters: Filters) => void
}

export function SolutionFilters({ filters, onChange }: Props) {
  const router = useRouter()

  const update = (key: keyof Filters, value: string) =>
    onChange({ ...filters, [key]: value })

  return (
    <Group justify="space-between" mb="md" align="flex-start">
      <Group gap="sm" wrap="wrap" style={{ flex: 1 }}>
        <TextInput
          placeholder="Buscar solución..."
          leftSection={<IconSearch size={14} />}
          value={filters.search}
          onChange={e => update("search", e.currentTarget.value)}
          style={{ width: 220 }}
        />
        <Select
          placeholder="Estado arquitectónico"
          clearable
          value={filters.status}
          onChange={v => update("status", v ?? "")}
          style={{ width: 160 }}
          data={solutionStatusOptions}
        />
        <Select
          placeholder="Criticidad"
          clearable
          value={filters.criticality}
          onChange={v => update("criticality", v ?? "")}
          style={{ width: 160 }}
          data={[
            { value: "HIGH",   label: "Alta"  },
            { value: "MEDIUM", label: "Media" },
            { value: "LOW",    label: "Baja"  },
          ]}
        />
        <Select
          placeholder="Rol"
          clearable
          value={filters.role}
          onChange={v => update("role", v ?? "")}
          style={{ width: 200 }}
          data={[
            { value: "CORE_TRANSACTIONAL",  label: "Core transaccional"        },
            { value: "SATELLITE",           label: "Sistema satélite"           },
            { value: "INTEGRATION",         label: "Plataforma de integración"  },
            { value: "DATA_ANALYTICS",      label: "Información y analítica"    },
            { value: "INTERACTION_CHANNEL", label: "Canal e interacción"        },
          ]}
        />
        <Select placeholder="Estado de uso" clearable value={filters.usageStatus} onChange={v => update("usageStatus", v ?? "")} style={{ width: 170 }} data={usageStatusOptions} />
        <Select placeholder="Alojamiento" clearable value={filters.hostingMode} onChange={v => update("hostingMode", v ?? "")} style={{ width: 190 }} data={hostingModeOptions} />
        <Select placeholder="Administración" clearable value={filters.managementModel} onChange={v => update("managementModel", v ?? "")} style={{ width: 220 }} data={managementModelOptions} />
        <Select placeholder="Soporte" clearable value={filters.supportStatus} onChange={v => update("supportStatus", v ?? "")} style={{ width: 150 }} data={[{value:"YES",label:"Vigente"},{value:"NO",label:"No vigente"},{value:"UNKNOWN",label:"No determinado"}]} />
        <Select placeholder="Problemas" clearable value={filters.hasProblems} onChange={v => update("hasProblems", v ?? "")} style={{ width: 145 }} data={[{value:"true",label:"Con problemas"},{value:"false",label:"Sin problemas"}]} />
        <Select placeholder="Sustitución/retiro" clearable value={filters.hasReplacementInitiative} onChange={v => update("hasReplacementInitiative", v ?? "")} style={{ width: 190 }} data={[{value:"true",label:"Con iniciativa"},{value:"false",label:"Sin iniciativa"}]} />
      </Group>
      <Button
        leftSection={<IconPlus size={14} />}
        onClick={() => router.push("/solutions/new")}
      >
        Nueva solución
      </Button>
    </Group>
  )
}
