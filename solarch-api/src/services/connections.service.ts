import { prisma } from "../prisma"
import { CreateConnectionDTO, UpdateConnectionDTO } from "../types/connection.types"

export const connectionsService = {
  async findBySolution(solutionId: string) {
    return prisma.connection.findMany({
      where: {
        OR: [
          { fromId: solutionId },
          { toId: solutionId }
        ]
      },
      include: {
        from: true,
        to: true
      }
    })
  },

  async findById(id: string) {
    return prisma.connection.findUnique({
      where: { id },
      include: {
        from: true,
        to: true
      }
    })
  },

  async create(data: CreateConnectionDTO) {
    return prisma.connection.create({
      data,
      include: {
        from: true,
        to: true
      }
    })
  },

  async update(id: string, data: UpdateConnectionDTO) {
    return prisma.connection.update({
      where: { id },
      data,
      include: {
        from: true,
        to: true
      }
    })
  },

  async remove(id: string) {
    return prisma.connection.delete({
      where: { id }
    })
  }
}