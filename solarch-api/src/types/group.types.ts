import { SolutionParticipation } from "@prisma/client"

export interface CreateGroupDTO {
  name: string
  description?: string | null
}
export type UpdateGroupDTO = Partial<CreateGroupDTO>
export interface GroupMemberDTO {
  participation: SolutionParticipation
}
