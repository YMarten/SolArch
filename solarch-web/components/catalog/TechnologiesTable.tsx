"use client"

import { useEffect, useState } from "react"
import {
  Table, Group, Text, Badge, Button, ActionIcon,
  Loader, Center, Stack, Title
} from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react"
import { technologiesService } from "@/services/technologies.service"
import { Technology, CreateTechnologyDTO, TechCategory } from "@/types/technology"
import { CatalogModal } from "./CatalogModal"

const categoryColors: Record<TechCategory, string> = {
  LANGUAGE:       "blue",
  FRAMEWORK:      "violet",
  DATABASE:       "orange",
  INFRASTRUCTURE: "teal",
  MESSAGING:      "yellow",
  SECURITY:       "red",
  MONITORING:     "green",
  OTHER:          "gray",
}

const categoryLabels: Record<TechCategory, string> = {
  LANGUAGE:       "Lenguaje",
  FRAMEWORK:      "Framework",
  DATABASE:       "Base de datos",
  INFRASTRUCTURE: "Infraestructura",
  MESSAGING:      "Mensajería",
  SECURITY:       "Seguridad",
  MONITORING:     "Monitoreo",
  OTHER:          "Otro",
}

const fields = [
  { key: "name",        label: "Nombre",    type: "text" as const,     required: true,  placeholder: "React, PostgreSQL..." },
  { key: "category",    label: "Categoría", type: "select" as const,   required: true,
    options: Object.entries(categoryLabels).map(([value, label]) => ({ value, label }))
  },
  { key: "description", label: "Descripción", type: "textarea" as const, placeholder: "Descripción opcional" },
]

export function TechnologiesTable() {
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [loading, setLoading]           = useState(true)
  const [saving, setSaving]             = useState(false)
  const [selected, setSelected]         = useState<Technology | null>(null)
  const [opened, { open, close }]       = useDisclosure(false)

  const load = () => {
    technologiesService.getAll()
      .then(setTechnologies)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleOpen = (tech?: Technology) => {
    setSelected(tech ?? null)
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
        await technologiesService.update(selected.id, values as Partial<CreateTechnologyDTO>)
        notifications.show({ message: "Tecnología actualizada", color: "green" })
      } else {
        await technologiesService.create(values as unknown as CreateTechnologyDTO)
        notifications.show({ message: "Tecnología creada", color: "green" })
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
    if (!confirm("¿Eliminar esta tecnología?")) return
    try {
      await technologiesService.remove(id)
      notifications.show({ message: "Tecnología eliminada", color: "green" })
      load()
    } catch (e: any) {
      notifications.show({ message: e.message, color: "red" })
    }
  }

  if (loading) return <Center h={200}><Loader /></Center>

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Title order={4}>Tecnologías</Title>
        <Button leftSection={<IconPlus size={14} />} onClick={() => handleOpen()}>
          Nueva tecnología
        </Button>
      </Group>

      <Table withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nombre</Table.Th>
            <Table.Th>Categoría</Table.Th>
            <Table.Th>Descripción</Table.Th>
            <Table.Th style={{ width: 80 }}>Acciones</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {technologies.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={4}>
                <Text c="dimmed" ta="center" size="sm">No hay tecnologías registradas.</Text>
              </Table.Td>
            </Table.Tr>
          ) : technologies.map(t => (
            <Table.Tr key={t.id}>
              <Table.Td><Text size="sm" fw={500}>{t.name}</Text></Table.Td>
              <Table.Td>
                <Badge color={categoryColors[t.category]} variant="light" size="sm">
                  {categoryLabels[t.category]}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Text size="sm" c="dimmed">{t.description ?? "—"}</Text>
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <ActionIcon variant="subtle" onClick={() => handleOpen(t)}>
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(t.id)}>
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
        title={selected ? "Editar tecnología" : "Nueva tecnología"}
        fields={fields}
        initialValues={selected ? {
          name:        selected.name,
          category:    selected.category,
          description: selected.description ?? "",
        } : undefined}
        loading={saving}
      />
    </Stack>
  )
}