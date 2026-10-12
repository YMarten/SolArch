"use client"

import { ActionIcon, TextInput } from "@mantine/core"
import { IconSearch, IconX } from "@tabler/icons-react"

export function matchesCatalogSearch(search: string, values: (string | null | undefined)[]) {
  const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase()
  const query = normalize(search.trim())
  return !query || values.some(value => value && normalize(value).includes(query))
}

export function CatalogSearch({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <TextInput type="search" aria-label="Buscar en el catálogo" placeholder="Buscar en el catálogo..."
    className="catalog-search-field" leftSection={<IconSearch size={16} />}
    value={value} onChange={event => onChange(event.currentTarget.value)}
    rightSection={value ? <ActionIcon variant="subtle" size="sm" aria-label="Limpiar búsqueda" onClick={() => onChange("")}><IconX size={14} /></ActionIcon> : undefined}
    rightSectionPointerEvents="auto" />
}
