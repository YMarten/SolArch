export interface CreateAreaDTO {
  name: string
  description?: string
}

export interface UpdateAreaDTO extends Partial<CreateAreaDTO> {}