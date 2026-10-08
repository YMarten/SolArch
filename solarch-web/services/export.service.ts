import { api } from "@/lib/api"

interface ExportedConnection extends Record<string, unknown> {
  id: string
  fromId: string
  toId: string
  isActive: boolean
  intermediarySolutionId: string | null
  from: { id: string; name: string }
  to: { id: string; name: string }
  intermediarySolution: { id: string; name: string } | null
}

export interface InventoryExport {
  schemaVersion: string
  application: string
  exportedAt: string
  solutions: Record<string, unknown>[]
  connections: ExportedConnection[]
  groups: Record<string, unknown>[]
  catalogs: Record<string, Record<string, unknown>[]>
}

export const exportService = {
  generate: () => api.get<InventoryExport>("/api/export"),
}
