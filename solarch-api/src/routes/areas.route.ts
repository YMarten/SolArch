import { FastifyInstance } from "fastify"
import { areasService } from "../services/areas.service"
import { CreateAreaDTO, UpdateAreaDTO } from "../types/area.types"

export async function areasRoute(server: FastifyInstance) {

  server.get("/", async (request, reply) => {
    try {
      const areas = await areasService.findAll()
      return reply.send(areas)
    } catch (error) {
      return reply.status(500).send({ error: "Error al obtener las áreas" })
    }
  })

  server.get("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const area = await areasService.findById(id)
      if (!area) return reply.status(404).send({ error: "Área no encontrada" })
      return reply.send(area)
    } catch (error) {
      return reply.status(500).send({ error: "Error al obtener el área" })
    }
  })

  server.post("/", async (request, reply) => {
    try {
      const area = await areasService.create(request.body as CreateAreaDTO)
      return reply.status(201).send(area)
    } catch (error) {
      return reply.status(500).send({ error: "Error al crear el área" })
    }
  })

  server.put("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const area = await areasService.update(id, request.body as UpdateAreaDTO)
      return reply.send(area)
    } catch (error) {
      return reply.status(500).send({ error: "Error al actualizar el área" })
    }
  })

  server.delete("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      await areasService.remove(id)
      return reply.status(204).send()
    } catch (error) {
      return reply.status(500).send({ error: "Error al eliminar el área" })
    }
  })
}