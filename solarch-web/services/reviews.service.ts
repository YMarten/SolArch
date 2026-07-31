import { api } from "@/lib/api"
import { ArchReview, CreateReviewDTO, UpdateReviewActionDTO } from "@/types/review"

export const reviewsService = {
  getBySolution: (solutionId: string) =>
    api.get<ArchReview[]>(`/api/reviews?solutionId=${solutionId}`),

  getById: (id: string) =>
    api.get<ArchReview>(`/api/reviews/${id}`),

  getPendingActions: () =>
    api.get<any[]>("/api/reviews/actions/pending"),

  create: (data: CreateReviewDTO) =>
    api.post<ArchReview>("/api/reviews", data),

  update: (id: string, data: Partial<CreateReviewDTO>) =>
    api.put<ArchReview>(`/api/reviews/${id}`, data),

  remove: (id: string) =>
    api.delete<null>(`/api/reviews/${id}`),

  updateAction: (actionId: string, data: UpdateReviewActionDTO) =>
    api.patch<any>(`/api/reviews/actions/${actionId}`, data),
}