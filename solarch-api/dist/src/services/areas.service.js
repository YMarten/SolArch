"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.areasService = void 0;
const prisma_1 = require("../prisma");
exports.areasService = {
    async findAll() {
        return prisma_1.prisma.businessArea.findMany({
            orderBy: { name: "asc" }
        });
    },
    async findById(id) {
        return prisma_1.prisma.businessArea.findUnique({
            where: { id },
            include: {
                solutions: {
                    include: { solution: true }
                }
            }
        });
    },
    async create(data) {
        return prisma_1.prisma.businessArea.create({ data });
    },
    async update(id, data) {
        return prisma_1.prisma.businessArea.update({
            where: { id },
            data
        });
    },
    async remove(id) {
        return prisma_1.prisma.businessArea.delete({
            where: { id }
        });
    }
};
