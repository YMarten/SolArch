import { api } from "@/lib/api"
import { Capability, CreateCapabilityDTO } from "@/types/capability"

export const capabilitiesService = {
  getAll: () =>
    api.get<Capability[]>("/api/capabilities"),

  getById: (id: string) =>
    api.get<Capability>(`/api/capabilities/${id}`),

  create: (data: CreateCapabilityDTO) =>
    api.post<Capability>("/api/capabilities", data),

  update: (id: string, data: Partial<CreateCapabilityDTO>) =>
    api.put<Capability>(`/api/capabilities/${id}`, data),

  remove: (id: string) =>
    api.delete<null>(`/api/capabilities/${id}`),
}