"use client"

import { useEffect, useState } from "react"
import {
  Table, Group, Text, Button, ActionIcon,
  Loader, Center, Stack, Title, Badge, Select,
  Modal, TextInput, Textarea
} from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react"
import { capabilitiesService } from "@/services/capabilities.service"
import { domainsService } from "@/services/domains.service"
import { Capability, CreateCapabilityDTO } from "@/types/capability"
import { Domain } from "@/types/domain"

import { CatalogSearch, matchesCatalogSearch } from "./CatalogSearch"

export function CapabilitiesTable() {
  const [search, setSearch] = useState("")
  const [capabilities, setCapabilities] = useState<Capability[]>([])
  const [domains, setDomains]           = useState<Domain[]>([])
  const [loading, setLoading]           = useState(true)
  const [saving, setSaving]             = useState(false)
  const [selected, setSelected]         = useState<Capability | null>(null)
  const [filterDomain, setFilterDomain] = useState<string | null>(null)
  const [opened, { open, close }]       = useDisclosure(false)

  const form = useForm<CreateCapabilityDTO>({
    initialValues: {
      name:        "",
      description: "",
      domainId:    "",
      level:       1,
      parentId:    "",
    },
    validate: {
      name:     v => !v ? "El nombre es requerido" : null,
      domainId: v => !v ? "El dominio es requerido" : null,
    }
  })

  const load = () => {
    Promise.all([
      capabilitiesService.getAll(),
      domainsService.getAll(),
    ]).then(([caps, doms]) => {
      setCapabilities(caps)
      setDomains(doms)
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleOpen = (cap?: Capability) => {
    setSelected(cap ?? null)
    if (cap) {
      form.setValues({
        name:        cap.name,
        description: cap.description ?? "",
        domainId:    cap.domainId,
        level:       cap.level,
        parentId:    cap.parentId ?? "",
      })
    } else {
      form.reset()
    }
    open()
  }

  const handleClose = () => {
    setSelected(null)
    form.reset()
    close()
  }

  const handleSubmit = async (values: CreateCapabilityDTO) => {
    setSaving(true)
    try {
      const payload = {
        ...values,
        parentId: values.parentId || undefined,
      }
      if (selected) {
        await capabilitiesService.update(selected.id, payload)
        notifications.show({ message: "Capacidad actualizada", color: "green" })
      } else {
        await capabilitiesService.create(payload)
        notifications.show({ message: "Capacidad creada", color: "green" })
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
    if (!confirm("¿Eliminar esta capacidad?")) return
    try {
      await capabilitiesService.remove(id)
      notifications.show({ message: "Capacidad eliminada", color: "green" })
      load()
    } catch (e: any) {
      notifications.show({ message: e.message, color: "red" })
    }
  }

  const filtered = capabilities.filter(c => (!filterDomain || c.domainId === filterDomain) && matchesCatalogSearch(search, [c.name, c.description, domains.find(d => d.id === c.domainId)?.name, capabilities.find(parent => parent.id === c.parentId)?.name, `Nivel ${c.level}`]))

  const getDomainName = (id: string) =>
    domains.find(d => d.id === id)?.name ?? "—"

  const getParentName = (id?: string) =>
    id ? capabilities.find(c => c.id === id)?.name ?? "—" : "—"

  if (loading) return <Center h={200}><Loader /></Center>

  return (
    <Stack gap="lg" p="xl" className="catalog-page">
      <Group justify="space-between">
        <Title order={2}>Capacidades empresariales</Title>
        <Button leftSection={<IconPlus size={14} />} onClick={() => handleOpen()}>
          Nueva capacidad
        </Button>
      </Group>

      <Group gap="sm">
      <CatalogSearch value={search} onChange={setSearch} />
      <Select
        placeholder="Filtrar por dominio..."
        clearable
        value={filterDomain}
        onChange={setFilterDomain}
        data={domains.map(d => ({ value: d.id, label: d.name }))}
        aria-label="Filtrar por dominio"
        style={{ width: 260, maxWidth: "100%" }}
      />

      </Group>
      <div className="catalog-table-card">
      <div className="catalog-table-scroll" role="region" aria-label="Tabla del catálogo" tabIndex={0}>
      <Table className="catalog-table" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th scope="col">Nombre</Table.Th>
            <Table.Th scope="col">Dominio</Table.Th>
            <Table.Th scope="col">Nivel</Table.Th>
            <Table.Th scope="col">Capacidad padre</Table.Th>
            <Table.Th scope="col">Descripción</Table.Th>
            <Table.Th scope="col" style={{ width: 100 }}>Acciones</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filtered.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={6}>
                <Text c="dimmed" ta="center" size="sm">
                  {capabilities.length ? "No hay resultados para la búsqueda o el dominio seleccionado." : "No hay capacidades registradas."}
                </Text>
              </Table.Td>
            </Table.Tr>
          ) : filtered.map(c => (
            <Table.Tr key={c.id}>
              <Table.Td><Text size="sm" fw={600}>{c.name}</Text></Table.Td>
              <Table.Td>
                <Badge variant="light" color="blue" size="sm">
                  {getDomainName(c.domainId)}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Badge variant="default" radius="sm" className="catalog-level" size="sm">Nivel {c.level}</Badge>
              </Table.Td>
              <Table.Td>
                <Text size="sm" c="dimmed">{getParentName(c.parentId)}</Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm" c="dimmed" className="catalog-description" title={c.description ?? undefined}>{c.description ?? "—"}</Text>
              </Table.Td>
              <Table.Td>
                <Group gap={4} justify="flex-end" wrap="nowrap">
                  <ActionIcon variant="subtle" className="catalog-edit" aria-label={`Editar capacidad: ${c.name}`} title="Editar capacidad" onClick={() => handleOpen(c)}>
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon variant="subtle" color="red" className="catalog-delete" aria-label={`Eliminar capacidad: ${c.name}`} title="Eliminar capacidad" onClick={() => handleDelete(c.id)}>
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

      {/* Modal */}
      <Modal
        opened={opened}
        onClose={handleClose}
        title={selected ? "Editar capacidad" : "Nueva capacidad"}
        centered
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="sm">
            <TextInput
              label="Nombre"
              placeholder="Seguimiento de pedidos, Gestión de devoluciones..."
              required
              {...form.getInputProps("name")}
            />
            <Select
              label="Dominio empresarial"
              placeholder="Seleccionar dominio..."
              required
              data={domains.map(d => ({ value: d.id, label: d.name }))}
              {...form.getInputProps("domainId")}
            />
            <Select
              label="Nivel"
              description="Nivel jerárquico de la capacidad."
              data={[
                { value: "1", label: "Nivel 1 — Raíz" },
                { value: "2", label: "Nivel 2" },
                { value: "3", label: "Nivel 3" },
              ]}
              value={String(form.values.level)}
              onChange={v => form.setFieldValue("level", Number(v))}
            />
            <Select
              label="Capacidad padre"
              description="Opcional. Para capacidades anidadas dentro de otra."
              placeholder="Sin padre (capacidad raíz)"
              clearable
              data={capabilities
                .filter(c => c.id !== selected?.id)
                .map(c => ({ value: c.id, label: c.name }))
              }
              value={form.values.parentId ?? ""}
              onChange={v => form.setFieldValue("parentId", v ?? "")}
            />
            <Textarea
              label="Descripción"
              placeholder="Descripción opcional"
              {...form.getInputProps("description")}
            />
            <Group justify="flex-end" mt="sm">
              <Button type="button" variant="default" onClick={handleClose}>Cancelar</Button>
              <Button type="submit" loading={saving}>Guardar</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  )
}