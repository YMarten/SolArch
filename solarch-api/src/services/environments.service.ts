import { prisma } from "../prisma"
import { CreateEnvironmentDTO, UpdateEnvironmentDTO } from "../types/environment.types"

export const environmentsService = {
  async findBySolution(solutionId: string) {
    return prisma.environment.findMany({
      where: { solutionId },
      orderBy: { name: "asc" }
    })
  },

  async findById(id: string) {
    return prisma.environment.findUnique({
      where: { id }
    })
  },

  async create(data: CreateEnvironmentDTO) {
    return prisma.environment.create({ data })
  },

  async update(id: string, data: UpdateEnvironmentDTO) {
    return prisma.environment.update({
      where: { id },
      data
    })
  },

  async remove(id: string) {
    return prisma.environment.delete({
      where: { id }
    })
  }
}