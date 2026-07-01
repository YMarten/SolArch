"use client"

import { Group, TextInput, Select, Button } from "@mantine/core"
import { IconSearch, IconPlus } from "@tabler/icons-react"
import { useRouter } from "next/navigation"

interface Filters {
  search: string
  status: string
  criticality: string
  role: string
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
    <Group justify="space-between" mb="md">
      <Group gap="sm">
        <TextInput
          placeholder="Buscar solución..."
          leftSection={<IconSearch size={14} />}
          value={filters.search}
          onChange={e => update("search", e.currentTarget.value)}
          style={{ width: 220 }}
        />
        <Select
          placeholder="Estado"
          clearable
          value={filters.status}
          onChange={v => update("status", v ?? "")}
          style={{ width: 160 }}
          data={[
            { value: "ACTIVE",          label: "Activa"          },
            { value: "DEPRECATED",      label: "Deprecada"       },
            { value: "IN_SUBSTITUTION", label: "En sustitución"  },
            { value: "IN_DEVELOPMENT",  label: "En desarrollo"   },
            { value: "MAINTENANCE",     label: "Mantenimiento"   },
          ]}
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