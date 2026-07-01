import { api } from "@/lib/api"
import { Solution, CreateSolutionDTO, UpdateSolutionDTO } from "@/types/solution"

export const solutionsService = {
  getAll: () =>
    api.get<Solution[]>("/api/solutions"),

  getById: (id: string) =>
    api.get<Solution>(`/api/solutions/${id}`),

  create: (data: CreateSolutionDTO) =>
    api.post<Solution>("/api/solutions", data),

  update: (id: string, data: UpdateSolutionDTO) =>
    api.put<Solution>(`/api/solutions/${id}`, data),

  remove: (id: string) =>
    api.delete<null>(`/api/solutions/${id}`),
}

