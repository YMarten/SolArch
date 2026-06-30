import { prisma } from "../prisma"
import { CreateAttachmentDTO, UpdateAttachmentDTO } from "../types/attachment.types"

export const attachmentsService = {
  async findBySolution(solutionId: string) {
    return prisma.attachment.findMany({
      where: { solutionId },
      orderBy: { createdAt: "desc" }
    })
  },

  async findById(id: string) {
    return prisma.attachment.findUnique({
      where: { id }
    })
  },

  async create(data: CreateAttachmentDTO) {
    return prisma.attachment.create({ data })
  },

  async update(id: string, data: UpdateAttachmentDTO) {
    return prisma.attachment.update({
      where: { id },
      data
    })
  },

  async remove(id: string) {
    return prisma.attachment.delete({
      where: { id }
    })
  }
}