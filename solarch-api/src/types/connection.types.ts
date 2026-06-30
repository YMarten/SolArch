import { ConnectionType } from "@prisma/client"

export interface CreateConnectionDTO {
  fromId: string
  toId: string
  type: ConnectionType
  description?: string
}

export interface UpdateConnectionDTO extends Partial<CreateConnectionDTO> {}