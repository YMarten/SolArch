import { prisma } from "../prisma"
import { CreateTechnologyDTO, UpdateTechnologyDTO } from "../types/technology.types"

export const technologiesService = {
  async findAll() {
    return prisma.technology.findMany({
      orderBy: { name: "asc" }
    })
  },

  async findById(id: string) {
    return prisma.technology.findUnique({
      where: { id },
      include: {
        solutions: {
          include: { solution: true }
        }
      }
    })
  },

  async create(data: CreateTechnologyDTO) {
    return prisma.technology.create({ data })
  },

  async update(id: string, data: UpdateTechnologyDTO) {
    return prisma.technology.update({
      where: { id },
      data
    })
  },

  async remove(id: string) {
    return prisma.technology.delete({
      where: { id }
    })
  }
}