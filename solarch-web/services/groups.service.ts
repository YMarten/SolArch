import { api } from "@/lib/api"
import { GroupInput, SolutionGroup, SolutionParticipation } from "@/types/group"

export const groupsService = {
  getAll: (solutionId?: string) => api.get<SolutionGroup[]>(`/api/groups${solutionId ? `?solutionId=${encodeURIComponent(solutionId)}` : ""}`),
  getById: (id: string) => api.get<SolutionGroup>(`/api/groups/${id}`),
  create: (data: GroupInput) => api.post<SolutionGroup>("/api/groups", data),
  update: (id: string, data: GroupInput) => api.put<SolutionGroup>(`/api/groups/${id}`, data),
  remove: (id: string) => api.delete<null>(`/api/groups/${id}`),
  setMember: (id: string, solutionId: string, participation: SolutionParticipation) => api.put(`/api/groups/${id}/members/${solutionId}`, { participation }),
  removeMember: (id: string, solutionId: string) => api.delete<null>(`/api/groups/${id}/members/${solutionId}`),
}
