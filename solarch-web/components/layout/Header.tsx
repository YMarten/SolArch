"use client"

import {
  Group, Text, Breadcrumbs, Anchor, ActionIcon,
  useMantineColorScheme, Avatar, Menu
} from "@mantine/core"
import {
  IconSun, IconMoon, IconUser,
  IconSettings, IconLogout
} from "@tabler/icons-react"
import { usePathname } from "next/navigation"

const breadcrumbLabels: Record<string, string> = {
  solutions:    "Catálogo",
  new:          "Nueva solución",
  edit:         "Editar",
  ecosystem:    "Ecosistema",
  reviews:      "Revisiones",
  catalog:      "Catálogos",
  technologies: "Tecnologías",
  domains:      "Dominios",
  areas:        "Áreas",
  capabilities: "Capacidades",
}

// Usuario hardcodeado por ahora — en Fase 2 vendrá de la sesión de Auth.js
const CURRENT_USER = {
  name:   "Arquitecto",
  email:  "arquitecto@empresa.com",
  initials: "AR",
}

export function Header() {
  const pathname                            = usePathname()
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()

  const segments = pathname
    .split("/")
    .filter(Boolean)
    .filter(s => !s.match(/^[a-z0-9]{20,}$/i))

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

      <Group gap="sm">
        <ActionIcon
          variant="subtle"
          onClick={toggleColorScheme}
          title="Cambiar modo"
        >
          {colorScheme === "dark"
            ? <IconSun size={18} />
            : <IconMoon size={18} />
          }
        </ActionIcon>

        <Menu shadow="md" width={200} position="bottom-end">
          <Menu.Target>
            <Group gap="xs" style={{ cursor: "pointer" }}>
              <Avatar
                size="sm"
                radius="xl"
                color="blue"
                variant="filled"
              >
                {CURRENT_USER.initials}
              </Avatar>
              <Text size="sm" visibleFrom="sm">
                {CURRENT_USER.name}
              </Text>
            </Group>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>{CURRENT_USER.email}</Menu.Label>
            <Menu.Divider />
            <Menu.Item leftSection={<IconUser size={14} />}>
              Perfil
            </Menu.Item>
            <Menu.Item leftSection={<IconSettings size={14} />}>
              Configuración
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              color="red"
              leftSection={<IconLogout size={14} />}
            >
              Cerrar sesión
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  )
}