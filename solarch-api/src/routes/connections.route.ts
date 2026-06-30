import { FastifyInstance } from "fastify"
import { connectionsService } from "../services/connections.service"
import { CreateConnectionDTO, UpdateConnectionDTO } from "../types/connection.types"

export async function connectionsRoute(server: FastifyInstance) {

  // GET /api/connections?solutionId=xxx
  server.get("/", async (request, reply) => {
    try {
      const { solutionId } = request.query as { solutionId: string }
      if (!solutionId) {
        return reply.status(400).send({ error: "solutionId es requerido" })
      }
      const connections = await connectionsService.findBySolution(solutionId)
      return reply.send(connections)
    } catch (error) {
      return reply.status(500).send({ error: "Error al obtener las conexiones" })
    }
  })

  // GET /api/connections/:id
  server.get("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const connection = await connectionsService.findById(id)
      if (!connection) return reply.status(404).send({ error: "Conexión no encontrada" })
      return reply.send(connection)
    } catch (error) {
      return reply.status(500).send({ error: "Error al obtener la conexión" })
    }
  })

  // POST /api/connections
  server.post("/", async (request, reply) => {
    try {
      const connection = await connectionsService.create(request.body as CreateConnectionDTO)
      return reply.status(201).send(connection)
    } catch (error) {
      return reply.status(500).send({ error: "Error al crear la conexión" })
    }
  })

  // PUT /api/connections/:id
  server.put("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const connection = await connectionsService.update(id, request.body as UpdateConnectionDTO)
      return reply.send(connection)
    } catch (error) {
      return reply.status(500).send({ error: "Error al actualizar la conexión" })
    }
  })

  // DELETE /api/connections/:id
  server.delete("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      await connectionsService.remove(id)
      return reply.status(204).send()
    } catch (error) {
      return reply.status(500).send({ error: "Error al eliminar la conexión" })
    }
  })
}