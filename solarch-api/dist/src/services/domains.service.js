"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.domainsService = void 0;
const prisma_1 = require("../prisma");
exports.domainsService = {
    async findAll() {
        return prisma_1.prisma.businessDomain.findMany({
            include: {
                children: true,
                parent: true,
            },
            orderBy: { name: "asc" }
        });
    },
    async findById(id) {
        return prisma_1.prisma.businessDomain.findUnique({
            where: { id },
            include: {
                children: true,
                parent: true,
                capabilities: true,
                solutions: {
                    include: { solution: true }
                }
            }
        });
    },
    async create(data) {
        return prisma_1.prisma.businessDomain.create({ data });
    },
    async update(id, data) {
        return prisma_1.prisma.businessDomain.update({
            where: { id },
            data
        });
    },
    async remove(id) {
        return prisma_1.prisma.businessDomain.delete({
            where: { id }
        });
    }
};
