import { api } from "@/lib/api"
import { Domain, CreateDomainDTO } from "@/types/domain"

export const domainsService = {
  getAll: () =>
    api.get<Domain[]>("/api/domains"),

  getById: (id: string) =>
    api.get<Domain>(`/api/domains/${id}`),

  create: (data: CreateDomainDTO) =>
    api.post<Domain>("/api/domains", data),

  update: (id: string, data: Partial<CreateDomainDTO>) =>
    api.put<Domain>(`/api/domains/${id}`, data),

  remove: (id: string) =>
    api.delete<null>(`/api/domains/${id}`),
}