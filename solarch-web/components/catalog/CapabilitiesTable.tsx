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

export function CapabilitiesTable() {
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

  const filtered = filterDomain
    ? capabilities.filter(c => c.domainId === filterDomain)
    : capabilities

  const getDomainName = (id: string) =>
    domains.find(d => d.id === id)?.name ?? "—"

  const getParentName = (id?: string) =>
    id ? capabilities.find(c => c.id === id)?.name ?? "—" : "—"

  if (loading) return <Center h={200}><Loader /></Center>

  return (
    <Stack gap="md" p="xl">
      <Group justify="space-between">
        <Title order={4}>Capacidades empresariales</Title>
        <Button leftSection={<IconPlus size={14} />} onClick={() => handleOpen()}>
          Nueva capacidad
        </Button>
      </Group>

      <Select
        placeholder="Filtrar por dominio..."
        clearable
        value={filterDomain}
        onChange={setFilterDomain}
        data={domains.map(d => ({ value: d.id, label: d.name }))}
        style={{ width: 260 }}
      />

      <Table withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nombre</Table.Th>
            <Table.Th>Dominio</Table.Th>
            <Table.Th>Nivel</Table.Th>
            <Table.Th>Capacidad padre</Table.Th>
            <Table.Th>Descripción</Table.Th>
            <Table.Th style={{ width: 80 }}>Acciones</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filtered.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={6}>
                <Text c="dimmed" ta="center" size="sm">
                  No hay capacidades registradas.
                </Text>
              </Table.Td>
            </Table.Tr>
          ) : filtered.map(c => (
            <Table.Tr key={c.id}>
              <Table.Td><Text size="sm" fw={500}>{c.name}</Text></Table.Td>
              <Table.Td>
                <Badge variant="light" color="blue" size="sm">
                  {getDomainName(c.domainId)}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Badge variant="default" size="sm">Nivel {c.level}</Badge>
              </Table.Td>
              <Table.Td>
                <Text size="sm" c="dimmed">{getParentName(c.parentId)}</Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm" c="dimmed">{c.description ?? "—"}</Text>
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <ActionIcon variant="subtle" onClick={() => handleOpen(c)}>
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(c.id)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

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