"use client"

import { Anchor, Badge, Group, Paper, SimpleGrid, Stack, Text, Title } from "@mantine/core"
import { Solution } from "@/types/solution"

const labels: Record<string, string> = {
  IN_USE: "En uso", LIMITED_USE: "Uso limitado", IN_IMPLEMENTATION: "En implementación",
  IN_SUBSTITUTION: "En sustitución", OUT_OF_USE: "Fuera de uso", CONTINUOUS: "Continua",
  DAILY: "Diaria", WEEKLY: "Semanal", MONTHLY: "Mensual", OCCASIONAL: "Ocasional",
  YES: "Sí", NO: "No", UNKNOWN: "No determinado", CLOUD: "Nube",
  INTERNAL_INFRASTRUCTURE: "Infraestructura interna", VENDOR_INFRASTRUCTURE: "Infraestructura del proveedor",
  HYBRID: "Híbrida", HIGH: "Alto", MEDIUM: "Medio", LOW: "Bajo",
}

function Value({ label, value }: { label: string; value?: string | null }) {
  return <div><Text size="xs" c="dimmed">{label}</Text><Text size="sm">{value ? labels[value] ?? value : "No registrado"}</Text></div>
}

export function SolutionSurveyDetails({ solution }: { solution: Solution }) {
  return <Stack gap="md">
    <Paper withBorder p="md"><Title order={5} mb="md">Uso y responsabilidad</Title><SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
      <Value label="Área responsable" value={solution.responsibleArea?.name} /><Value label="Contacto principal" value={solution.owner} />
      <Value label="Responsable técnico" value={solution.techOwner} /><Value label="Proceso soportado" value={solution.businessProcess} />
      <Value label="Estado actual" value={solution.usageStatus} /><Value label="Frecuencia" value={solution.usageFrequency} />
    </SimpleGrid>{solution.userGroups?.length > 0 && <Group mt="md" gap="xs"><Text size="xs" c="dimmed">Grupos usuarios:</Text>{solution.userGroups.map(g => <Badge key={g} variant="light">{g}</Badge>)}</Group>}
      {solution.similarSolution && <Text size="sm" mt="md">Solución similar: <Anchor href={`/solutions/${solution.similarSolution.id}`}>{solution.similarSolution.name}</Anchor></Text>}
    </Paper>
    <Paper withBorder p="md"><Title order={5} mb="md">Proveedor y soporte</Title><SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
      <Value label="Proveedor" value={solution.vendor} /><Value label="Soporte vigente" value={solution.supportStatus} />
      <Value label="Recibe actualizaciones" value={solution.receivesUpdates} /><Value label="Licenciamiento vigente" value={solution.licenseStatus} />
    </SimpleGrid></Paper>
    <Paper withBorder p="md"><Title order={5} mb="md">Tecnología y dependencias</Title><SimpleGrid cols={{ base: 1, sm: 2 }}>
      <Value label="Alojamiento" value={solution.hostingMode} /><Value label="Impacto de una falla" value={solution.failureImpact} />
      <Value label="Dependencias conocidas" value={solution.knownDependencies} /><Value label="Detalle del impacto" value={solution.failureImpactDetails} />
    </SimpleGrid></Paper>
    <Paper withBorder p="md"><Title order={5} mb="md">Situación actual</Title><Stack gap="sm">
      <Value label="Tiene problemas o limitaciones" value={solution.hasProblems ? "YES" : "NO"} />
      {solution.hasProblems && <Value label="Detalle de los problemas" value={solution.problemDetails} />}
      <Value label="Tiene iniciativa de sustitución o retiro" value={solution.hasReplacementInitiative ? "YES" : "NO"} />
      {solution.replacementSolution && <Text size="sm">Solución sustituta: <Anchor href={`/solutions/${solution.replacementSolution.id}`}>{solution.replacementSolution.name}</Anchor></Text>}
      {!solution.replacementSolution && solution.proposedReplacementName && <Value label="Sustituta propuesta" value={solution.proposedReplacementName} />}
      <Value label="Observaciones adicionales" value={solution.additionalNotes} />
    </Stack></Paper>
  </Stack>
}
