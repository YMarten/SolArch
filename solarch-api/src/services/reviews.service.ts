import { prisma } from "../prisma"
import { CreateReviewDTO, UpdateReviewDTO, UpdateReviewActionDTO } from "../types/review.types"

export const reviewsService = {
  async findBySolution(solutionId: string) {
    return prisma.archReview.findMany({
      where: { solutionId },
      include: {
        dimensions: true,
        actions: true
      },
      orderBy: { reviewedAt: "desc" }
    })
  },

  async findById(id: string) {
    return prisma.archReview.findUnique({
      where: { id },
      include: {
        dimensions: true,
        actions: true,
        solution: true
      }
    })
  },

  async create(data: CreateReviewDTO) {
    const { solutionId, dimensions, actions, ...reviewData } = data

    return prisma.archReview.create({
      data: {
        ...reviewData,
        solution: { connect: { id: solutionId } },
        dimensions: dimensions ? {
          create: dimensions
        } : undefined,
        actions: actions ? {
          create: actions
        } : undefined,
      },
      include: {
        dimensions: true,
        actions: true
      }
    })
  },

  async update(id: string, data: UpdateReviewDTO) {
    return prisma.archReview.update({
      where: { id },
      data,
      include: {
        dimensions: true,
        actions: true
      }
    })
  },

  async remove(id: string) {
    return prisma.archReview.delete({
      where: { id }
    })
  },

  // Actualizar estado de una acción de remediación
  async updateAction(actionId: string, data: UpdateReviewActionDTO) {
    return prisma.reviewAction.update({
      where: { id: actionId },
      data
    })
  },

  // Obtener todas las acciones pendientes o vencidas
  async findPendingActions() {
    return prisma.reviewAction.findMany({
      where: {
        status: { in: ["PENDING", "IN_PROGRESS"] }
      },
      include: {
        review: {
          include: { solution: true }
        }
      },
      orderBy: { dueDate: "asc" }
    })
  }
}