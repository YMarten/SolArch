import { api } from "@/lib/api"
import { Technology, CreateTechnologyDTO } from "@/types/technology"

export const technologiesService = {
  getAll: () =>
    api.get<Technology[]>("/api/technologies"),

  getById: (id: string) =>
    api.get<Technology>(`/api/technologies/${id}`),

  create: (data: CreateTechnologyDTO) =>
    api.post<Technology>("/api/technologies", data),

  update: (id: string, data: Partial<CreateTechnologyDTO>) =>
    api.put<Technology>(`/api/technologies/${id}`, data),

  remove: (id: string) =>
    api.delete<null>(`/api/technologies/${id}`),
}