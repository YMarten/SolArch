"use client"

import { useState } from "react"
import {
  TextInput, Textarea, Select, MultiSelect, Button,
  Group, Stack, Title, Text, SimpleGrid, SegmentedControl,
  TagsInput, NumberInput, Paper, Divider, ActionIcon,
  Box
} from "@mantine/core"
import { DatePickerInput } from "@mantine/dates"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { IconPlus, IconTrash, IconArrowLeft } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { solutionsService } from "@/services/solutions.service"
import { CreateSolutionDTO, SolutionStatus, SolutionType, SolutionRole, SolutionOrigin, Criticality } from "@/types/solution"
import { Technology } from "@/types/technology"
import { Domain } from "@/types/domain"
import { Area } from "@/types/area"

interface Props {
  technologies: Technology[]
  domains: Domain[]
  areas: Area[]
  initialValues?: Partial<CreateSolutionDTO>
  solutionId?: string
}

interface AttachmentRow {
  category: string
  title: string
  url: string
}

interface EnvironmentRow {
  name: string
  url: string
  isActive: boolean
}

export function SolutionForm({ technologies, domains, areas, initialValues, solutionId }: Props) {
  const router = useRouter()
  const isEditing = !!solutionId

  const [attachments, setAttachments] = useState<AttachmentRow[]>(
    [{ category: "DIAGRAM", title: "", url: "" }]
  )
  const [environments, setEnvironments] = useState<EnvironmentRow[]>([
    { name: "DEV", url: "", isActive: true },
    { name: "QA", url: "", isActive: true },
    { name: "STAGING", url: "", isActive: false },
    { name: "PROD", url: "", isActive: true },
  ])
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const form = useForm<CreateSolutionDTO>({
    initialValues: {
      name: "",
      description: "",
      version: "",
      status: "ACTIVE",
      type: "WEB",
      role: "CORE_TRANSACTIONAL",
      criticality: "HIGH",
      origin: "INTERNAL",
      vendor: "",
      owner: "",
      techOwner: "",
      repoUrl: "",
      tags: [],
      technologyIds: [],
      domainIds: [],
      areaIds: [],
      ...initialValues,
    },
    validate: {
      name: v => !v ? "El nombre es requerido" : null,
      owner: v => !v ? "El dueño funcional es requerido" : null,
    },
  })

  const handleSubmit = async (values: CreateSolutionDTO) => {
    setLoading(true)
    try {
      if (isEditing) {
        await solutionsService.update(solutionId, values)
      } else {
        await solutionsService.create(values)
      }
      notifications.show({
        title: isEditing ? "Solución actualizada" : "Solución creada",
        message: isEditing
          ? "Los cambios fueron guardados correctamente."
          : "La solución fue registrada correctamente.",
        color: "green",
      })
      router.push("/solutions")
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error.message,
        color: "red",
      })
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    "Identidad",
    "Clasificación",
    "Contexto",
    "Tecnologías",
    "Ambientes",
    "Adjuntos",
  ]

  const addAttachment = () =>
    setAttachments(prev => [...prev, { category: "DIAGRAM", title: "", url: "" }])

  const removeAttachment = (i: number) =>
    setAttachments(prev => prev.filter((_, idx) => idx !== i))

  const updateAttachment = (i: number, key: keyof AttachmentRow, value: string) =>
    setAttachments(prev => prev.map((a, idx) => idx === i ? { ...a, [key]: value } : a))

  const updateEnvironment = (i: number, key: keyof EnvironmentRow, value: string | boolean) =>
    setEnvironments(prev => prev.map((e, idx) => idx === i ? { ...e, [key]: value } : e))

  return (
    <Box maw={860} mx="auto" p="xl">
      {/* Header */}
      <Group mb="xl">
        <ActionIcon variant="subtle" onClick={() => router.push("/solutions")}>
          <IconArrowLeft size={18} />
        </ActionIcon>
        <Title order={3}>
          {isEditing ? "Editar solución" : "Nueva solución"}
        </Title>
      </Group>

      {/* Step indicator */}
      <Group mb="xl" gap="xs">
        {steps.map((s, i) => (
          <Button
            type="button"
            key={s}
            size="xs"
            variant={step === i + 1 ? "filled" : step > i + 1 ? "light" : "default"}
            onClick={() => setStep(i + 1)}
          >
            {i + 1}. {s}
          </Button>
        ))}
      </Group>

      <form onSubmit={(e) => e.preventDefault()}>
        <Paper withBorder p="lg" radius="md">

          {/* STEP 1 — Identidad */}
          {step === 1 && (
            <Stack gap="md">
              <Title order={5}>Identidad de la solución</Title>
              <Text size="sm" c="dimmed">Información básica que identifica la solución en el inventario.</Text>
              <Divider />
              <SimpleGrid cols={2} spacing="md">
                <TextInput
                  label="Nombre"
                  placeholder="Portal de clientes"
                  required
                  {...form.getInputProps("name")}
                />
                <TextInput
                  label="Versión actual"
                  placeholder="v2.4.1"
                  {...form.getInputProps("version")}
                />
              </SimpleGrid>
              <Textarea
                label="Descripción"
                placeholder="Describe brevemente qué hace esta solución y para quién."
                rows={3}
                {...form.getInputProps("description")}
              />
              <SimpleGrid cols={2} spacing="md">
                <TextInput
                  label="Dueño funcional"
                  placeholder="Nombre o email"
                  required
                  {...form.getInputProps("owner")}
                />
                <TextInput
                  label="Dueño técnico"
                  placeholder="Nombre o email"
                  {...form.getInputProps("techOwner")}
                />
              </SimpleGrid>
              <TextInput
                label="URL del repositorio"
                placeholder="https://github.com/empresa/repo"
                {...form.getInputProps("repoUrl")}
              />
              <DatePickerInput
                label="Último despliegue a PROD"
                placeholder="Seleccionar fecha"
                clearable
                valueFormat="DD/MM/YYYY"
                onChange={v => form.setFieldValue("lastDeploy", v ? v.toString() : "")}
              />
              <TagsInput
                label="Etiquetas"
                placeholder="Escribe y presiona Enter"
                description="Etiquetas libres para búsqueda y filtrado rápido."
                {...form.getInputProps("tags")}
              />
            </Stack>
          )}

          {/* STEP 2 — Clasificación */}
          {step === 2 && (
            <Stack gap="md">
              <Title order={5}>Clasificación</Title>
              <Text size="sm" c="dimmed">Cómo se categoriza esta solución según el marco de arquitectura de referencia.</Text>
              <Divider />
              <SimpleGrid cols={3} spacing="md">
                <Select
                  label="Estado"
                  required
                  data={[
                    { value: "ACTIVE", label: "Activa" },
                    { value: "IN_DEVELOPMENT", label: "En desarrollo" },
                    { value: "MAINTENANCE", label: "Mantenimiento" },
                    { value: "IN_SUBSTITUTION", label: "En sustitución" },
                    { value: "DEPRECATED", label: "Deprecada" },
                  ]}
                  {...form.getInputProps("status")}
                />
                <Select
                  label="Tipo"
                  required
                  data={[
                    { value: "WEB", label: "Web" },
                    { value: "MOBILE", label: "Mobile" },
                    { value: "DESKTOP", label: "Desktop" },
                    { value: "API", label: "API" },
                    { value: "BATCH", label: "Batch" },
                    { value: "INTEGRATION", label: "Integración" },
                    { value: "INFRASTRUCTURE", label: "Infraestructura" },
                    { value: "OTHER", label: "Otro" },
                  ]}
                  {...form.getInputProps("type")}
                />
                <Select
                  label="Criticidad"
                  required
                  data={[
                    { value: "HIGH", label: "Alta" },
                    { value: "MEDIUM", label: "Media" },
                    { value: "LOW", label: "Baja" },
                  ]}
                  {...form.getInputProps("criticality")}
                />
              </SimpleGrid>

              <Stack gap="xs">
                <Text size="sm" fw={500}>Origen</Text>
                <Text size="xs" c="dimmed">¿Quién desarrolla y hostea esta solución?</Text>
                <SegmentedControl
                  data={[
                    { value: "INTERNAL", label: "Interna" },
                    { value: "EXTERNAL", label: "Externa" },
                    { value: "CUSTOM_THIRD", label: "A medida (tercero)" },
                  ]}
                  {...form.getInputProps("origin")}
                />
                {(form.values.origin === "EXTERNAL" || form.values.origin === "CUSTOM_THIRD") && (
                  <TextInput
                    label="Proveedor / empresa desarrolladora"
                    placeholder="Nombre de la empresa o proveedor"
                    {...form.getInputProps("vendor")}
                  />
                )}
              </Stack>

              <Stack gap="xs">
                <Text size="sm" fw={500}>Rol arquitectónico</Text>
                <Text size="xs" c="dimmed">Papel que cumple esta solución en el ecosistema.</Text>
                <Stack gap="xs">
                  {[
                    { value: "CORE_TRANSACTIONAL", label: "Core transaccional", desc: "System of Record. Ejecuta procesos críticos y es fuente oficial de datos maestros." },
                    { value: "SATELLITE", label: "Sistema satélite", desc: "Extiende el Core. No es dueño de datos maestros, consume servicios expuestos." },
                    { value: "INTEGRATION", label: "Plataforma de integración", desc: "Capa transversal. Desacopla sistemas mediante servicios y eventos estandarizados." },
                    { value: "DATA_ANALYTICS", label: "Información y analítica", desc: "Análisis y reporte. Consume datos sin modificar transacciones operativas." },
                    { value: "INTERACTION_CHANNEL", label: "Canal e interacción", desc: "Interfaz con usuarios. Sin lógica crítica, delega procesamiento a otros sistemas." },
                  ].map(r => (
                    <Paper
                      key={r.value}
                      withBorder
                      p="sm"
                      radius="md"
                      style={{
                        cursor: "pointer",
                        borderColor: form.values.role === r.value ? "var(--mantine-color-blue-6)" : undefined,
                        background: form.values.role === r.value ? "var(--mantine-color-blue-0)" : undefined,
                      }}
                      onClick={() => form.setFieldValue("role", r.value as SolutionRole)}
                    >
                      <Text size="sm" fw={500}>{r.label}</Text>
                      <Text size="xs" c="dimmed">{r.desc}</Text>
                    </Paper>
                  ))}
                </Stack>
              </Stack>
            </Stack>
          )}

          {/* STEP 3 — Contexto de negocio */}
          {step === 3 && (
            <Stack gap="md">
              <Title order={5}>Contexto de negocio</Title>
              <Text size="sm" c="dimmed">A qué parte del negocio sirve esta solución y quién es responsable.</Text>
              <Divider />
              <MultiSelect
                label="Dominios empresariales"
                description="Función de negocio que soporta. Ej: Gestión de pedidos, Finanzas."
                placeholder="Seleccionar dominios..."
                data={domains.map(d => ({ value: d.id, label: d.name }))}
                searchable
                {...form.getInputProps("domainIds")}
              />
              <MultiSelect
                label="Áreas responsables"
                description="Unidad organizacional dueña de la solución. Ej: Gerencia Comercial."
                placeholder="Seleccionar áreas..."
                data={areas.map(a => ({ value: a.id, label: a.name }))}
                searchable
                {...form.getInputProps("areaIds")}
              />
            </Stack>
          )}

          {/* STEP 4 — Tecnologías */}
          {step === 4 && (
            <Stack gap="md">
              <Title order={5}>Tecnologías</Title>
              <Text size="sm" c="dimmed">Stack tecnológico con el que está construida la solución.</Text>
              <Divider />
              <MultiSelect
                label="Tecnologías"
                placeholder="Buscar y seleccionar..."
                data={technologies.map(t => ({ value: t.id, label: `${t.name} (${t.category})` }))}
                searchable
                {...form.getInputProps("technologyIds")}
              />
            </Stack>
          )}

          {/* STEP 5 — Ambientes */}
          {step === 5 && (
            <Stack gap="md">
              <Title order={5}>Ambientes</Title>
              <Text size="sm" c="dimmed">URLs y estado de cada ambiente disponible.</Text>
              <Divider />
              {environments.map((env, i) => (
                <SimpleGrid key={env.name} cols={3} spacing="md">
                  <TextInput
                    label="Ambiente"
                    value={env.name}
                    onChange={e => updateEnvironment(i, "name", e.currentTarget.value)}
                  />
                  <TextInput
                    label="URL"
                    placeholder="https://..."
                    value={env.url}
                    onChange={e => updateEnvironment(i, "url", e.currentTarget.value)}
                  />
                  <Select
                    label="Estado"
                    value={env.isActive ? "true" : "false"}
                    onChange={v => updateEnvironment(i, "isActive", v === "true")}
                    data={[
                      { value: "true", label: "Activo" },
                      { value: "false", label: "Inactivo" },
                    ]}
                  />
                </SimpleGrid>
              ))}
            </Stack>
          )}

          {/* STEP 6 — Adjuntos */}
          {step === 6 && (
            <Stack gap="md">
              <Title order={5}>Adjuntos</Title>
              <Text size="sm" c="dimmed">URLs a documentos, diagramas y referencias externas.</Text>
              <Divider />
              {attachments.map((att, i) => (
                <Group key={i} align="flex-end" gap="sm">
                  <Select
                    label="Categoría"
                    style={{ width: 160 }}
                    value={att.category}
                    onChange={v => updateAttachment(i, "category", v ?? "DIAGRAM")}
                    data={[
                      { value: "DIAGRAM", label: "Diagrama" },
                      { value: "FUNCTIONAL_DOC", label: "Doc. funcional" },
                      { value: "TECHNICAL_DOC", label: "Doc. técnica" },
                      { value: "RUNBOOK", label: "Runbook" },
                      { value: "ADR", label: "ADR" },
                      { value: "API_CONTRACT", label: "Contrato API" },
                      { value: "OTHER", label: "Otro" },
                    ]}
                  />
                  <TextInput
                    label="Título"
                    placeholder="Nombre del documento"
                    style={{ flex: 1 }}
                    value={att.title}
                    onChange={e => updateAttachment(i, "title", e.currentTarget.value)}
                  />
                  <TextInput
                    label="URL"
                    placeholder="https://..."
                    style={{ flex: 1.5 }}
                    value={att.url}
                    onChange={e => updateAttachment(i, "url", e.currentTarget.value)}
                  />
                  <ActionIcon
                    color="red"
                    variant="subtle"
                    onClick={() => removeAttachment(i)}
                    disabled={attachments.length === 1}
                    mb={1}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              ))}
              <Button
                type="button"
                variant="default"
                leftSection={<IconPlus size={14} />}
                onClick={addAttachment}
                style={{ alignSelf: "flex-start" }}
              >
                Agregar adjunto
              </Button>
            </Stack>
          )}

        </Paper>

        {/* Navigation */}
        <Group justify="space-between" mt="lg">
          <Button
            type="button"
            variant="default"
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
          >
            Atras
          </Button>
          <Group>
            {step < steps.length ? (
              <Button
                type="button"
                onClick={() => setStep(s => s + 1)}
              >
                Siguiente
              </Button>
            ) : (
              <Button
                type="button"
                loading={loading}
                onClick={() => {
                  const validation = form.validate()
                  if (!validation.hasErrors) {
                    handleSubmit(form.values)
                  }
                }}
              >
                {isEditing ? "Guardar cambios" : "Guardar solución"}
              </Button>
            )}
          </Group>
        </Group>
      </form>
    </Box>
  )
}