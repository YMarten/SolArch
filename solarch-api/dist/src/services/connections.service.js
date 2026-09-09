"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionsService = void 0;
const prisma_1 = require("../prisma");
exports.connectionsService = {
    async findBySolution(solutionId) {
        return prisma_1.prisma.connection.findMany({
            where: {
                OR: [
                    { fromId: solutionId },
                    { toId: solutionId }
                ]
            },
            include: {
                from: true,
                to: true
            }
        });
    },
    async findById(id) {
        return prisma_1.prisma.connection.findUnique({
            where: { id },
            include: {
                from: true,
                to: true
            }
        });
    },
    async create(data) {
        return prisma_1.prisma.connection.create({
            data,
            include: {
                from: true,
                to: true
            }
        });
    },
    async update(id, data) {
        return prisma_1.prisma.connection.update({
            where: { id },
            data,
            include: {
                from: true,
                to: true
            }
        });
    },
    async remove(id) {
        return prisma_1.prisma.connection.delete({
            where: { id }
        });
    }
};
