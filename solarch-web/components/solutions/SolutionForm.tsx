"use client"

import { solutionStatusOptions, usageStatusOptions, statusExplanation } from "@/lib/solution-status"
import { hostingModeOptions, managementModelOptions } from "@/lib/hosting-mode"
import { DescribedSelect } from "@/components/ui/DescribedSelect"
import { solutionTypeOptions, solutionOriginOptions, solutionRoleOptions, usageFrequencyOptions, criticalityOptions, failureImpactOptions, supportStatusOptions, updatesOptions, licenseStatusOptions, similarOptions, problemOptions, replacementOptions } from "@/lib/solution-options"
import { InlineCatalogField, type CatalogKind, type CatalogEntry } from "@/components/catalog/InlineCatalogField"
import { useState } from "react"
import { ActionIcon, Box, Button, Divider, Group, Paper, Select, SimpleGrid, Stack, TagsInput, Text, Textarea, TextInput, Title } from "@mantine/core"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { IconArrowLeft } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { solutionsService } from "@/services/solutions.service"
import { CreateSolutionDTO, Solution } from "@/types/solution"
import { Technology } from "@/types/technology"
import { Domain } from "@/types/domain"
import { Area } from "@/types/area"
import { Capability } from "@/types/capability"
import { FieldLabelHelp } from "@/components/ui/FieldLabelHelp"

interface Props {
  technologies: Technology[]; domains: Domain[]; areas: Area[]; capabilities: Capability[]
  solutions: Solution[]; initialValues?: Partial<CreateSolutionDTO>; solutionId?: string
}

const help = {
  owner: "Persona que conoce el uso funcional y puede responder por la solución.",
  area: "Unidad organizacional principal responsable de la solución.",
  process: "Proceso de negocio que la solución ejecuta o apoya directamente.",
  users: "Áreas, equipos o tipos de usuarios que utilizan la solución.",
  usage: "Indica cómo se utiliza actualmente la solución.",
  frequency: "Regularidad con la que usuarios o procesos utilizan la solución.",
  criticality: "Impacto para el negocio si la solución deja de estar disponible.",
  similar: "Otra solución que cubre total o parcialmente la misma funcionalidad.",
  support: "Indica si existe soporte activo del fabricante, proveedor o implementador.",
  updates: "Indica si la versión instalada sigue recibiendo parches o actualizaciones.",
  license: "Indica si el uso está respaldado por una licencia o contrato válido.",
  hosting: "Indica dónde opera la solución.",
  dependencies: "Servicios, infraestructura, proveedores u otros elementos necesarios para operar.",
  impact: "Consecuencias de una interrupción sobre otros sistemas o procesos.",
  problems: "Dificultades funcionales, técnicas, operativas o contractuales conocidas.",
  initiative: "Esfuerzo formal o planificado para reemplazar o retirar la solución.",
  replacement: "Solución existente o propuesta que asumirá sus funciones.",
}

