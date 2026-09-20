"use client"

import { useState, type ReactNode } from "react"
import { MultiSelect, Select, Text } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { CatalogModal } from "./CatalogModal"
import { domainsService } from "@/services/domains.service"
import { areasService } from "@/services/areas.service"
import { capabilitiesService } from "@/services/capabilities.service"
import { technologiesService } from "@/services/technologies.service"
import type { TechCategory } from "@/types/technology"

export type CatalogKind = "domains" | "areas" | "capabilities" | "technologies"
export interface CatalogEntry { id: string; name: string; category?: string; domainId?: string }
const CREATE = "__create_catalog_entry__"
const names = { domains: "dominio", areas: "área", capabilities: "capacidad", technologies: "tecnología" }
const categories: { value: TechCategory; label: string }[] = [
  { value: "LANGUAGE", label: "Lenguaje" }, { value: "FRAMEWORK", label: "Framework" },
  { value: "DATABASE", label: "Base de datos" }, { value: "INFRASTRUCTURE", label: "Infraestructura" },
  { value: "MESSAGING", label: "Mensajería" }, { value: "SECURITY", label: "Seguridad" },
  { value: "MONITORING", label: "Monitoreo" }, { value: "OTHER", label: "Otro" },
]
interface Props {
  kind: CatalogKind
  label: ReactNode
  entries: CatalogEntry[]
  domains?: CatalogEntry[]
  defaultDomainId?: string
  multiple?: boolean
  value: string[] | string | null
  onChange: (value: string[]) => void
  onCreated: (record: CatalogEntry) => void
  error?: ReactNode
}

export function InlineCatalogField({ kind, label, entries, domains = [], defaultDomainId, multiple, value, onChange, onCreated, error }: Props) {
  const [search, setSearch] = useState("")
  const [draft, setDraft] = useState("")
  const [opened, setOpened] = useState(false)
  const [saving, setSaving] = useState(false)
  const selected = Array.isArray(value) ? value : value ? [value] : []
  const normalize = (text: string) => text.trim().toLocaleLowerCase()
  const data = entries.map(item => ({ value: item.id, label: item.category ? `${item.name} (${item.category})` : item.name }))
  const action = { value: CREATE, label: search.trim() ? `+ Crear «${search.trim()}»` : `+ Crear ${names[kind]}` }
  const choose = (values: string[]) => {
    if (values.includes(CREATE)) { setDraft(search.trim()); setOpened(true); setSearch(""); return }
    onChange(values)
  }
  const common = {
    label, error, searchable: true, searchValue: search, onSearchChange: setSearch,
    data: [...data, action], nothingFoundMessage: "No se encontraron resultados",
    filter: () => [...data.filter(item => normalize(item.label).includes(normalize(search))), action],
    renderOption: ({ option }: { option: { value: string; label: string } }) => option.value === CREATE
      ? <Text size="sm" c="blue" fw={600} w="100%" pt="xs" style={{ borderTop: "1px solid var(--mantine-color-default-border)", whiteSpace: "normal" }}>{option.label}</Text>
      : option.label,
  }
  const fields: React.ComponentProps<typeof CatalogModal>["fields"] = [
    { key: "name", label: "Nombre", type: "text", required: true },
    { key: "description", label: "Descripción", type: "textarea" },
  ]
  if (kind === "technologies") fields.push({ key: "category", label: "Categoría", type: "select", required: true, options: categories })
  if (kind === "capabilities") fields.push(
    { key: "domainId", label: "Dominio empresarial", type: "select", required: true, options: domains.map(d => ({ value: d.id, label: d.name })) },
    { key: "level", label: "Nivel", type: "select", required: true, options: [{ value: "1", label: "Nivel 1 — Raíz" }, { value: "2", label: "Nivel 2" }, { value: "3", label: "Nivel 3" }] },
    { key: "parentId", label: "Capacidad padre (opcional)", type: "select", options: entries.map(c => ({ value: c.id, label: c.name })) },
  )
  const save = async (values: Record<string, string>): Promise<void | false> => {
    if (saving) return false
    const name = values.name.trim()
    if (!name || (kind === "capabilities" && !values.domainId) || (kind === "technologies" && !values.category)) {
      notifications.show({ color: "red", message: "Completa los campos requeridos." }); return false
    }
    if (kind === "capabilities" && values.parentId && entries.find(item => item.id === values.parentId)?.domainId !== values.domainId) {
      notifications.show({ color: "red", message: "La capacidad padre debe pertenecer al dominio elegido." }); return false
    }
    setSaving(true)
    try {
      // Refresh before creation to reuse records created elsewhere while this form was open.
      const current: CatalogEntry[] = await ({ domains: domainsService, areas: areasService, capabilities: capabilitiesService, technologies: technologiesService }[kind]).getAll()
      let record = current.find(item => normalize(item.name) === normalize(name) && (kind !== "capabilities" || item.domainId === values.domainId))
      const reused = Boolean(record)
      if (!record) {
        const base = { name, description: values.description.trim() }
        if (kind === "domains") record = await domainsService.create(base)
        if (kind === "areas") record = await areasService.create(base)
        if (kind === "technologies") record = await technologiesService.create({ ...base, category: values.category as TechCategory })
        if (kind === "capabilities") record = await capabilitiesService.create({ ...base, domainId: values.domainId, level: Number(values.level), parentId: values.parentId || undefined })
      }
      if (!record) throw new Error("No se recibió el registro del catálogo.")
      onCreated(record)
      onChange(multiple ? [...new Set([...selected, record.id])] : [record.id])
      setSearch(""); setOpened(false)
      notifications.show({ color: "green", message: reused ? "El registro ya existía y quedó seleccionado." : "Registro guardado en el catálogo y seleccionado." })
    } catch (e) {
      notifications.show({ color: "red", message: e instanceof Error ? e.message : "No se pudo crear el registro." })
      return false
    } finally { setSaving(false) }
  }
  return <>
    {multiple
      ? <MultiSelect {...common} value={selected} onChange={choose} />
      : <Select {...common} value={selected[0] ?? null} onChange={v => choose(v ? [v] : [])} />}
    <CatalogModal opened={opened} onClose={() => { if (!saving) setOpened(false) }} title={`Crear ${names[kind]}`} fields={fields}
      initialValues={{ name: draft, description: "", category: "", domainId: defaultDomainId ?? "", level: "1", parentId: "" }}
      onSubmit={save} loading={saving} />
  </>
}
