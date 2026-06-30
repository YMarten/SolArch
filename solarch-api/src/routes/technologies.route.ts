import { FastifyInstance } from "fastify"
import { technologiesService } from "../services/technologies.service"
import { CreateTechnologyDTO, UpdateTechnologyDTO } from "../types/technology.types"

export async function technologiesRoute(server: FastifyInstance) {

  // GET /api/technologies
  server.get("/", async (request, reply) => {
    try {
      const technologies = await technologiesService.findAll()
      return reply.send(technologies)
    } catch (error) {
      return reply.status(500).send({ error: "Error al obtener las tecnologías" })
    }
  })

  // GET /api/technologies/:id
  server.get("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const technology = await technologiesService.findById(id)

      if (!technology) {
        return reply.status(404).send({ error: "Tecnología no encontrada" })
      }

      return reply.send(technology)
    } catch (error) {
      return reply.status(500).send({ error: "Error al obtener la tecnología" })
    }
  })

  // POST /api/technologies
  server.post("/", async (request, reply) => {
    try {
      const body = request.body as CreateTechnologyDTO
      const technology = await technologiesService.create(body)
      return reply.status(201).send(technology)
    } catch (error) {
      server.log.error(error)
      return reply.status(500).send({ error: "Error al crear la tecnología" })
    }
  })

  // PUT /api/technologies/:id
  server.put("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const body = request.body as UpdateTechnologyDTO
      const technology = await technologiesService.update(id, body)
      return reply.send(technology)
    } catch (error) {
      return reply.status(500).send({ error: "Error al actualizar la tecnología" })
    }
  })

  // DELETE /api/technologies/:id
  server.delete("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      await technologiesService.remove(id)
      return reply.status(204).send()
    } catch (error) {
      server.log.error(error)
      return reply.status(500).send({ error: "Error al eliminar la tecnología" })
    }
  })
}