import { prisma } from "../prisma"
import { CreateCapabilityDTO, UpdateCapabilityDTO } from "../types/capability.types"

export const capabilitiesService = {
  async findAll() {
    return prisma.businessCapability.findMany({
      include: {
        domain: true,
        parent: true,
        children: true,
      },
      orderBy: { name: "asc" }
    })
  },

  async findById(id: string) {
    return prisma.businessCapability.findUnique({
      where: { id },
      include: {
        domain: true,
        parent: true,
        children: true,
        solutions: {
          include: { solution: true }
        }
      }
    })
  },

  async create(data: CreateCapabilityDTO) {
    return prisma.businessCapability.create({ data })
  },

  async update(id: string, data: UpdateCapabilityDTO) {
    return prisma.businessCapability.update({
      where: { id },
      data
    })
  },

  async remove(id: string) {
    return prisma.businessCapability.delete({
      where: { id }
    })
  }
}