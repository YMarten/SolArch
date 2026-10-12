import type { Metadata } from "next"
import "@mantine/core/styles.css"
import "@mantine/notifications/styles.css"
import "@mantine/dates/styles.css"
import "./globals.css"
import { MantineProvider, createTheme } from "@mantine/core"
import { Notifications } from "@mantine/notifications"
import { AppShell } from "@/components/layout/AppShell"

const theme = createTheme({
  primaryColor: "blue",
  defaultRadius: "md",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  headings: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', fontWeight: "650" },
  colors: {
    blue: ["#edf5ff", "#d9eaff", "#b3d3ff", "#85b8ff", "#569cff", "#2b85ff", "#007aff", "#0068dc", "#0058bc", "#004a9f"],
  },
})

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
    <html lang="es" data-mantine-color-scheme="dark" suppressHydrationWarning>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <Notifications />
          <AppShell>
            {children}
          </AppShell>
        </MantineProvider>
      </body>
    </html>
  )
}
