"use client"

import { NavLink, Stack, Text, Divider, Box } from "@mantine/core"
import {
  IconLayoutGrid, IconHierarchy, IconMap2,
  IconBuilding, IconCpu, IconSettings,
  IconChartBar
} from "@tabler/icons-react"
import { usePathname, useRouter } from "next/navigation"

const navItems = [
  {
    section: "Inventario",
    items: [
      { label: "Catálogo",    href: "/solutions",             icon: IconLayoutGrid },
      { label: "Ecosistema",  href: "/ecosystem",             icon: IconHierarchy  },
      { label: "Capacidades", href: "/capabilities",          icon: IconMap2       },
    ]
  },
  {
    section: "Arquitectura",
    items: [
      { label: "Revisiones",  href: "/reviews",               icon: IconChartBar   },
    ]
  },
  {
    section: "Catálogos",
    items: [
      { label: "Tecnologías", href: "/catalog/technologies",  icon: IconCpu        },
      { label: "Dominios",    href: "/catalog/domains",       icon: IconMap2       },
      { label: "Áreas",       href: "/catalog/areas",         icon: IconBuilding   },
      { label: "Capacidades", href: "/catalog/capabilities",  icon: IconBuilding   },
    ]
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router   = useRouter()

  return (
    <Box
      h="100%"
      style={{
        background: "var(--mantine-color-dark-8)",
        borderRight: "1px solid var(--mantine-color-dark-6)",
      }}
    >
      <Stack gap={0} h="100%">
        {/* Logo */}
        <Box px="md" py="lg">
          <Text fw={700} size="lg" c="white">SolArch</Text>
          <Text size="xs" c="dark.2">Arquitectura de soluciones</Text>
        </Box>

        <Divider color="dark.6" />

        {/* Nav items */}
        <Stack gap={0} pt="sm" style={{ flex: 1, overflowY: "auto" }}>
          {navItems.map(section => (
            <Stack key={section.section} gap={0} mb="sm">
              <Text
                size="xs"
                fw={600}
                px="md"
                py={6}
                c="dark.3"
                style={{ textTransform: "uppercase", letterSpacing: "0.06em" }}
              >
                {section.section}
              </Text>
              {section.items.map(item => {
                const isActive = pathname === item.href ||
                  pathname.startsWith(item.href + "/")
                return (
                  <NavLink
                    key={item.href}
                    label={item.label}
                    leftSection={<item.icon size={16} />}
                    active={isActive}
                    onClick={() => router.push(item.href)}
                    style={{ cursor: "pointer" }}
                    styles={{
                      root: {
                        color: isActive ? "white" : "var(--mantine-color-dark-1)",
                        background: isActive
                          ? "var(--mantine-color-blue-9)"
                          : "transparent",
                        borderRadius: "var(--mantine-radius-md)",
                        margin: "0 8px",
                        width: "calc(100% - 16px)",
                        "&:hover": {
                          background: "var(--mantine-color-dark-6)",
                        }
                      },
                      label: {
                        color: isActive ? "white" : "var(--mantine-color-dark-1)",
                      }
                    }}
                  />
                )
              })}
            </Stack>
          ))}
        </Stack>

        <Divider color="dark.6" />

        {/* Settings */}
        <NavLink
          label="Configuración"
          leftSection={<IconSettings size={16} />}
          onClick={() => router.push("/settings")}
          style={{ cursor: "pointer" }}
          styles={{
            root: {
              color: "var(--mantine-color-dark-1)",
              margin: "8px",
              borderRadius: "var(--mantine-radius-md)",
            }
          }}
        />
      </Stack>
    </Box>
  )
}