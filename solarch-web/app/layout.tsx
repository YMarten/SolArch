import type { Metadata } from "next"
import "@mantine/core/styles.css"
import "@mantine/notifications/styles.css"
import "@mantine/dates/styles.css"
import "./globals.css"
import { MantineProvider, ColorSchemeScript } from "@mantine/core"
import { Notifications } from "@mantine/notifications"
import { AppShell } from "@/components/layout/AppShell"

export const metadata: Metadata = {
  title: "SolArch",
  description: "Gestión de arquitectura de soluciones",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <Notifications />
          <AppShell>
            {children}
          </AppShell>
        </MantineProvider>
      </body>
    </html>
  )
}