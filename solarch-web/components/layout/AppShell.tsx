"use client"

import { AppShell as MantineAppShell } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { PageBreadcrumbs } from "./PageBreadcrumbs"

interface Props {
  children: React.ReactNode
}

export function AppShell({ children }: Props) {
  const [opened, { toggle }] = useDisclosure()

  return (
    <MantineAppShell
      className="solarch-shell"
      layout="alt"
      header={{ height: 60 }}
      navbar={{
        width:        256,
        breakpoint:   "sm",
        collapsed:    { mobile: !opened },
      }}
      padding={0}
    >
      <MantineAppShell.Header>
        <Header opened={opened} onToggleNavigation={toggle} />
      </MantineAppShell.Header>

      <MantineAppShell.Navbar>
        <Sidebar onNavigate={() => { if (opened) toggle() }} />
      </MantineAppShell.Navbar>

      <MantineAppShell.Main>
        <PageBreadcrumbs />
        {children}
      </MantineAppShell.Main>
    </MantineAppShell>
  )
}
