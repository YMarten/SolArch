import { api } from "@/lib/api"

export interface Connection {
  id: string
  type: string
  isActive: boolean
  description?: string | null
  from: { id: string; name: string }
  to: { id: string; name: string }
}

interface ConnectionInput {
  isActive?: boolean
  fromId: string
  toId: string
  type: string
  description: string
}

export const connectionsService = {
  getBySolution: (id: string) => api.get<Connection[]>(`/api/connections?solutionId=${encodeURIComponent(id)}`),
  create: (data: ConnectionInput) => api.post<Connection>("/api/connections", data),
  update: (id: string, data: ConnectionInput) => api.put<Connection>(`/api/connections/${id}`, data),
  remove: (id: string) => api.delete<null>(`/api/connections/${id}`),
}
