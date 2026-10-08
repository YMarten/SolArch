"use client"

import { useState } from "react"
import { Alert, Button, Group, Paper, Stack, Text, Textarea, Title } from "@mantine/core"
import { IconCopy, IconDownload, IconRefresh } from "@tabler/icons-react"
import { exportService } from "@/services/export.service"

interface GeneratedExport {
  json: string
  filename: string
  generatedAt: string
  solutions: number
}

export default function SettingsPage() {
  const [result, setResult] = useState<GeneratedExport | null>(null)
  const [generating, setGenerating] = useState(false)
  const [copying, setCopying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function generate() {
    setGenerating(true)
    setError(null)
    setCopied(false)
    setResult(null)
    try {
      const data = await exportService.generate()
      setResult({
        json: JSON.stringify(data, null, 2),
        filename: `solarch-inventario-${data.exportedAt.replace(/[:.]/g, "-")}.json`,
        generatedAt: data.exportedAt,
        solutions: data.solutions.length,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo generar el JSON")
    } finally {
      setGenerating(false)
    }
  }

  async function copy() {
    if (!result) return
    setCopying(true)
    setError(null)
    setCopied(false)
    try {
      await navigator.clipboard.writeText(result.json)
      setCopied(true)
    } catch {
      setError("No se pudo acceder al portapapeles. Puedes seleccionar y copiar el texto de la vista previa o descargar el archivo.")
    } finally {
      setCopying(false)
    }
  }

  function download() {
    if (!result) return
    setError(null)
    try {
      const url = URL.createObjectURL(new Blob([result.json], { type: "application/json;charset=utf-8" }))
      const link = document.createElement("a")
      link.href = url
      link.download = result.filename
      document.body.appendChild(link)
      try { link.click() } finally {
        link.remove()
        window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      }
    } catch {
      setError("No se pudo descargar el archivo. Intenta nuevamente o copia el JSON.")
    }
  }

  return <Stack p="xl" gap="lg">
    <Title order={2}>Configuración</Title>
    <Paper withBorder radius="md" p="lg">
      <Stack>
        <Title order={3}>Exportar datos en JSON</Title>
        <Text size="sm" c="dimmed">
          Genera un archivo con todo el inventario: soluciones y su levantamiento, tecnologías,
          dominios, capacidades, áreas, ambientes, adjuntos, conexiones, revisiones con sus
          dimensiones y acciones, historial de cambios y grupos con su participación.
          Incluye también los catálogos sin asignar y el estado, origen, destino e intermediario de cada conexión.
        </Text>
        <Text size="sm">Los adjuntos se incluyen como enlaces registrados. Copiar y descargar utilizan la misma versión generada; vuelve a generar el JSON para incluir cambios recientes.</Text>
        <Group>
          <Button leftSection={<IconRefresh size={16} />} loading={generating} disabled={copying} onClick={() => void generate()}>
            {result ? "Volver a generar JSON" : "Generar JSON"}
          </Button>
          <Button variant="light" leftSection={<IconCopy size={16} />} disabled={!result || generating} loading={copying} onClick={() => void copy()}>Copiar JSON</Button>
          <Button variant="light" leftSection={<IconDownload size={16} />} disabled={!result || generating} onClick={download}>Descargar JSON</Button>
        </Group>
        {error && <Alert color="red" role="alert">{error}</Alert>}
        {copied && <Text c="green" size="sm" role="status">JSON copiado al portapapeles.</Text>}
        {result && <>
          <Text size="sm" c="dimmed" role="status">Generado el {new Date(result.generatedAt).toLocaleString("es")} · {result.solutions} soluciones</Text>
          <Textarea label="Vista previa del JSON" value={result.json} readOnly rows={18} spellCheck={false} styles={{ input: { fontFamily: "monospace", fontSize: 12 } }} />
        </>}
      </Stack>
    </Paper>
  </Stack>
}
