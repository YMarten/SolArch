"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachmentsService = void 0;
const prisma_1 = require("../prisma");
exports.attachmentsService = {
    async findBySolution(solutionId) {
        return prisma_1.prisma.attachment.findMany({
            where: { solutionId },
            orderBy: { createdAt: "desc" }
        });
    },
    async findById(id) {
        return prisma_1.prisma.attachment.findUnique({
            where: { id }
        });
    },
    async create(data) {
        return prisma_1.prisma.attachment.create({ data });
    },
    async update(id, data) {
        return prisma_1.prisma.attachment.update({
            where: { id },
            data
        });
    },
    async remove(id) {
        return prisma_1.prisma.attachment.delete({
            where: { id }
        });
    }
};
