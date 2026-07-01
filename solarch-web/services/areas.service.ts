import { api } from "@/lib/api"
import { Area, CreateAreaDTO } from "@/types/area"

export const areasService = {
  getAll: () =>
    api.get<Area[]>("/api/areas"),

  getById: (id: string) =>
    api.get<Area>(`/api/areas/${id}`),

  create: (data: CreateAreaDTO) =>
    api.post<Area>("/api/areas", data),

  update: (id: string, data: Partial<CreateAreaDTO>) =>
    api.put<Area>(`/api/areas/${id}`, data),

  remove: (id: string) =>
    api.delete<null>(`/api/areas/${id}`),
}