import { prisma } from "../prisma"
import { CreateAreaDTO, UpdateAreaDTO } from "../types/area.types"

export const areasService = {
  async findAll() {
    return prisma.businessArea.findMany({
      orderBy: { name: "asc" }
    })
  },

  async findById(id: string) {
    return prisma.businessArea.findUnique({
      where: { id },
      include: {
        solutions: {
          include: { solution: true }
        }
      }
    })
  },

  async create(data: CreateAreaDTO) {
    return prisma.businessArea.create({ data })
  },

  async update(id: string, data: UpdateAreaDTO) {
    return prisma.businessArea.update({
      where: { id },
      data
    })
  },

  async remove(id: string) {
    return prisma.businessArea.delete({
      where: { id }
    })
  }
}