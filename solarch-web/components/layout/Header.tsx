"use client"

import { Group, Text, Breadcrumbs, Anchor } from "@mantine/core"
import { usePathname } from "next/navigation"

const breadcrumbLabels: Record<string, string> = {
  solutions:      "Catálogo",
  new:            "Nueva solución",
  edit:           "Editar",
  ecosystem:      "Ecosistema",
  reviews:        "Revisiones",
  catalog:        "Catálogos",
  technologies:   "Tecnologías",
  domains:        "Dominios",
  areas:          "Áreas",
  capabilities:   "Capacidades",
}

export function Header() {
  const pathname = usePathname()

  const segments = pathname
    .split("/")
    .filter(Boolean)
    .filter(s => !s.match(/^[a-z0-9]{20,}$/i)) // filtra IDs

  const crumbs = segments.map((seg, i) => ({
    label: breadcrumbLabels[seg] ?? seg,
    href:  "/" + segments.slice(0, i + 1).join("/"),
  }))

  return (
    <Group h="100%" px="md" justify="space-between">
      <Breadcrumbs>
        <Anchor href="/" size="sm">Inicio</Anchor>
        {crumbs.map((c, i) =>
          i === crumbs.length - 1
            ? <Text key={c.href} size="sm">{c.label}</Text>
            : <Anchor key={c.href} href={c.href} size="sm">{c.label}</Anchor>
        )}
      </Breadcrumbs>
    </Group>
  )
}