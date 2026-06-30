import { FastifyInstance } from "fastify"
import { attachmentsService } from "../services/attachments.service"
import { CreateAttachmentDTO, UpdateAttachmentDTO } from "../types/attachment.types"

export async function attachmentsRoute(server: FastifyInstance) {

  // GET /api/attachments?solutionId=xxx
  server.get("/", async (request, reply) => {
    try {
      const { solutionId } = request.query as { solutionId: string }
      if (!solutionId) {
        return reply.status(400).send({ error: "solutionId es requerido" })
      }
      const attachments = await attachmentsService.findBySolution(solutionId)
      return reply.send(attachments)
    } catch (error) {
      return reply.status(500).send({ error: "Error al obtener los adjuntos" })
    }
  })

  // GET /api/attachments/:id
  server.get("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const attachment = await attachmentsService.findById(id)
      if (!attachment) return reply.status(404).send({ error: "Adjunto no encontrado" })
      return reply.send(attachment)
    } catch (error) {
      return reply.status(500).send({ error: "Error al obtener el adjunto" })
    }
  })

  // POST /api/attachments
  server.post("/", async (request, reply) => {
    try {
      const attachment = await attachmentsService.create(request.body as CreateAttachmentDTO)
      return reply.status(201).send(attachment)
    } catch (error) {
      return reply.status(500).send({ error: "Error al crear el adjunto" })
    }
  })

  // PUT /api/attachments/:id
  server.put("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const attachment = await attachmentsService.update(id, request.body as UpdateAttachmentDTO)
      return reply.send(attachment)
    } catch (error) {
      return reply.status(500).send({ error: "Error al actualizar el adjunto" })
    }
  })

  // DELETE /api/attachments/:id
  server.delete("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      await attachmentsService.remove(id)
      return reply.status(204).send()
    } catch (error) {
      return reply.status(500).send({ error: "Error al eliminar el adjunto" })
    }
  })
}