"use client"

import { Modal, TextInput, Textarea, Select, Button, Stack, Group } from "@mantine/core"
import { useForm } from "@mantine/form"
import { useEffect } from "react"

interface Field {
  key: string
  label: string
  type: "text" | "textarea" | "select"
  required?: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
}

interface Props {
  opened: boolean
  onClose: () => void
  onSubmit: (values: Record<string, string>) => Promise<void>
  title: string
  fields: Field[]
  initialValues?: Record<string, string>
  loading?: boolean
}

export function CatalogModal({
  opened, onClose, onSubmit, title, fields, initialValues, loading
}: Props) {
  const form = useForm<Record<string, string>>({
    initialValues: initialValues ?? fields.reduce((acc, f) => ({ ...acc, [f.key]: "" }), {}),
  })

    useEffect(() => {
    if (opened && initialValues) {
      form.setValues(initialValues)
    } else if (opened) {
      form.reset()
    }
  }, [opened])

  const handleSubmit = async (values: Record<string, string>) => {
    await onSubmit(values)
    form.reset()
  }

  return (
    <Modal opened={opened} onClose={onClose} title={title} centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="sm">
          {fields.map(f => {
            if (f.type === "select") {
              return (
                <Select
                  key={f.key}
                  label={f.label}
                  placeholder={f.placeholder}
                  required={f.required}
                  data={f.options ?? []}
                  {...form.getInputProps(f.key)}
                />
              )
            }
            if (f.type === "textarea") {
              return (
                <Textarea
                  key={f.key}
                  label={f.label}
                  placeholder={f.placeholder}
                  {...form.getInputProps(f.key)}
                />
              )
            }
            return (
              <TextInput
                key={f.key}
                label={f.label}
                placeholder={f.placeholder}
                required={f.required}
                {...form.getInputProps(f.key)}
              />
            )
          })}
          <Group justify="flex-end" mt="sm">
            <Button type="button" variant="default" onClick={onClose}>Cancelar</Button>
            <Button type="submit" loading={loading}>Guardar</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}