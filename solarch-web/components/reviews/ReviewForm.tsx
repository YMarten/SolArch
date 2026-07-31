"use client"

import { useState } from "react"
import {
  Stack, Title, Text, Divider, Select, Textarea,
  TextInput, Button, Group, Paper, ActionIcon,
  Badge, SimpleGrid, Box
} from "@mantine/core"
import { DatePickerInput } from "@mantine/dates"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { IconPlus, IconTrash, IconArrowLeft } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { reviewsService } from "@/services/reviews.service"
import {
  CreateReviewDTO, ReviewResult, ReviewDimensionType, ReviewDimension, ReviewAction
} from "@/types/review"

const resultOptions = [
  { value: "COMPLIANT",            label: "Cumple"                    },
  { value: "COMPLIANT_WITH_NOTES", label: "Cumple con observaciones"  },
  { value: "NON_COMPLIANT",        label: "No cumple"                 },
  { value: "IN_REVIEW",            label: "En revisión"               },
]

const dimensionOptions = [
  { value: "SECURITY",            label: "Seguridad"                  },
  { value: "SCALABILITY",         label: "Escalabilidad"              },
  { value: "MAINTAINABILITY",     label: "Mantenibilidad"             },
  { value: "DOCUMENTATION",       label: "Documentación"              },
  { value: "TECH_ALIGNMENT",      label: "Alineación tecnológica"     },
  { value: "INTEGRATION_PATTERNS",label: "Patrones de integración"    },
  { value: "DATA_MANAGEMENT",     label: "Gestión de datos"           },
  { value: "RESILIENCE",          label: "Resiliencia"                },
  { value: "OTHER",               label: "Otro"                       },
]

const resultColors: Record<ReviewResult, string> = {
  COMPLIANT:            "green",
  COMPLIANT_WITH_NOTES: "yellow",
  NON_COMPLIANT:        "red",
  IN_REVIEW:            "blue",
}

interface Props {
  solutionId:   string
  solutionName: string
}

interface DimensionRow {
  dimension:   string
  result:      string
  observation: string
}

interface ActionRow {
  description: string
  responsible: string
  dueDate:     string
}

