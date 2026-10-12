"use client"

import { useMounted } from "@mantine/hooks"
import {
  Group, Text, ActionIcon,
  useMantineColorScheme, useComputedColorScheme, Avatar, Menu, UnstyledButton, Burger, TextInput
} from "@mantine/core"
import {
  IconSun, IconMoon, IconUser,
  IconSettings, IconLogout, IconSearch
} from "@tabler/icons-react"

// Usuario hardcodeado por ahora — en Fase 2 vendrá de la sesión de Auth.js
const CURRENT_USER = {
  name:   "Arquitecto",
  email:  "arquitecto@empresa.com",
  initials: "AR",
}

export function Header({ opened, onToggleNavigation }: { opened: boolean; onToggleNavigation: () => void }) {
  const { toggleColorScheme } = useMantineColorScheme()
  const colorScheme = useComputedColorScheme("dark", { getInitialValueInEffect: true })
  const mounted = useMounted()
  // The saved preference is only available in the browser. Keep the server
  // and first client render identical, then reflect it after hydration.
  const isDark = !mounted || colorScheme === "dark"
  const themeAction = isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"

  return (
    <Group h="100%" px="lg" justify="space-between" wrap="nowrap" className="workspace-header">
      <Group wrap="nowrap" gap="sm" style={{ minWidth: 0 }}>
      <Burger opened={opened} onClick={onToggleNavigation} hiddenFrom="sm" size="sm" aria-label="Abrir o cerrar navegación" />
      <TextInput className="header-search-placeholder" size="xs" disabled aria-label="Búsqueda global, próximamente" placeholder="Buscar en SolArch · Próximamente" leftSection={<IconSearch size={15} />} />
      </Group>
      <Group gap="sm">
        <ActionIcon
          variant="subtle"
          onClick={toggleColorScheme}
          title={themeAction}
          aria-label={themeAction}
        >
          {isDark ? <IconSun size={18} /> : <IconMoon size={18} />}
        </ActionIcon>

        <Menu shadow="md" width={200} position="bottom-end">
          <Menu.Target>
            <UnstyledButton type="button" aria-label="Menú de usuario">
            <Group gap="xs" component="span">
              <Avatar
                component="span"
                size="sm"
                radius="xl"
                color="blue"
                variant="filled"
              >
                {CURRENT_USER.initials}
              </Avatar>
              <Text component="span" size="sm" visibleFrom="sm">
                {CURRENT_USER.name}
              </Text>
            </Group>
            </UnstyledButton>
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
