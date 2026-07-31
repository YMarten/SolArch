"use client"

import { NavLink, Stack, Text, Divider } from "@mantine/core"
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
      { label: "Catálogo",    href: "/solutions",     icon: IconLayoutGrid  },
      { label: "Ecosistema",  href: "/ecosystem",     icon: IconHierarchy   },
      { label: "Capacidades", href: "/capabilities",  icon: IconMap2        },
    ]
  },
  {
    section: "Arquitectura",
    items: [
      { label: "Revisiones",  href: "/reviews",       icon: IconChartBar    },
    ]
  },
  {
    section: "Catálogos",
    items: [
      { label: "Tecnologías", href: "/catalog/technologies",  icon: IconCpu      },
      { label: "Dominios",    href: "/catalog/domains",       icon: IconMap2     },
      { label: "Áreas",       href: "/catalog/areas",         icon: IconBuilding },
      { label: "Capacidades", href: "/catalog/capabilities",  icon: IconBuilding },
    ]
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router   = useRouter()

  return (
    <Stack gap={0} pt="md">
      <Stack px="md" pb="md" gap={4}>
        <Text fw={600} size="lg">SolArch</Text>
        <Text size="xs" c="dimmed">Arquitectura de soluciones</Text>
      </Stack>

      <Divider />

      <Stack gap={0} pt="sm">
        {navItems.map(section => (
          <Stack key={section.section} gap={0} mb="sm">
            <Text
              size="xs"
              fw={500}
              c="dimmed"
              px="md"
              py={6}
              style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
            >
              {section.section}
            </Text>
            {section.items.map(item => (
              <NavLink
                key={item.href}
                label={item.label}
                leftSection={<item.icon size={16} />}
                active={pathname === item.href || pathname.startsWith(item.href + "/")}
                onClick={() => router.push(item.href)}
                style={{ cursor: "pointer" }}
              />
            ))}
          </Stack>
        ))}
      </Stack>

      <Divider mt="auto" />
      <NavLink
        label="Configuración"
        leftSection={<IconSettings size={16} />}
        onClick={() => router.push("/settings")}
        style={{ cursor: "pointer" }}
      />
    </Stack>
  )
}