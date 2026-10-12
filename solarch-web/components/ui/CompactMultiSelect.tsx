"use client"

import { useState, type CSSProperties } from "react"
import { Button, Combobox, Group, InputBase, Text, useCombobox } from "@mantine/core"
import { IconCheck } from "@tabler/icons-react"

interface Props {
  label: string
  placeholder?: string
  data: { value: string; label: string }[]
  value: string[]
  onChange: (value: string[]) => void
  style?: CSSProperties
  clearable?: boolean
  searchable?: boolean
}

export function CompactMultiSelect({ label, data, value, onChange, style, clearable, searchable }: Props) {
  const [search, setSearch] = useState("")
  const combobox = useCombobox({
    onDropdownClose: () => { setSearch(""); combobox.resetSelectedOption() },
    onDropdownOpen: () => { if (searchable) combobox.focusSearchInput() },
  })
  const selectedLabels = value.map(id => data.find(option => option.value === id)?.label ?? id)
  const options = data.filter(option => option.label.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()))

  return <Combobox store={combobox} onOptionSubmit={id => {
    onChange(value.includes(id) ? value.filter(item => item !== id) : [...value, id])
  }}>
    <Combobox.Target>
      <InputBase component="button" type="button" pointer label={label} style={style}
        className="compact-multi-select" rightSection={<Combobox.Chevron />} rightSectionPointerEvents="none"
        title={selectedLabels.length ? selectedLabels.join(", ") : "Todos"}
        onClick={() => combobox.toggleDropdown()}>
        <span className="compact-selection-summary">
          <span className="compact-selection-label">{selectedLabels[0] ?? "Todos"}</span>
          {value.length > 1 && <span className="compact-selection-count">+{value.length - 1}</span>}
        </span>
      </InputBase>
    </Combobox.Target>
    <Combobox.Dropdown>
      {searchable && <Combobox.Search aria-label={`Buscar opciones de ${label}`} placeholder="Buscar opción..."
        value={search} onChange={event => { setSearch(event.currentTarget.value); combobox.resetSelectedOption() }} />}
      <Combobox.Options mah={240} style={{ overflowY: "auto" }} aria-label={label} aria-multiselectable="true">
        {options.length ? options.map(option => <Combobox.Option key={option.value} value={option.value} active={value.includes(option.value)} aria-selected={value.includes(option.value)}>
          <Group gap="xs" wrap="nowrap">
            <span className="compact-option-check" data-checked={value.includes(option.value) || undefined} aria-hidden="true">
              {value.includes(option.value) && <IconCheck size={12} />}
            </span>
            <Text size="sm">{option.label}</Text>
          </Group>
        </Combobox.Option>) : <Combobox.Empty>No se encontraron opciones</Combobox.Empty>}
      </Combobox.Options>
      {clearable && <Combobox.Footer><Button variant="subtle" size="xs" fullWidth disabled={!value.length} onClick={() => onChange([])}>Limpiar selección</Button></Combobox.Footer>}
    </Combobox.Dropdown>
  </Combobox>
}
