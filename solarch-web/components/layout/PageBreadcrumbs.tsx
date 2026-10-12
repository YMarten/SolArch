"use client"

import { Anchor, Breadcrumbs, Text } from "@mantine/core"
import { usePathname } from "next/navigation"

const labels: Record<string, string> = {
  settings: "Configuración", groups: "Grupos", solutions: "Catálogo",
  new: "Nuevo registro", edit: "Editar", ecosystem: "Ecosistema",
  reviews: "Revisiones", catalog: "Catálogos", technologies: "Tecnologías",
  domains: "Dominios", areas: "Áreas", capabilities: "Capacidades",
}

export function PageBreadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)
  const crumbs = segments.flatMap((segment, index) => {
    if (!labels[segment]) return []
    const label = segment === "new" && segments[0] === "solutions"
      ? segments.includes("reviews") ? "Nueva revisión" : "Nueva solución"
      : labels[segment]
    return [{ label, href: "/" + segments.slice(0, index + 1).join("/") }]
  })

  if (!crumbs.length) return null

  return <nav aria-label="Ruta de navegación" className="page-breadcrumbs">
    <Breadcrumbs>
      <Anchor href="/" size="xs">Inicio</Anchor>
      {crumbs.map((crumb, index) => index === crumbs.length - 1
        ? <Text key={crumb.href} size="xs" c="dimmed" aria-current="page">{crumb.label}</Text>
        : <Anchor key={crumb.href} href={crumb.href} size="xs">{crumb.label}</Anchor>)}
    </Breadcrumbs>
  </nav>
}
