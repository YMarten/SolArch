import { prisma } from "../prisma"
import { CreateGroupDTO, UpdateGroupDTO, GroupMemberDTO } from "../types/group.types"

const include = {
  members: {
    include: { solution: { select: { id: true, name: true, description: true, status: true } } },
    orderBy: { solution: { name: "asc" as const } },
  },
}

export const groupsService = {
  async findAll(solutionId?: string) {
    return prisma.solutionGroup.findMany({
      where: solutionId ? { members: { some: { solutionId } } } : undefined,
      include, orderBy: { name: "asc" },
    })
  },
  async findById(id: string) {
    return prisma.solutionGroup.findUnique({ where: { id }, include })
  },
  async create(data: CreateGroupDTO) {
    return prisma.solutionGroup.create({ data: { name: data.name.trim(), description: data.description?.trim() || null }, include })
  },
  async update(id: string, data: UpdateGroupDTO) {
    return prisma.solutionGroup.update({ where: { id }, data: {
      name: data.name?.trim(),
      description: data.description === undefined ? undefined : data.description?.trim() || null,
    }, include })
  },
  async remove(id: string) {
    return prisma.solutionGroup.delete({ where: { id } })
  },
  async setMember(groupId: string, solutionId: string, data: GroupMemberDTO) {
    return prisma.solutionGroupMember.upsert({
      where: { groupId_solutionId: { groupId, solutionId } },
      create: { groupId, solutionId, participation: data.participation },
      update: { participation: data.participation },
    })
  },
  async removeMember(groupId: string, solutionId: string) {
    return prisma.solutionGroupMember.delete({ where: { groupId_solutionId: { groupId, solutionId } } })
  },
}
