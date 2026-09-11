"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.solutionsService = void 0;
const prisma_1 = require("../prisma");
exports.solutionsService = {
    async findAll() {
        return prisma_1.prisma.solution.findMany({
            include: {
                technologies: {
                    include: { technology: true }
                },
                domains: {
                    include: { domain: true }
                },
                areas: {
                    include: { area: true }
                },
                capabilities: {
                    include: { capability: true }
                },
                responsibleArea: true,
                similarSolution: { select: { id: true, name: true } },
                replacementSolution: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: "asc" }
        });
    },
    async findById(id) {
        return prisma_1.prisma.solution.findUnique({
            where: { id },
            include: {
                technologies: {
                    include: { technology: true }
                },
                domains: {
                    include: { domain: true }
                },
                capabilities: {
                    include: { capability: true }
                },
                areas: {
                    include: { area: true }
                },
                responsibleArea: true,
                similarSolution: { select: { id: true, name: true } },
                replacementSolution: { select: { id: true, name: true } },
                environments: true,
                attachments: true,
                connectionsFrom: {
                    include: { to: true }
                },
                connectionsTo: {
                    include: { from: true }
                },
                archReviews: {
                    orderBy: { reviewedAt: "desc" }
                }
            }
        });
    },
    async create(data) {
        const { technologyIds, domainIds, capabilityIds, areaIds, ...solutionData } = data;
        if (solutionData.similarSolutionId && solutionData.replacementSolutionId &&
            solutionData.similarSolutionId === solutionData.replacementSolutionId) {
            throw new Error("La solución similar y la sustituta deben ser diferentes");
        }
        const normalizedData = {
            ...solutionData,
            lastDeploy: solutionData.lastDeploy ? new Date(solutionData.lastDeploy) : undefined,
            similarSolutionId: solutionData.hasSimilarSolution ? solutionData.similarSolutionId : null,
            problemDetails: solutionData.hasProblems ? solutionData.problemDetails : null,
            replacementSolutionId: solutionData.hasReplacementInitiative ? solutionData.replacementSolutionId : null,
            proposedReplacementName: solutionData.hasReplacementInitiative ? solutionData.proposedReplacementName : null,
        };
        return prisma_1.prisma.solution.create({
            data: {
                ...normalizedData,
                technologies: technologyIds ? {
                    create: technologyIds.map(id => ({ technologyId: id }))
                } : undefined,
                domains: domainIds ? {
                    create: domainIds.map(id => ({ domainId: id }))
                } : undefined,
                capabilities: capabilityIds ? {
                    create: capabilityIds.map(id => ({ capabilityId: id }))
                } : undefined,
                areas: areaIds ? {
                    create: areaIds.map(id => ({ areaId: id }))
                } : undefined,
            }
        });
    },
    async update(id, data) {
        const { technologyIds, domainIds, capabilityIds, areaIds, ...solutionData } = data;
        if (solutionData.similarSolutionId === id || solutionData.replacementSolutionId === id) {
            throw new Error("Una solución no puede relacionarse consigo misma");
        }
        const normalizedData = {
            ...solutionData,
            ...(solutionData.lastDeploy !== undefined
                ? { lastDeploy: solutionData.lastDeploy ? new Date(solutionData.lastDeploy) : null }
                : {}),
            ...(solutionData.hasSimilarSolution === false ? { similarSolutionId: null } : {}),
            ...(solutionData.hasProblems === false ? { problemDetails: null } : {}),
            ...(solutionData.hasReplacementInitiative === false
                ? { replacementSolutionId: null, proposedReplacementName: null }
                : {}),
        };
        return prisma_1.prisma.solution.update({
            where: { id },
            data: {
                ...normalizedData,
                technologies: technologyIds ? {
                    deleteMany: {},
                    create: technologyIds.map(id => ({ technologyId: id }))
                } : undefined,
                domains: domainIds ? {
                    deleteMany: {},
                    create: domainIds.map(id => ({ domainId: id }))
                } : undefined,
                capabilities: capabilityIds ? {
                    deleteMany: {},
                    create: capabilityIds.map(id => ({ capabilityId: id }))
                } : undefined,
                areas: areaIds ? {
                    deleteMany: {},
                    create: areaIds.map(id => ({ areaId: id }))
                } : undefined,
            }
        });
    },
    async remove(id) {
        return prisma_1.prisma.solution.delete({
            where: { id }
        });
    }
};
