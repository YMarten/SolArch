"use client"

import { useEffect, useState } from "react"
import { ActionIcon, Alert, Button, Center, Drawer, Group, Loader, Stack, Text, Tooltip } from "@mantine/core"
import { IconAlertCircle, IconEdit, IconMaximize } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { solutionsService } from "@/services/solutions.service"
import { Solution } from "@/types/solution"
import { SolutionDetail } from "./SolutionDetail"

function PreviewContent({ id }: { id: string }) {
  const [solution, setSolution] = useState<Solution | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    solutionsService.getById(id)
      .then(result => { if (active) setSolution(result) })
      .catch(error => { if (active) setError(error instanceof Error ? error.message : "No se pudo cargar la solución") })
    return () => { active = false }
  }, [id, attempt])

  if (error) return (
    <Alert color="red" title="Error al cargar la solución" icon={<IconAlertCircle size={16} />}>
      <Stack gap="sm">
        <Text size="sm">{error}</Text>
        <Button variant="light" onClick={() => { setError(null); setAttempt(value => value + 1) }}>Reintentar</Button>
      </Stack>
    </Alert>
  )
  if (!solution) return <Center h={240}><Loader aria-label="Cargando solución" /></Center>
  return <SolutionDetail solution={solution} preview />
}

export function SolutionPreview({ solution, onClose }: { solution: Solution | null; onClose: () => void }) {
  const router = useRouter()

  return (
    <Drawer
      opened={solution !== null}
      onClose={onClose}
      position="right"
      size="min(900px, 100vw)"
      padding="md"
      closeOnClickOutside
      closeOnEscape
      closeButtonProps={{ "aria-label": "Cerrar vista previa" }}
      styles={{ title: { flex: 1, minWidth: 0 } }}
      title={
        <Group justify="space-between" wrap="nowrap" gap="sm">
          <Text fw={600} truncate>{solution?.name ?? "Vista previa"}</Text>
          <Group gap="xs" wrap="nowrap">
            <Tooltip label="Abrir página completa">
              <ActionIcon variant="subtle" aria-label="Abrir página completa" onClick={() => solution && router.push(`/solutions/${solution.id}`)}>
                <IconMaximize size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Editar solución">
              <ActionIcon variant="subtle" aria-label="Editar solución" onClick={() => solution && router.push(`/solutions/${solution.id}/edit`)}>
                <IconEdit size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      }
    >
      {solution && <PreviewContent key={solution.id} id={solution.id} />}
    </Drawer>
  )
}
