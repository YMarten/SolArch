"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionsService = void 0;
const prisma_1 = require("../prisma");
function validateIntermediary(fromId, toId, intermediarySolutionId) {
    if (intermediarySolutionId && (intermediarySolutionId === fromId || intermediarySolutionId === toId)) {
        throw Object.assign(new Error("El intermediario debe ser distinto del origen y del destino"), { statusCode: 400 });
    }
}
exports.connectionsService = {
    async findBySolution(solutionId) {
        return prisma_1.prisma.connection.findMany({
            where: {
                OR: [
                    { fromId: solutionId },
                    { toId: solutionId },
                    { intermediarySolutionId: solutionId }
                ]
            },
            include: {
                from: true,
                to: true,
                intermediarySolution: true
            }
        });
    },
    async findById(id) {
        return prisma_1.prisma.connection.findUnique({
            where: { id },
            include: {
                from: true,
                to: true,
                intermediarySolution: true
            }
        });
    },
    async create(data) {
        validateIntermediary(data.fromId, data.toId, data.intermediarySolutionId);
        return prisma_1.prisma.connection.create({
            data,
            include: {
                from: true,
                to: true,
                intermediarySolution: true
            }
        });
    },
    async update(id, data) {
        const current = await prisma_1.prisma.connection.findUniqueOrThrow({ where: { id } });
        validateIntermediary(data.fromId ?? current.fromId, data.toId ?? current.toId, data.intermediarySolutionId === undefined ? current.intermediarySolutionId : data.intermediarySolutionId);
        return prisma_1.prisma.connection.update({
            where: { id },
            data,
            include: {
                from: true,
                to: true,
                intermediarySolution: true
            }
        });
    },
    async remove(id) {
        return prisma_1.prisma.connection.delete({
            where: { id }
        });
    }
};
