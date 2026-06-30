import { FastifyInstance } from "fastify"
import { environmentsService } from "../services/environments.service"
import { CreateEnvironmentDTO, UpdateEnvironmentDTO } from "../types/environment.types"

export async function environmentsRoute(server: FastifyInstance) {

  // GET /api/environments?solutionId=xxx
  server.get("/", async (request, reply) => {
    try {
      const { solutionId } = request.query as { solutionId: string }
      if (!solutionId) {
        return reply.status(400).send({ error: "solutionId es requerido" })
      }
      const environments = await environmentsService.findBySolution(solutionId)
      return reply.send(environments)
    } catch (error) {
      return reply.status(500).send({ error: "Error al obtener los ambientes" })
    }
  })

  // GET /api/environments/:id
  server.get("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const environment = await environmentsService.findById(id)
      if (!environment) return reply.status(404).send({ error: "Ambiente no encontrado" })
      return reply.send(environment)
    } catch (error) {
      return reply.status(500).send({ error: "Error al obtener el ambiente" })
    }
  })

  // POST /api/environments
  server.post("/", async (request, reply) => {
    try {
      const environment = await environmentsService.create(request.body as CreateEnvironmentDTO)
      return reply.status(201).send(environment)
    } catch (error) {
      return reply.status(500).send({ error: "Error al crear el ambiente" })
    }
  })

  // PUT /api/environments/:id
  server.put("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const environment = await environmentsService.update(id, request.body as UpdateEnvironmentDTO)
      return reply.send(environment)
    } catch (error) {
      return reply.status(500).send({ error: "Error al actualizar el ambiente" })
    }
  })

  // DELETE /api/environments/:id
  server.delete("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      await environmentsService.remove(id)
      return reply.status(204).send()
    } catch (error) {
      return reply.status(500).send({ error: "Error al eliminar el ambiente" })
    }
  })
}