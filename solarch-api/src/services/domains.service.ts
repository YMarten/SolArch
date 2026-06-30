import { prisma } from "../prisma"
import { CreateDomainDTO, UpdateDomainDTO } from "../types/domain.types"

export const domainsService = {
  async findAll() {
    return prisma.businessDomain.findMany({
      include: {
        children: true,
        parent: true,
      },
      orderBy: { name: "asc" }
    })
  },

  async findById(id: string) {
    return prisma.businessDomain.findUnique({
      where: { id },
      include: {
        children: true,
        parent: true,
        capabilities: true,
        solutions: {
          include: { solution: true }
        }
      }
    })
  },

  async create(data: CreateDomainDTO) {
    return prisma.businessDomain.create({ data })
  },

  async update(id: string, data: UpdateDomainDTO) {
    return prisma.businessDomain.update({
      where: { id },
      data
    })
  },

  async remove(id: string) {
    return prisma.businessDomain.delete({
      where: { id }
    })
  }
}