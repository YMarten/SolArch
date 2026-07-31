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

export function AreasTable() {
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

  if (loading) return <Center h={200}><Loader /></Center>

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Title order={4}>Áreas de negocio</Title>
        <Button leftSection={<IconPlus size={14} />} onClick={() => handleOpen()}>
          Nueva área
        </Button>
      </Group>

      <Table withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nombre</Table.Th>
            <Table.Th>Descripción</Table.Th>
            <Table.Th style={{ width: 80 }}>Acciones</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {areas.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={3}>
                <Text c="dimmed" ta="center" size="sm">No hay áreas registradas.</Text>
              </Table.Td>
            </Table.Tr>
          ) : areas.map(a => (
            <Table.Tr key={a.id}>
              <Table.Td><Text size="sm" fw={500}>{a.name}</Text></Table.Td>
              <Table.Td><Text size="sm" c="dimmed">{a.description ?? "—"}</Text></Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <ActionIcon variant="subtle" onClick={() => handleOpen(a)}>
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(a.id)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

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