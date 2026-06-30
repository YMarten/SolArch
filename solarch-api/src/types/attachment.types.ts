import { AttachmentCategory } from "@prisma/client"

export interface CreateAttachmentDTO {
  title: string
  url: string
  category: AttachmentCategory
  description?: string
  solutionId: string
}

export interface UpdateAttachmentDTO extends Partial<CreateAttachmentDTO> {}