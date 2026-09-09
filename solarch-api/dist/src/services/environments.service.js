"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environmentsService = void 0;
const prisma_1 = require("../prisma");
exports.environmentsService = {
    async findBySolution(solutionId) {
        return prisma_1.prisma.environment.findMany({
            where: { solutionId },
            orderBy: { name: "asc" }
        });
    },
    async findById(id) {
        return prisma_1.prisma.environment.findUnique({
            where: { id }
        });
    },
    async create(data) {
        return prisma_1.prisma.environment.create({ data });
    },
    async update(id, data) {
        return prisma_1.prisma.environment.update({
            where: { id },
            data
        });
    },
    async remove(id) {
        return prisma_1.prisma.environment.delete({
            where: { id }
        });
    }
};
