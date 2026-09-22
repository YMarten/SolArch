"use client"

import { useState } from "react"
import { Alert, Button, Stack, Textarea, TextInput } from "@mantine/core"
import { GroupInput } from "@/types/group"

export function GroupForm({ initial, onSave }: { initial?: GroupInput; onSave: (data: GroupInput) => Promise<void> }) {
  const [name, setName] = useState(initial?.name ?? "")
  const [description, setDescription] = useState(initial?.description ?? "")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  return <form onSubmit={async event => {
    event.preventDefault()
    if (!name.trim() || busy) return
    setBusy(true); setError(null)
    try { await onSave({ name: name.trim(), description: description.trim() || null }) }
    catch (e) { setError(e instanceof Error ? e.message : "No se pudo guardar el grupo") }
    finally { setBusy(false) }
  }}><Stack>
    {error && <Alert color="red">{error}</Alert>}
    <TextInput label="Nombre del grupo" placeholder="Apps proyecto X" required maxLength={200} value={name} onChange={e => setName(e.currentTarget.value)} disabled={busy} />
    <Textarea label="Descripción" autosize minRows={3} maxLength={10000} value={description} onChange={e => setDescription(e.currentTarget.value)} disabled={busy} />
    <Button type="submit" loading={busy} disabled={!name.trim()}>Guardar grupo</Button>
  </Stack></form>
}
