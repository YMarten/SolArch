import { prisma } from "../prisma"
import { CreateConnectionDTO, UpdateConnectionDTO } from "../types/connection.types"

function validateIntermediary(fromId: string, toId: string, intermediarySolutionId?: string | null) {
  if (intermediarySolutionId && (intermediarySolutionId === fromId || intermediarySolutionId === toId)) {
    throw Object.assign(new Error("El intermediario debe ser distinto del origen y del destino"), { statusCode: 400 })
  }
}

export const connectionsService = {
  async findBySolution(solutionId: string) {
    return prisma.connection.findMany({
      where: {
        OR: [
          { fromId: solutionId },
          { toId: solutionId },
          { intermediarySolutionId: solutionId }
        ]
      },
      include: {
        from: true,
        to: true,
        intermediarySolution: true
      }
    })
  },

  async findById(id: string) {
    return prisma.connection.findUnique({
      where: { id },
      include: {
        from: true,
        to: true,
        intermediarySolution: true
      }
    })
  },

  async create(data: CreateConnectionDTO) {
    validateIntermediary(data.fromId, data.toId, data.intermediarySolutionId)
    return prisma.connection.create({
      data,
      include: {
        from: true,
        to: true,
        intermediarySolution: true
      }
    })
  },

  async update(id: string, data: UpdateConnectionDTO) {
    const current = await prisma.connection.findUniqueOrThrow({ where: { id } })
    validateIntermediary(data.fromId ?? current.fromId, data.toId ?? current.toId,
      data.intermediarySolutionId === undefined ? current.intermediarySolutionId : data.intermediarySolutionId)
    return prisma.connection.update({
      where: { id },
      data,
      include: {
        from: true,
        to: true,
        intermediarySolution: true
      }
    })
  },

  async remove(id: string) {
    return prisma.connection.delete({
      where: { id }
    })
  }
}