export function SolutionForm({ technologies, domains, areas, capabilities, solutions, initialValues, solutionId }: Props) {
  const [createdCatalogs, setCreatedCatalogs] = useState<Record<CatalogKind, CatalogEntry[]>>({ domains: [], areas: [], capabilities: [], technologies: [] })
  const catalogEntries = (kind: CatalogKind) => [...new Map([...({ domains, areas, capabilities, technologies }[kind]), ...createdCatalogs[kind]].map(item => [item.id, item])).values()]
  const addCatalogEntry = (kind: CatalogKind, record: CatalogEntry) => setCreatedCatalogs(current => ({ ...current, [kind]: [...current[kind].filter(item => item.id !== record.id), record] }))
  const router = useRouter()
  const isEditing = Boolean(solutionId)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const form = useForm<CreateSolutionDTO>({
    initialValues: {
      status: "ACTIVE", type: "WEB", role: "CORE_TRANSACTIONAL",
      criticality: "HIGH", origin: "EXTERNAL", responsibleAreaId: null,
      usageStatus: null, usageFrequency: "UNKNOWN", hasSimilarSolution: false,
      similarSolutionId: null, supportStatus: "UNKNOWN", receivesUpdates: "UNKNOWN", licenseStatus: "UNKNOWN",
      hostingMode: "UNKNOWN", failureImpact: "UNKNOWN",
      hasProblems: false, hasReplacementInitiative: false, replacementSolutionId: null,
      ...initialValues,
      managementModel: initialValues?.managementModel ?? "UNKNOWN",
      // API fields may be null or undefined; keep inputs controlled from mount.
        name: initialValues?.name ?? "",
        description: initialValues?.description ?? "",
        version: initialValues?.version ?? "",
        vendor: initialValues?.vendor ?? "",
        owner: initialValues?.owner ?? "",
        techOwner: initialValues?.techOwner ?? "",
        repoUrl: initialValues?.repoUrl ?? "",
        lastDeploy: initialValues?.lastDeploy ?? "",
        businessProcess: initialValues?.businessProcess ?? "",
        knownDependencies: initialValues?.knownDependencies ?? "",
        failureImpactDetails: initialValues?.failureImpactDetails ?? "",
        problemDetails: initialValues?.problemDetails ?? "",
        proposedReplacementName: initialValues?.proposedReplacementName ?? "",
        additionalNotes: initialValues?.additionalNotes ?? "",
        tags: initialValues?.tags ?? [],
        userGroups: initialValues?.userGroups ?? [],
        technologyIds: initialValues?.technologyIds ?? [],
        domainIds: initialValues?.domainIds ?? [],
        capabilityIds: initialValues?.capabilityIds ?? [],
        areaIds: initialValues?.areaIds ?? [],
    },
    validate: {
      name: v => v?.trim() ? null : "El nombre es requerido",
      owner: v => v?.trim() ? null : "El contacto principal es requerido",
      responsibleAreaId: v => v ? null : "El área responsable es requerida",
      businessProcess: v => v?.trim() ? null : "El proceso soportado es requerido",
      usageStatus: v => v == null || usageStatusOptions.some(option => option.value === v) ? null : "Selecciona un estado de uso válido",
      status: v => solutionStatusOptions.some(option => option.value === v) ? null : "Selecciona un estado arquitectónico válido",
      hostingMode: v => hostingModeOptions.some(option => option.value === v) ? null : "Selecciona una modalidad de alojamiento válida",
      managementModel: v => managementModelOptions.some(option => option.value === v) ? null : "Selecciona un modelo de administración válido",
      similarSolutionId: (v, values) => values.hasSimilarSolution && !v ? "Selecciona una solución similar" : null,
      problemDetails: (v, values) => values.hasProblems && !v?.trim() ? "Describe los problemas o limitaciones" : null,
    },
  })
  const solutionOptions = solutions.filter(s => s.id !== solutionId).map(s => ({ value: s.id, label: s.name }))
  const label = (name: string, description: string) => <FieldLabelHelp label={name} help={description} />
  const handleSubmit = async (values: CreateSolutionDTO) => {
    setLoading(true)
    try {
      const payload = { ...values,
        similarSolutionId: values.hasSimilarSolution ? values.similarSolutionId : null,
        problemDetails: values.hasProblems ? values.problemDetails : "",
        replacementSolutionId: values.hasReplacementInitiative ? values.replacementSolutionId : null,
        proposedReplacementName: values.hasReplacementInitiative ? values.proposedReplacementName : "",
      }
      if (solutionId) await solutionsService.update(solutionId, payload); else await solutionsService.create(payload)
      notifications.show({ message: isEditing ? "Solución actualizada" : "Solución registrada", color: "green" })
      router.push(solutionId ? `/solutions/${solutionId}` : "/solutions")
    } catch (error) {
      notifications.show({ message: error instanceof Error ? error.message : "No se pudo guardar", color: "red" })
    } finally { setLoading(false) }
  }
  const steps = ["Identificación", "Uso", "Soporte", "Tecnología", "Situación"]

  return <Box component="form" noValidate onSubmit={form.onSubmit(handleSubmit, errors => {
    const firstInvalidStep = errors.name || errors.status ? 1
      : ["owner", "responsibleAreaId", "businessProcess", "usageStatus", "similarSolutionId"].some(field => errors[field]) ? 2
      : errors.hostingMode || errors.managementModel ? 4 : 5
    setStep(firstInvalidStep)
    notifications.show({ message: "Revisa los campos indicados antes de guardar.", color: "red" })
  })} maw={920} mx="auto" p="xl">
    <Group mb="xl"><ActionIcon variant="subtle" onClick={() => router.back()} aria-label="Volver"><IconArrowLeft size={18} /></ActionIcon><Title order={3} style={{ overflowWrap: "anywhere", minWidth: 0, flex: 1 }}>{isEditing ? `Editar solución${initialValues?.name ? ` · ${initialValues.name}` : ""}` : "Nueva solución"}</Title></Group>
    <Group mb="xl" gap="xs">{steps.map((name, i) => <Button key={name} size="xs" variant={step === i + 1 ? "filled" : "default"} onClick={() => setStep(i + 1)}>{i + 1}. {name}</Button>)}</Group>
    <Paper withBorder p="lg" radius="md">
      {step === 1 && <Stack gap="md"><Title order={5}>Identificación</Title><Divider />
        <SimpleGrid cols={{ base: 1, sm: 2 }}><TextInput label="Nombre" /* required */ {...form.getInputProps("name")} /><TextInput label="Versión actual" {...form.getInputProps("version")} /></SimpleGrid>
        <Textarea label="Descripción general" rows={3} {...form.getInputProps("description")} />
        <Text size="sm" c="dimmed">{statusExplanation}</Text>
        <DescribedSelect label={label("Estado arquitectónico", "Indica la situación de la solución dentro de la arquitectura.")} required allowDeselect={false} data={solutionStatusOptions} {...form.getInputProps("status")} value={form.values.status ?? null} />
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <DescribedSelect label="Tipo" data={solutionTypeOptions} {...form.getInputProps("type")} value={form.values.type ?? null} />
          <DescribedSelect label="Origen" data={solutionOriginOptions} {...form.getInputProps("origin")} value={form.values.origin ?? null} />
          <DescribedSelect label="Rol arquitectónico" data={solutionRoleOptions} {...form.getInputProps("role")} value={form.values.role ?? null} />
        </SimpleGrid>
        <SimpleGrid cols={{ base: 1, sm: 2 }}><TextInput label="URL del repositorio" {...form.getInputProps("repoUrl")} /><TextInput type="date" label="Último despliegue a producción" {...form.getInputProps("lastDeploy")} /></SimpleGrid>
        <TagsInput label="Etiquetas" {...form.getInputProps("tags")} />
      </Stack>}

      {step === 2 && <Stack gap="md"><Title order={5}>Uso y responsabilidad</Title><Divider />
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <InlineCatalogField kind="areas" label={label("Área responsable", help.area)} entries={catalogEntries("areas")} value={form.values.responsibleAreaId ?? null} error={form.errors.responsibleAreaId} onChange={ids => form.setFieldValue("responsibleAreaId", ids[0] ?? null)} onCreated={record => addCatalogEntry("areas", record)} />
          <TextInput label={label("Contacto principal", help.owner)} /* required */ {...form.getInputProps("owner")} />
          <TextInput label="Responsable técnico interno" {...form.getInputProps("techOwner")} />
          <TextInput label={label("Proceso soportado", help.process)} /* required */ {...form.getInputProps("businessProcess")} />
        </SimpleGrid>
        <TagsInput label={label("Áreas o grupos usuarios", help.users)} placeholder="Escribe un grupo y presiona Enter" {...form.getInputProps("userGroups")} />
        <Text size="sm" c="dimmed">{statusExplanation}</Text>
        <SimpleGrid cols={{ base: 1, sm: 3 }}>
          <DescribedSelect label={label("Estado actual de uso", help.usage)} /* required */ data={usageStatusOptions} {...form.getInputProps("usageStatus")} value={form.values.usageStatus ?? null} />
          <DescribedSelect label={label("Frecuencia de uso", help.frequency)} data={usageFrequencyOptions} {...form.getInputProps("usageFrequency")} value={form.values.usageFrequency ?? null} />
          <DescribedSelect label={label("Criticidad", help.criticality)} data={criticalityOptions} {...form.getInputProps("criticality")} value={form.values.criticality ?? null} />
        </SimpleGrid>
        <DescribedSelect label={label("¿Existe una solución similar?", help.similar)} data={similarOptions} value={String(form.values.hasSimilarSolution)} onChange={v => form.setFieldValue("hasSimilarSolution", v === "true")} />
        {form.values.hasSimilarSolution && <Select label="Solución similar" searchable /* required */ data={solutionOptions} {...form.getInputProps("similarSolutionId")} />}
        <InlineCatalogField kind="domains" multiple label="Dominios empresariales" entries={catalogEntries("domains")} domains={catalogEntries("domains")} defaultDomainId={form.values.domainIds?.length === 1 ? form.values.domainIds[0] : undefined} value={form.values.domainIds ?? []} error={form.errors.domainIds} onChange={ids => form.setFieldValue("domainIds", ids)} onCreated={record => addCatalogEntry("domains", record)} />
        <InlineCatalogField kind="areas" multiple label="Áreas relacionadas" entries={catalogEntries("areas")} domains={catalogEntries("domains")} defaultDomainId={form.values.domainIds?.length === 1 ? form.values.domainIds[0] : undefined} value={form.values.areaIds ?? []} error={form.errors.areaIds} onChange={ids => form.setFieldValue("areaIds", ids)} onCreated={record => addCatalogEntry("areas", record)} />
        <InlineCatalogField kind="capabilities" multiple label="Capacidades empresariales" entries={catalogEntries("capabilities")} domains={catalogEntries("domains")} defaultDomainId={form.values.domainIds?.length === 1 ? form.values.domainIds[0] : undefined} value={form.values.capabilityIds ?? []} error={form.errors.capabilityIds} onChange={ids => form.setFieldValue("capabilityIds", ids)} onCreated={record => addCatalogEntry("capabilities", record)} />
      </Stack>}

      {step === 3 && <Stack gap="md"><Title order={5}>Proveedor y soporte</Title><Divider />
        <SimpleGrid cols={{ base: 1, sm: 2 }}><TextInput label="Proveedor" {...form.getInputProps("vendor")} /><DescribedSelect label={label("Soporte vigente", help.support)} data={supportStatusOptions} {...form.getInputProps("supportStatus")} value={form.values.supportStatus ?? null} /><DescribedSelect label={label("La versión recibe actualizaciones", help.updates)} data={updatesOptions} {...form.getInputProps("receivesUpdates")} value={form.values.receivesUpdates ?? null} /><DescribedSelect label={label("Contrato o licenciamiento vigente", help.license)} data={licenseStatusOptions} {...form.getInputProps("licenseStatus")} value={form.values.licenseStatus ?? null} /></SimpleGrid>
      </Stack>}

      {step === 4 && <Stack gap="md"><Title order={5}>Tecnología y dependencias</Title><Divider />
        <DescribedSelect label={label("Modalidad de alojamiento", help.hosting)} allowDeselect={false} data={hostingModeOptions} {...form.getInputProps("hostingMode")} value={form.values.hostingMode ?? null} />
        <DescribedSelect label={label("Modelo de administración", "Indica quién administra la plataforma.")} allowDeselect={false} data={managementModelOptions} {...form.getInputProps("managementModel")} value={form.values.managementModel ?? null} />
        <InlineCatalogField kind="technologies" multiple label="Tecnologías" entries={catalogEntries("technologies")} domains={catalogEntries("domains")} defaultDomainId={form.values.domainIds?.length === 1 ? form.values.domainIds[0] : undefined} value={form.values.technologyIds ?? []} error={form.errors.technologyIds} onChange={ids => form.setFieldValue("technologyIds", ids)} onCreated={record => addCatalogEntry("technologies", record)} />
        <Textarea label={label("Dependencias conocidas", help.dependencies)} rows={3} {...form.getInputProps("knownDependencies")} />
        <DescribedSelect label={label("Impacto de una falla", help.impact)} data={failureImpactOptions} {...form.getInputProps("failureImpact")} value={form.values.failureImpact ?? null} />
        <Textarea label="Detalle del impacto" rows={3} {...form.getInputProps("failureImpactDetails")} />
        <Text size="xs" c="dimmed">Los sistemas integrados se administran como conexiones desde el detalle de la solución.</Text>
      </Stack>}

      {step === 5 && <Stack gap="md"><Title order={5}>Situación actual</Title><Divider />
        <DescribedSelect label={label("¿Tiene problemas o limitaciones?", help.problems)} data={problemOptions} value={String(form.values.hasProblems)} onChange={v => form.setFieldValue("hasProblems", v === "true")} />
        {form.values.hasProblems && <Textarea label="Detalle de los problemas" /* required */ rows={4} {...form.getInputProps("problemDetails")} />}
        <DescribedSelect label={label("¿Existe iniciativa de sustitución o retiro?", help.initiative)} data={replacementOptions} value={String(form.values.hasReplacementInitiative)} onChange={v => form.setFieldValue("hasReplacementInitiative", v === "true")} />
        {form.values.hasReplacementInitiative && <SimpleGrid cols={{ base: 1, sm: 2 }}><Select label={label("Solución sustituta registrada", help.replacement)} searchable clearable data={solutionOptions} {...form.getInputProps("replacementSolutionId")} /><TextInput label="Nombre de sustituta propuesta" description="Úsalo si todavía no está registrada." {...form.getInputProps("proposedReplacementName")} /></SimpleGrid>}
        <Textarea label="Observaciones adicionales" rows={4} {...form.getInputProps("additionalNotes")} />
      </Stack>}
    </Paper>
    <Group justify="space-between" mt="lg"><Button type="button" variant="default" disabled={step === 1} onClick={() => setStep(v => v - 1)}>Atrás</Button>{step < steps.length ? <Button type="button" onClick={() => setStep(v => v + 1)}>Siguiente</Button> : <Button type="submit" loading={loading}>{isEditing ? "Guardar cambios" : "Guardar solución"}</Button>}</Group>
  </Box>
}
