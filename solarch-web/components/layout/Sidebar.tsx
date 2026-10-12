"use client"

import { NavLink, Stack, Text, Divider, Box } from "@mantine/core"
import {
  IconLayoutGrid, IconHierarchy, IconMap2,
  IconBuilding, IconCpu, IconSettings,
  IconChartBar, IconStack2
} from "@tabler/icons-react"
import { usePathname, useRouter } from "next/navigation"

const navItems = [
  {
    section: "Inventario",
    items: [
      { label: "Catálogo",    href: "/solutions",             icon: IconLayoutGrid },
      { label: "Grupos",      href: "/groups",                icon: IconLayoutGrid },
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

export function Sidebar({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname()
  const router   = useRouter()

  return (
    <Box h="100%" className="workspace-sidebar">
      <Stack gap={0} h="100%">
        {/* Logo */}
        <Box px="lg" py="xl" className="workspace-brand">
          <span className="workspace-brand-icon"><IconStack2 size={22} /></span>
          <div><Text fw={700} size="md">SolArch</Text>
          <Text size="xs" c="dimmed">Arquitectura de soluciones</Text></div>
        </Box>

        <Divider />

        {/* Nav items */}
        <Stack gap={0} pt="sm" style={{ flex: 1, overflowY: "auto" }}>
          {navItems.map(section => (
            <Stack key={section.section} gap={0} mb="sm">
              <Text
                size="xs"
                fw={600}
                px="md"
                py={6}
                c="dimmed"
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
                    onClick={() => { router.push(item.href); onNavigate() }}
                    style={{ cursor: "pointer" }}
                    className="workspace-nav-link"
                  />
                )
              })}
            </Stack>
          ))}
        </Stack>

        <Divider />

        {/* Settings */}
        <NavLink
          label="Configuración"
          leftSection={<IconSettings size={16} />}
          active={pathname === "/settings"}
          onClick={() => { router.push("/settings"); onNavigate() }}
          style={{ cursor: "pointer" }}
          className="workspace-nav-link workspace-settings"
        />
      </Stack>
    </Box>
  )
}
