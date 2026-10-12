"use client"

import { useEffect, useState } from "react"
import {
  Table, Group, Text, Button, ActionIcon,
  Loader, Center, Stack, Title
} from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react"
import { areasService } from "@/services/areas.service"
import { Area, CreateAreaDTO } from "@/types/area"
import { CatalogModal } from "./CatalogModal"

const fields = [
  { key: "name",        label: "Nombre",      type: "text" as const,     required: true, placeholder: "Gerencia Comercial, Operaciones..." },
  { key: "description", label: "Descripción", type: "textarea" as const, placeholder: "Descripción del área organizacional" },
]

import { CatalogSearch, matchesCatalogSearch } from "./CatalogSearch"

export function AreasTable() {
  const [search, setSearch] = useState("")
  const [areas, setAreas]           = useState<Area[]>([])
  const [loading, setLoading]       = useState(true)
  const [saving, setSaving]         = useState(false)
  const [selected, setSelected]     = useState<Area | null>(null)
  const [opened, { open, close }]   = useDisclosure(false)

  const load = () => {
    areasService.getAll()
      .then(setAreas)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleOpen = (area?: Area) => {
    setSelected(area ?? null)
    open()
  }

  const handleClose = () => {
    setSelected(null)
    close()
  }

  const handleSubmit = async (values: Record<string, string>) => {
    setSaving(true)
    try {
      if (selected) {
        await areasService.update(selected.id, values as Partial<CreateAreaDTO>)
        notifications.show({ message: "Área actualizada", color: "green" })
      } else {
        await areasService.create(values as unknown as CreateAreaDTO)
        notifications.show({ message: "Área creada", color: "green" })
      }
      load()
      handleClose()
    } catch (e: any) {
      notifications.show({ message: e.message, color: "red" })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta área?")) return
    try {
      await areasService.remove(id)
      notifications.show({ message: "Área eliminada", color: "green" })
      load()
    } catch (e: any) {
      notifications.show({ message: e.message, color: "red" })
    }
  }

  const filtered = areas.filter(item => matchesCatalogSearch(search, [item.name, item.description]))

  if (loading) return <Center h={200}><Loader /></Center>

  return (
    <Stack gap="lg" p="xl" className="catalog-page">
      <Group justify="space-between">
        <Title order={2}>Áreas de negocio</Title>
        <Button leftSection={<IconPlus size={14} />} onClick={() => handleOpen()}>
          Nueva área
        </Button>
      </Group>

      <CatalogSearch value={search} onChange={setSearch} />
      <div className="catalog-table-card">
      <div className="catalog-table-scroll" role="region" aria-label="Tabla del catálogo" tabIndex={0}>
      <Table className="catalog-table" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th scope="col">Nombre</Table.Th>
            <Table.Th scope="col">Descripción</Table.Th>
            <Table.Th scope="col" style={{ width: 100 }}>Acciones</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filtered.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={3}>
                <Text c="dimmed" ta="center" size="sm">{areas.length ? "No hay resultados para la búsqueda." : "No hay áreas registradas."}</Text>
              </Table.Td>
            </Table.Tr>
          ) : filtered.map(a => (
            <Table.Tr key={a.id}>
              <Table.Td><Text size="sm" fw={600}>{a.name}</Text></Table.Td>
              <Table.Td><Text size="sm" c="dimmed" className="catalog-description" title={a.description ?? undefined}>{a.description ?? "—"}</Text></Table.Td>
              <Table.Td>
                <Group gap={4} justify="flex-end" wrap="nowrap">
                  <ActionIcon variant="subtle" className="catalog-edit" aria-label={`Editar área: ${a.name}`} title="Editar área" onClick={() => handleOpen(a)}>
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon variant="subtle" color="red" className="catalog-delete" aria-label={`Eliminar área: ${a.name}`} title="Eliminar área" onClick={() => handleDelete(a.id)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      </div>
      </div>

      <CatalogModal
        opened={opened}
        onClose={handleClose}
        onSubmit={handleSubmit}
        title={selected ? "Editar área" : "Nueva área"}
        fields={fields}
        initialValues={selected ? {
          name:        selected.name,
          description: selected.description ?? "",
        } : undefined}
        loading={saving}
      />
    </Stack>
  )
}