"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capabilitiesService = void 0;
const prisma_1 = require("../prisma");
exports.capabilitiesService = {
    async findAll() {
        return prisma_1.prisma.businessCapability.findMany({
            include: {
                domain: true,
                parent: true,
                children: true,
            },
            orderBy: { name: "asc" }
        });
    },
    async findById(id) {
        return prisma_1.prisma.businessCapability.findUnique({
            where: { id },
            include: {
                domain: true,
                parent: true,
                children: true,
                solutions: {
                    include: { solution: true }
                }
            }
        });
    },
    async create(data) {
        return prisma_1.prisma.businessCapability.create({ data });
    },
    async update(id, data) {
        return prisma_1.prisma.businessCapability.update({
            where: { id },
            data
        });
    },
    async remove(id) {
        return prisma_1.prisma.businessCapability.delete({
            where: { id }
        });
    }
};
