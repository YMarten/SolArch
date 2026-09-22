"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupsService = void 0;
const prisma_1 = require("../prisma");
const include = {
    members: {
        include: { solution: { select: { id: true, name: true, description: true, status: true } } },
        orderBy: { solution: { name: "asc" } },
    },
};
exports.groupsService = {
    async findAll(solutionId) {
        return prisma_1.prisma.solutionGroup.findMany({
            where: solutionId ? { members: { some: { solutionId } } } : undefined,
            include, orderBy: { name: "asc" },
        });
    },
    async findById(id) {
        return prisma_1.prisma.solutionGroup.findUnique({ where: { id }, include });
    },
    async create(data) {
        return prisma_1.prisma.solutionGroup.create({ data: { name: data.name.trim(), description: data.description?.trim() || null }, include });
    },
    async update(id, data) {
        return prisma_1.prisma.solutionGroup.update({ where: { id }, data: {
                name: data.name?.trim(),
                description: data.description === undefined ? undefined : data.description?.trim() || null,
            }, include });
    },
    async remove(id) {
        return prisma_1.prisma.solutionGroup.delete({ where: { id } });
    },
    async setMember(groupId, solutionId, data) {
        return prisma_1.prisma.solutionGroupMember.upsert({
            where: { groupId_solutionId: { groupId, solutionId } },
            create: { groupId, solutionId, participation: data.participation },
            update: { participation: data.participation },
        });
    },
    async removeMember(groupId, solutionId) {
        return prisma_1.prisma.solutionGroupMember.delete({ where: { groupId_solutionId: { groupId, solutionId } } });
    },
};
