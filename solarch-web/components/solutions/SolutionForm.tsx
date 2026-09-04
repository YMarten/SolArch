"use client"

import { useState } from "react"
import { ActionIcon, Box, Button, Divider, Group, MultiSelect, Paper, Select, SimpleGrid, Stack, TagsInput, Text, Textarea, TextInput, Title } from "@mantine/core"
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

const yesNoUnknown = [{ value: "YES", label: "Sí" }, { value: "NO", label: "No" }, { value: "UNKNOWN", label: "No determinado" }]
const booleanOptions = [{ value: "false", label: "No" }, { value: "true", label: "Sí" }]
const help = {
  owner: "Persona que conoce el uso funcional y puede responder por la solución.",
  area: "Unidad organizacional principal responsable de la solución.",
  process: "Proceso de negocio que la solución ejecuta o apoya directamente.",
  users: "Áreas, equipos o tipos de usuarios que utilizan la solución.",
  usage: "Situación real de uso, independiente del estado arquitectónico.",
  frequency: "Regularidad con la que usuarios o procesos utilizan la solución.",
  criticality: "Impacto para el negocio si la solución deja de estar disponible.",
  similar: "Otra solución que cubre total o parcialmente la misma funcionalidad.",
  support: "Indica si existe soporte activo del fabricante, proveedor o implementador.",
  updates: "Indica si la versión instalada sigue recibiendo parches o actualizaciones.",
  license: "Indica si el uso está respaldado por una licencia o contrato válido.",
  hosting: "Lugar y modalidad donde se ejecuta y administra la solución.",
  dependencies: "Servicios, infraestructura, proveedores u otros elementos necesarios para operar.",
  impact: "Consecuencias de una interrupción sobre otros sistemas o procesos.",
  problems: "Dificultades funcionales, técnicas, operativas o contractuales conocidas.",
  initiative: "Esfuerzo formal o planificado para reemplazar o retirar la solución.",
  replacement: "Solución existente o propuesta que asumirá sus funciones.",
}

