"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewsService = void 0;
const prisma_1 = require("../prisma");
exports.reviewsService = {
    async findBySolution(solutionId) {
        return prisma_1.prisma.archReview.findMany({
            where: { solutionId },
            include: {
                dimensions: true,
                actions: true
            },
            orderBy: { reviewedAt: "desc" }
        });
    },
    async findById(id) {
        return prisma_1.prisma.archReview.findUnique({
            where: { id },
            include: {
                dimensions: true,
                actions: true,
                solution: true
            }
        });
    },
    async create(data) {
        const { solutionId, dimensions, actions, ...reviewData } = data;
        return prisma_1.prisma.archReview.create({
            data: {
                ...reviewData,
                reviewedAt: new Date(reviewData.reviewedAt),
                nextReviewDate: reviewData.nextReviewDate
                    ? new Date(reviewData.nextReviewDate)
                    : undefined,
                solution: { connect: { id: solutionId } },
                dimensions: dimensions ? { create: dimensions } : undefined,
                actions: actions ? {
                    create: actions.map(a => ({
                        ...a,
                        dueDate: a.dueDate ? new Date(a.dueDate) : undefined,
                    }))
                } : undefined,
            },
            include: {
                dimensions: true,
                actions: true
            }
        });
    },
    async update(id, data) {
        return prisma_1.prisma.archReview.update({
            where: { id },
            data,
            include: {
                dimensions: true,
                actions: true
            }
        });
    },
    async remove(id) {
        return prisma_1.prisma.archReview.delete({
            where: { id }
        });
    },
    // Actualizar estado de una acción de remediación
    async updateAction(actionId, data) {
        return prisma_1.prisma.reviewAction.update({
            where: { id: actionId },
            data
        });
    },
    // Obtener todas las acciones pendientes o vencidas
    async findPendingActions() {
        return prisma_1.prisma.reviewAction.findMany({
            where: {
                status: { in: ["PENDING", "IN_PROGRESS"] }
            },
            include: {
                review: {
                    include: { solution: true }
                }
            },
            orderBy: { dueDate: "asc" }
        });
    }
};
