"use client"

import { useEffect, useState } from "react"
import {
  Table, Group, Text, Button, ActionIcon,
  Loader, Center, Stack, Title
} from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react"
import { domainsService } from "@/services/domains.service"
import { Domain, CreateDomainDTO } from "@/types/domain"
import { CatalogModal } from "./CatalogModal"

const fields = [
  { key: "name",        label: "Nombre",      type: "text" as const,     required: true, placeholder: "Gestión de pedidos, Finanzas..." },
  { key: "description", label: "Descripción", type: "textarea" as const, placeholder: "Descripción del dominio empresarial" },
]

export function DomainsTable() {
  const [domains, setDomains]       = useState<Domain[]>([])
  const [loading, setLoading]       = useState(true)
  const [saving, setSaving]         = useState(false)
  const [selected, setSelected]     = useState<Domain | null>(null)
  const [opened, { open, close }]   = useDisclosure(false)

  const load = () => {
    domainsService.getAll()
      .then(setDomains)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleOpen = (domain?: Domain) => {
    setSelected(domain ?? null)
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
        await domainsService.update(selected.id, values as Partial<CreateDomainDTO>)
        notifications.show({ message: "Dominio actualizado", color: "green" })
      } else {
        await domainsService.create(values as unknown as CreateDomainDTO)
        notifications.show({ message: "Dominio creado", color: "green" })
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
    if (!confirm("¿Eliminar este dominio?")) return
    try {
      await domainsService.remove(id)
      notifications.show({ message: "Dominio eliminado", color: "green" })
      load()
    } catch (e: any) {
      notifications.show({ message: e.message, color: "red" })
    }
  }

  if (loading) return <Center h={200}><Loader /></Center>

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Title order={4}>Dominios empresariales</Title>
        <Button leftSection={<IconPlus size={14} />} onClick={() => handleOpen()}>
          Nuevo dominio
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
          {domains.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={3}>
                <Text c="dimmed" ta="center" size="sm">No hay dominios registrados.</Text>
              </Table.Td>
            </Table.Tr>
          ) : domains.map(d => (
            <Table.Tr key={d.id}>
              <Table.Td><Text size="sm" fw={500}>{d.name}</Text></Table.Td>
              <Table.Td><Text size="sm" c="dimmed">{d.description ?? "—"}</Text></Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <ActionIcon variant="subtle" onClick={() => handleOpen(d)}>
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(d.id)}>
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
        title={selected ? "Editar dominio" : "Nuevo dominio"}
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