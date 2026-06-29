import { prisma } from "../prisma"
import { CreateSolutionDTO, UpdateSolutionDTO } from "../types/solution.types"

export const solutionsService = {
  async findAll() {
    return prisma.solution.findMany({
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
      },
      orderBy: { createdAt: "desc" }
    })
  },

  async findById(id: string) {
    return prisma.solution.findUnique({
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
    })
  },

  async create(data: CreateSolutionDTO) {
    const { technologyIds, domainIds, capabilityIds, areaIds, ...solutionData } = data

    return prisma.solution.create({
      data: {
        ...solutionData,
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
    })
  },

  async update(id: string, data: UpdateSolutionDTO) {
    const { technologyIds, domainIds, capabilityIds, areaIds, ...solutionData } = data

    return prisma.solution.update({
      where: { id },
      data: {
        ...solutionData,
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
    })
  },

  async remove(id: string) {
    return prisma.solution.delete({
      where: { id }
    })
  }
}