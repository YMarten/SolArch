import { FastifyInstance } from "fastify"
import { solutionsService } from "../services/solutions.service"
import { CreateSolutionDTO, UpdateSolutionDTO } from "../types/solution.types"

export async function solutionsRoute(server: FastifyInstance) {

  // GET /api/solutions
  server.get("/", async (request, reply) => {
    try {
      const solutions = await solutionsService.findAll()
      return reply.send(solutions)
    } catch (error) {
      return reply.status(500).send({ error: "Error al obtener las soluciones" })
    }
  })

  // GET /api/solutions/:id
  server.get("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const solution = await solutionsService.findById(id)

      if (!solution) {
        return reply.status(404).send({ error: "Solución no encontrada" })
      }

      return reply.send(solution)
    } catch (error) {
      return reply.status(500).send({ error: "Error al obtener la solución" })
    }
  })

  // POST /api/solutions
  server.post("/", async (request, reply) => {
    try {
      const body = request.body as CreateSolutionDTO
      const solution = await solutionsService.create(body)
      return reply.status(201).send(solution)
    } catch (error) {
      return reply.status(500).send({ error: "Error al crear la solución" })
    }
  })

  // PUT /api/solutions/:id
  server.put("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const body = request.body as UpdateSolutionDTO
      const solution = await solutionsService.update(id, body)
      return reply.send(solution)
    } catch (error) {
      return reply.status(500).send({ error: "Error al actualizar la solución" })
    }
  })

  // DELETE /api/solutions/:id
  server.delete("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      await solutionsService.remove(id)
      return reply.status(204).send()
    } catch (error) {
      return reply.status(500).send({ error: "Error al eliminar la solución" })
    }
  })
}