export function ReviewForm({ solutionId, solutionName }: Props) {
  const router  = useRouter()
  const [loading, setLoading]     = useState(false)
  const [dimensions, setDimensions] = useState<DimensionRow[]>([
    { dimension: "SECURITY", result: "COMPLIANT", observation: "" }
  ])
  const [actions, setActions] = useState<ActionRow[]>([])

  const form = useForm({
    initialValues: {
      reviewedBy:      "",
      reviewedAt:      new Date().toISOString().split("T")[0],
      result:          "COMPLIANT" as ReviewResult,
      summary:         "",
      reviewedVersion: "",
      nextReviewDate:  "",
    },
    validate: {
      reviewedBy: v => !v ? "El arquitecto es requerido" : null,
      result:     v => !v ? "El resultado es requerido"  : null,
    }
  })

  const addDimension = () =>
    setDimensions(prev => [...prev, { dimension: "SECURITY", result: "COMPLIANT", observation: "" }])

  const removeDimension = (i: number) =>
    setDimensions(prev => prev.filter((_, idx) => idx !== i))

  const updateDimension = (i: number, key: keyof DimensionRow, value: string) =>
    setDimensions(prev => prev.map((d, idx) => idx === i ? { ...d, [key]: value } : d))

  const addAction = () =>
    setActions(prev => [...prev, { description: "", responsible: "", dueDate: "" }])

  const removeAction = (i: number) =>
    setActions(prev => prev.filter((_, idx) => idx !== i))

  const updateAction = (i: number, key: keyof ActionRow, value: string) =>
    setActions(prev => prev.map((a, idx) => idx === i ? { ...a, [key]: value } : a))

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true)
    try {
      const payload: CreateReviewDTO = {
        solutionId,
        reviewedBy:      values.reviewedBy,
        reviewedAt:      values.reviewedAt,
        result:          values.result,
        summary:         values.summary || undefined,
        reviewedVersion: values.reviewedVersion || undefined,
        nextReviewDate:  values.nextReviewDate || undefined,
        dimensions: dimensions
          .filter(d => d.dimension)
          .map(d => ({
            dimension:   d.dimension as ReviewDimensionType,
            result:      d.result as ReviewResult,
            observation: d.observation || undefined,
          })),
        actions: actions
          .filter(a => a.description && a.responsible)
          .map(a => ({
            description: a.description,
            responsible: a.responsible,
            dueDate:     a.dueDate || undefined,
          })),
      }
      await reviewsService.create(payload)
      notifications.show({ message: "Revisión registrada correctamente", color: "green" })
      router.push(`/solutions/${solutionId}`)
    } catch (e: any) {
      notifications.show({ message: e.message, color: "red" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box maw={860} mx="auto" p="xl">
      <Group mb="xl">
        <ActionIcon variant="subtle" onClick={() => router.push(`/solutions/${solutionId}`)}>
          <IconArrowLeft size={18} />
        </ActionIcon>
        <Stack gap={0}>
          <Title order={3}>Nueva revisión arquitectónica</Title>
          <Text size="sm" c="dimmed">{solutionName}</Text>
        </Stack>
      </Group>

      <form onSubmit={(e) => { e.preventDefault(); form.onSubmit(handleSubmit)() }}>
        <Stack gap="md">

          {/* General */}
          <Paper withBorder p="lg" radius="md">
            <Title order={5} mb="xs">Información general</Title>
            <Divider mb="md" />
            <SimpleGrid cols={2} spacing="md">
              <TextInput
                label="Arquitecto revisor"
                placeholder="Nombre del arquitecto"
                required
                {...form.getInputProps("reviewedBy")}
              />
              <Select
                label="Resultado general"
                required
                data={resultOptions}
                {...form.getInputProps("result")}
              />
              <TextInput
                label="Versión revisada"
                placeholder="v2.4.1"
                {...form.getInputProps("reviewedVersion")}
              />
              <TextInput
                label="Próxima revisión"
                type="date"
                {...form.getInputProps("nextReviewDate")}
              />
            </SimpleGrid>
            <Textarea
              label="Resumen ejecutivo"
              placeholder="Resumen de los hallazgos principales..."
              rows={3}
              mt="md"
              {...form.getInputProps("summary")}
            />
          </Paper>

          {/* Dimensiones */}
          <Paper withBorder p="lg" radius="md">
            <Group justify="space-between" mb="xs">
              <Title order={5}>Dimensiones evaluadas</Title>
              <Button
                type="button"
                size="xs"
                variant="default"
                leftSection={<IconPlus size={12} />}
                onClick={addDimension}
              >
                Agregar dimensión
              </Button>
            </Group>
            <Divider mb="md" />
            <Stack gap="sm">
              {dimensions.map((d, i) => (
                <Paper key={i} withBorder p="sm" radius="md">
                  <Group align="flex-start" gap="sm">
                    <Select
                      placeholder="Dimensión"
                      data={dimensionOptions}
                      value={d.dimension}
                      onChange={v => updateDimension(i, "dimension", v ?? "")}
                      style={{ width: 200 }}
                    />
                    <Select
                      placeholder="Resultado"
                      data={resultOptions}
                      value={d.result}
                      onChange={v => updateDimension(i, "result", v ?? "")}
                      style={{ width: 200 }}
                    />
                    <Textarea
                      placeholder="Observaciones..."
                      value={d.observation}
                      onChange={e => updateDimension(i, "observation", e.currentTarget.value)}
                      style={{ flex: 1 }}
                      rows={2}
                    />
                    <ActionIcon
                      type="button"
                      color="red"
                      variant="subtle"
                      onClick={() => removeDimension(i)}
                      disabled={dimensions.length === 1}
                      mt={4}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Paper>
              ))}
            </Stack>
          </Paper>

          {/* Acciones */}
          <Paper withBorder p="lg" radius="md">
            <Group justify="space-between" mb="xs">
              <Title order={5}>Acciones de remediación</Title>
              <Button
                type="button"
                size="xs"
                variant="default"
                leftSection={<IconPlus size={12} />}
                onClick={addAction}
              >
                Agregar acción
              </Button>
            </Group>
            <Divider mb="md" />
            {actions.length === 0 ? (
              <Text size="sm" c="dimmed">
                Sin acciones de remediación. Agrégalas si hay hallazgos que requieren atención.
              </Text>
            ) : (
              <Stack gap="sm">
                {actions.map((a, i) => (
                  <Paper key={i} withBorder p="sm" radius="md">
                    <Group align="flex-start" gap="sm">
                      <Textarea
                        placeholder="Descripción de la acción..."
                        value={a.description}
                        onChange={e => updateAction(i, "description", e.currentTarget.value)}
                        style={{ flex: 2 }}
                        rows={2}
                      />
                      <TextInput
                        placeholder="Responsable"
                        value={a.responsible}
                        onChange={e => updateAction(i, "responsible", e.currentTarget.value)}
                        style={{ flex: 1 }}
                      />
                      <TextInput
                        type="date"
                        label="Fecha límite"
                        value={a.dueDate}
                        onChange={e => updateAction(i, "dueDate", e.currentTarget.value)}
                        style={{ width: 160 }}
                      />
                      <ActionIcon
                        type="button"
                        color="red"
                        variant="subtle"
                        onClick={() => removeAction(i)}
                        mt={24}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            )}
          </Paper>

          <Group justify="flex-end">
            <Button
              type="button"
              variant="default"
              onClick={() => router.push(`/solutions/${solutionId}`)}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={loading}>
              Guardar revisión
            </Button>
          </Group>
        </Stack>
      </form>
    </Box>
  )
}