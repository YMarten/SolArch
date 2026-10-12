"use client"

import { solutionStatusOptions, usageStatusOptions } from "@/lib/solution-status"
import { hostingModeOptions, managementModelOptions } from "@/lib/hosting-mode"
import { Group, TextInput, Button, Stack, Text, Collapse, Badge } from "@mantine/core"
import { CompactMultiSelect as MultiSelect } from "@/components/ui/CompactMultiSelect"
import { IconSearch, IconPlus, IconAdjustmentsHorizontal, IconChevronDown, IconChevronUp } from "@tabler/icons-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { emptySolutionFilters, SolutionFiltersState as Filters } from "@/lib/solution-filters"

interface Props {
  filters: Filters
  onChange: (filters: Filters) => void
}

export function SolutionFilters({ filters, onChange }: Props) {
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)
  const activeCount = Object.entries(filters).filter(([key, value]) => key !== "search" && value.length > 0).length

  const update = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    onChange({ ...filters, [key]: value })

  return (
    <Stack gap="md" className="solution-filter-panel">
    <Group justify="space-between" gap="sm" className="compact-filter-bar">
      <TextInput aria-label="Buscar soluciones" placeholder="Buscar solución..." leftSection={<IconSearch size={14} />} value={filters.search} onChange={e => update("search", e.currentTarget.value)} className="catalog-search" />
      <Group gap="xs">
        <Button variant="default" leftSection={<IconAdjustmentsHorizontal size={16} />} rightSection={expanded ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />} aria-expanded={expanded} aria-controls="solution-filter-options" onClick={() => setExpanded(value => !value)}>Filtros {activeCount > 0 && <Badge size="sm" ml={6}>{activeCount}</Badge>}</Button>
        <Button variant="subtle" onClick={() => onChange(emptySolutionFilters())}>Limpiar filtros</Button>
        <Button leftSection={<IconPlus size={14} />} onClick={() => router.push("/solutions/new")}>Nueva solución</Button>
      </Group>
    </Group>
    {activeCount > 0 && !expanded && <Text size="xs" c="dimmed">{activeCount} {activeCount === 1 ? "campo filtrado" : "campos filtrados"} · Los filtros siguen aplicados al cerrar el panel.</Text>}
    <Collapse expanded={expanded} id="solution-filter-options">
    <Text size="xs" c="dimmed" mb="sm">Puedes elegir varios valores por campo. Se muestran coincidencias con cualquiera de ellos y se combinan los filtros de campos distintos.</Text>
    <Group justify="space-between" align="flex-end" className="solution-filter-toolbar">
      <Group gap="sm" wrap="wrap" className="solution-filter-fields">
        <MultiSelect
          placeholder="Estado arquitectónico" label="Estado arquitectónico"
          clearable searchable
          value={filters.status}
          onChange={v => update("status", v)}
          style={{ width: 160 }}
          data={solutionStatusOptions}
        />
        <MultiSelect
          placeholder="Criticidad" label="Criticidad"
          clearable searchable
          value={filters.criticality}
          onChange={v => update("criticality", v)}
          style={{ width: 160 }}
          data={[
            { value: "HIGH",   label: "Alta"  },
            { value: "MEDIUM", label: "Media" },
            { value: "LOW",    label: "Baja"  },
          ]}
        />
        <MultiSelect
          placeholder="Rol" label="Rol"
          clearable searchable
          value={filters.role}
          onChange={v => update("role", v)}
          style={{ width: 200 }}
          data={[
            { value: "CORE_TRANSACTIONAL",  label: "Core transaccional"        },
            { value: "SATELLITE",           label: "Sistema satélite"           },
            { value: "INTEGRATION",         label: "Plataforma de integración"  },
            { value: "DATA_ANALYTICS",      label: "Datos / Analítica e IA"    },
          ]}
        />
        <MultiSelect placeholder="Estado de uso" label="Estado de uso" clearable searchable value={filters.usageStatus} onChange={v => update("usageStatus", v)} style={{ width: 170 }} data={usageStatusOptions} />
        <MultiSelect placeholder="Alojamiento" label="Alojamiento" clearable searchable value={filters.hostingMode} onChange={v => update("hostingMode", v)} style={{ width: 190 }} data={hostingModeOptions} />
        <MultiSelect placeholder="Administración" label="Administración" clearable searchable value={filters.managementModel} onChange={v => update("managementModel", v)} style={{ width: 220 }} data={managementModelOptions} />
        <MultiSelect placeholder="Soporte" label="Soporte" clearable searchable value={filters.supportStatus} onChange={v => update("supportStatus", v)} style={{ width: 150 }} data={[{value:"YES",label:"Vigente"},{value:"NO",label:"No vigente"},{value:"UNKNOWN",label:"No determinado"}]} />
        <MultiSelect placeholder="Problemas" label="Problemas" clearable searchable value={filters.hasProblems} onChange={v => update("hasProblems", v)} style={{ width: 145 }} data={[{value:"true",label:"Con problemas"},{value:"false",label:"Sin problemas"}]} />
        <MultiSelect placeholder="Sustitución/retiro" label="Sustitución/retiro" clearable searchable value={filters.hasReplacementInitiative} onChange={v => update("hasReplacementInitiative", v)} style={{ width: 190 }} data={[{value:"true",label:"Con iniciativa"},{value:"false",label:"Sin iniciativa"}]} />
      </Group>
    </Group>
    </Collapse>
    </Stack>
  )
}
