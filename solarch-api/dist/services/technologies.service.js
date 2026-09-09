"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.technologiesService = void 0;
const prisma_1 = require("../prisma");
exports.technologiesService = {
    async findAll() {
        return prisma_1.prisma.technology.findMany({
            orderBy: { name: "asc" }
        });
    },
    async findById(id) {
        return prisma_1.prisma.technology.findUnique({
            where: { id },
            include: {
                solutions: {
                    include: { solution: true }
                }
            }
        });
    },
    async create(data) {
        return prisma_1.prisma.technology.create({ data });
    },
    async update(id, data) {
        return prisma_1.prisma.technology.update({
            where: { id },
            data
        });
    },
    async remove(id) {
        return prisma_1.prisma.technology.delete({
            where: { id }
        });
    }
};
