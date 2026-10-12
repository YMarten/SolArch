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

import { CatalogSearch, matchesCatalogSearch } from "./CatalogSearch"

export function DomainsTable() {
  const [search, setSearch] = useState("")
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

  const filtered = domains.filter(item => matchesCatalogSearch(search, [item.name, item.description]))

  if (loading) return <Center h={200}><Loader /></Center>

  return (
    <Stack gap="lg" p="xl" className="catalog-page">
      <Group justify="space-between">
        <Title order={2}>Dominios empresariales</Title>
        <Button leftSection={<IconPlus size={14} />} onClick={() => handleOpen()}>
          Nuevo dominio
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
                <Text c="dimmed" ta="center" size="sm">{domains.length ? "No hay resultados para la búsqueda." : "No hay dominios registrados."}</Text>
              </Table.Td>
            </Table.Tr>
          ) : filtered.map(d => (
            <Table.Tr key={d.id}>
              <Table.Td><Text size="sm" fw={600}>{d.name}</Text></Table.Td>
              <Table.Td><Text size="sm" c="dimmed" className="catalog-description" title={d.description ?? undefined}>{d.description ?? "—"}</Text></Table.Td>
              <Table.Td>
                <Group gap={4} justify="flex-end" wrap="nowrap">
                  <ActionIcon variant="subtle" className="catalog-edit" aria-label={`Editar dominio: ${d.name}`} title="Editar dominio" onClick={() => handleOpen(d)}>
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon variant="subtle" color="red" className="catalog-delete" aria-label={`Eliminar dominio: ${d.name}`} title="Eliminar dominio" onClick={() => handleDelete(d.id)}>
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