export function SolutionForm({ technologies, domains, areas, capabilities, solutions, initialValues, solutionId }: Props) {
  const router = useRouter()
  const isEditing = Boolean(solutionId)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const form = useForm<CreateSolutionDTO>({
    initialValues: {
      name: "", description: "", version: "", status: "ACTIVE", type: "WEB", role: "CORE_TRANSACTIONAL",
      criticality: "HIGH", origin: "EXTERNAL", vendor: "", owner: "", techOwner: "", repoUrl: "", tags: [],
      technologyIds: [], domainIds: [], capabilityIds: [], areaIds: [], responsibleAreaId: null,
      businessProcess: "", userGroups: [], usageStatus: null, usageFrequency: "UNKNOWN", hasSimilarSolution: false,
      similarSolutionId: null, supportStatus: "UNKNOWN", receivesUpdates: "UNKNOWN", licenseStatus: "UNKNOWN",
      hostingMode: "UNKNOWN", knownDependencies: "", failureImpact: "UNKNOWN", failureImpactDetails: "",
      hasProblems: false, problemDetails: "", hasReplacementInitiative: false, replacementSolutionId: null,
      proposedReplacementName: "", additionalNotes: "", ...initialValues,
    },
    validate: {
      name: v => v?.trim() ? null : "El nombre es requerido",
      owner: v => v?.trim() ? null : "El contacto principal es requerido",
      responsibleAreaId: v => v ? null : "El área responsable es requerida",
      businessProcess: v => v?.trim() ? null : "El proceso soportado es requerido",
      usageStatus: v => v ? null : "El estado de uso es requerido",
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

  return <Box maw={920} mx="auto" p="xl">
    <Group mb="xl"><ActionIcon variant="subtle" onClick={() => router.back()} aria-label="Volver"><IconArrowLeft size={18} /></ActionIcon><Title order={3}>{isEditing ? "Editar solución" : "Nueva solución"}</Title></Group>
    <Group mb="xl" gap="xs">{steps.map((name, i) => <Button key={name} size="xs" variant={step === i + 1 ? "filled" : "default"} onClick={() => setStep(i + 1)}>{i + 1}. {name}</Button>)}</Group>
    <Paper withBorder p="lg" radius="md">
      {step === 1 && <Stack gap="md"><Title order={5}>Identificación</Title><Divider />
        <SimpleGrid cols={{ base: 1, sm: 2 }}><TextInput label="Nombre" required {...form.getInputProps("name")} /><TextInput label="Versión actual" {...form.getInputProps("version")} /></SimpleGrid>
        <Textarea label="Descripción general" rows={3} {...form.getInputProps("description")} />
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Select label="Tipo" data={["WEB","DESKTOP","MOBILE","API","BATCH","INTEGRATION","INFRASTRUCTURE","OTHER"]} {...form.getInputProps("type")} />
          <Select label="Estado arquitectónico" data={["ACTIVE","DEPRECATED","IN_SUBSTITUTION","IN_DEVELOPMENT","MAINTENANCE"]} {...form.getInputProps("status")} />
          <Select label="Origen" data={[{value:"INTERNAL",label:"Interna"},{value:"EXTERNAL",label:"Externa"},{value:"CUSTOM_THIRD",label:"A medida por tercero"}]} {...form.getInputProps("origin")} />
          <Select label="Rol arquitectónico" data={[{value:"CORE_TRANSACTIONAL",label:"Core transaccional"},{value:"SATELLITE",label:"Satélite"},{value:"INTEGRATION",label:"Integración"},{value:"DATA_ANALYTICS",label:"Datos y analítica"},{value:"INTERACTION_CHANNEL",label:"Canal de interacción"}]} {...form.getInputProps("role")} />
        </SimpleGrid>
        <SimpleGrid cols={{ base: 1, sm: 2 }}><TextInput label="URL del repositorio" {...form.getInputProps("repoUrl")} /><TextInput type="date" label="Último despliegue a producción" {...form.getInputProps("lastDeploy")} /></SimpleGrid>
        <TagsInput label="Etiquetas" {...form.getInputProps("tags")} />
      </Stack>}

      {step === 2 && <Stack gap="md"><Title order={5}>Uso y responsabilidad</Title><Divider />
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Select label={label("Área responsable", help.area)} searchable required data={areas.map(a => ({value:a.id,label:a.name}))} {...form.getInputProps("responsibleAreaId")} />
          <TextInput label={label("Contacto principal", help.owner)} required {...form.getInputProps("owner")} />
          <TextInput label="Responsable técnico interno" {...form.getInputProps("techOwner")} />
          <TextInput label={label("Proceso soportado", help.process)} required {...form.getInputProps("businessProcess")} />
        </SimpleGrid>
        <TagsInput label={label("Áreas o grupos usuarios", help.users)} placeholder="Escribe un grupo y presiona Enter" {...form.getInputProps("userGroups")} />
        <SimpleGrid cols={{ base: 1, sm: 3 }}>
          <Select label={label("Estado actual de uso", help.usage)} required data={[{value:"IN_USE",label:"En uso"},{value:"LIMITED_USE",label:"Uso limitado"},{value:"IN_IMPLEMENTATION",label:"En implementación"},{value:"IN_SUBSTITUTION",label:"En sustitución"},{value:"OUT_OF_USE",label:"Fuera de uso"}]} {...form.getInputProps("usageStatus")} />
          <Select label={label("Frecuencia de uso", help.frequency)} data={[{value:"CONTINUOUS",label:"Continua"},{value:"DAILY",label:"Diaria"},{value:"WEEKLY",label:"Semanal"},{value:"MONTHLY",label:"Mensual"},{value:"OCCASIONAL",label:"Ocasional"},{value:"UNKNOWN",label:"No determinada"}]} {...form.getInputProps("usageFrequency")} />
          <Select label={label("Criticidad", help.criticality)} data={[{value:"HIGH",label:"Alta"},{value:"MEDIUM",label:"Media"},{value:"LOW",label:"Baja"}]} {...form.getInputProps("criticality")} />
        </SimpleGrid>
        <Select label={label("¿Existe una solución similar?", help.similar)} data={booleanOptions} value={String(form.values.hasSimilarSolution)} onChange={v => form.setFieldValue("hasSimilarSolution", v === "true")} />
        {form.values.hasSimilarSolution && <Select label="Solución similar" searchable required data={solutionOptions} {...form.getInputProps("similarSolutionId")} />}
        <MultiSelect label="Dominios empresariales" searchable data={domains.map(d => ({value:d.id,label:d.name}))} {...form.getInputProps("domainIds")} />
        <MultiSelect label="Áreas relacionadas" searchable data={areas.map(a => ({value:a.id,label:a.name}))} {...form.getInputProps("areaIds")} />
        <MultiSelect label="Capacidades empresariales" searchable data={capabilities.map(c => ({value:c.id,label:c.name}))} {...form.getInputProps("capabilityIds")} />
      </Stack>}

      {step === 3 && <Stack gap="md"><Title order={5}>Proveedor y soporte</Title><Divider />
        <SimpleGrid cols={{ base: 1, sm: 2 }}><TextInput label="Proveedor" {...form.getInputProps("vendor")} /><Select label={label("Soporte vigente", help.support)} data={yesNoUnknown} {...form.getInputProps("supportStatus")} /><Select label={label("La versión recibe actualizaciones", help.updates)} data={yesNoUnknown} {...form.getInputProps("receivesUpdates")} /><Select label={label("Contrato o licenciamiento vigente", help.license)} data={yesNoUnknown} {...form.getInputProps("licenseStatus")} /></SimpleGrid>
      </Stack>}

      {step === 4 && <Stack gap="md"><Title order={5}>Tecnología y dependencias</Title><Divider />
        <Select label={label("Modalidad de alojamiento", help.hosting)} data={[{value:"CLOUD",label:"Nube"},{value:"INTERNAL_INFRASTRUCTURE",label:"Infraestructura interna"},{value:"VENDOR_INFRASTRUCTURE",label:"Infraestructura del proveedor"},{value:"HYBRID",label:"Híbrida"},{value:"UNKNOWN",label:"No determinada"}]} {...form.getInputProps("hostingMode")} />
        <MultiSelect label="Tecnologías" searchable data={technologies.map(t => ({value:t.id,label:`${t.name} (${t.category})`}))} {...form.getInputProps("technologyIds")} />
        <Textarea label={label("Dependencias conocidas", help.dependencies)} rows={3} {...form.getInputProps("knownDependencies")} />
        <Select label={label("Impacto de una falla", help.impact)} data={[{value:"HIGH",label:"Alto"},{value:"MEDIUM",label:"Medio"},{value:"LOW",label:"Bajo"},{value:"UNKNOWN",label:"No determinado"}]} {...form.getInputProps("failureImpact")} />
        <Textarea label="Detalle del impacto" rows={3} {...form.getInputProps("failureImpactDetails")} />
        <Text size="xs" c="dimmed">Los sistemas integrados se administran como conexiones desde el detalle de la solución.</Text>
      </Stack>}

      {step === 5 && <Stack gap="md"><Title order={5}>Situación actual</Title><Divider />
        <Select label={label("¿Tiene problemas o limitaciones?", help.problems)} data={booleanOptions} value={String(form.values.hasProblems)} onChange={v => form.setFieldValue("hasProblems", v === "true")} />
        {form.values.hasProblems && <Textarea label="Detalle de los problemas" required rows={4} {...form.getInputProps("problemDetails")} />}
        <Select label={label("¿Existe iniciativa de sustitución o retiro?", help.initiative)} data={booleanOptions} value={String(form.values.hasReplacementInitiative)} onChange={v => form.setFieldValue("hasReplacementInitiative", v === "true")} />
        {form.values.hasReplacementInitiative && <SimpleGrid cols={{ base: 1, sm: 2 }}><Select label={label("Solución sustituta registrada", help.replacement)} searchable clearable data={solutionOptions} {...form.getInputProps("replacementSolutionId")} /><TextInput label="Nombre de sustituta propuesta" description="Úsalo si todavía no está registrada." {...form.getInputProps("proposedReplacementName")} /></SimpleGrid>}
        <Textarea label="Observaciones adicionales" rows={4} {...form.getInputProps("additionalNotes")} />
      </Stack>}
    </Paper>
    <Group justify="space-between" mt="lg"><Button variant="default" disabled={step === 1} onClick={() => setStep(v => v - 1)}>Atrás</Button>{step < steps.length ? <Button onClick={() => setStep(v => v + 1)}>Siguiente</Button> : <Button loading={loading} onClick={() => form.onSubmit(handleSubmit)()}>{isEditing ? "Guardar cambios" : "Guardar solución"}</Button>}</Group>
  </Box>
}
