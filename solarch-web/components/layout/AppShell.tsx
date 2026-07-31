"use client"

import { AppShell as MantineAppShell } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"

interface Props {
  children: React.ReactNode
}

export function AppShell({ children }: Props) {
  const [opened, { toggle }] = useDisclosure()

  return (
    <MantineAppShell
      header={{ height: 48 }}
      navbar={{
        width:        220,
        breakpoint:   "sm",
        collapsed:    { mobile: !opened },
      }}
      padding="md"
    >
      <MantineAppShell.Header>
        <Header />
      </MantineAppShell.Header>

      <MantineAppShell.Navbar>
        <Sidebar />
      </MantineAppShell.Navbar>

      <MantineAppShell.Main>
        {children}
      </MantineAppShell.Main>
    </MantineAppShell>
  )
}