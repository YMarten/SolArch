import { FastifyInstance } from "fastify"
import { reviewsService } from "../services/reviews.service"
import { CreateReviewDTO, UpdateReviewDTO, UpdateReviewActionDTO } from "../types/review.types"

export async function reviewsRoute(server: FastifyInstance) {

  // GET /api/reviews?solutionId=xxx
  server.get("/", async (request, reply) => {
    try {
      const { solutionId } = request.query as { solutionId: string }
      if (!solutionId) {
        return reply.status(400).send({ error: "solutionId es requerido" })
      }
      const reviews = await reviewsService.findBySolution(solutionId)
      return reply.send(reviews)
    } catch (error) {
      return reply.status(500).send({ error: "Error al obtener las revisiones" })
    }
  })

  // GET /api/reviews/actions/pending
  server.get("/actions/pending", async (request, reply) => {
    try {
      const actions = await reviewsService.findPendingActions()
      return reply.send(actions)
    } catch (error) {
      return reply.status(500).send({ error: "Error al obtener las acciones pendientes" })
    }
  })

  // GET /api/reviews/:id
  server.get("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const review = await reviewsService.findById(id)
      if (!review) return reply.status(404).send({ error: "Revisión no encontrada" })
      return reply.send(review)
    } catch (error) {
      return reply.status(500).send({ error: "Error al obtener la revisión" })
    }
  })

  // POST /api/reviews
  server.post("/", async (request, reply) => {
    try {
      const review = await reviewsService.create(request.body as CreateReviewDTO)
      return reply.status(201).send(review)
    } catch (error) {
      return reply.status(500).send({ error: "Error al crear la revisión" })
    }
  })

  // PUT /api/reviews/:id
  server.put("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const review = await reviewsService.update(id, request.body as UpdateReviewDTO)
      return reply.send(review)
    } catch (error) {
      return reply.status(500).send({ error: "Error al actualizar la revisión" })
    }
  })

  // DELETE /api/reviews/:id
  server.delete("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      await reviewsService.remove(id)
      return reply.status(204).send()
    } catch (error) {
      return reply.status(500).send({ error: "Error al eliminar la revisión" })
    }
  })

  // PATCH /api/reviews/actions/:actionId
  server.patch("/actions/:actionId", async (request, reply) => {
    try {
      const { actionId } = request.params as { actionId: string }
      const action = await reviewsService.updateAction(actionId, request.body as UpdateReviewActionDTO)
      return reply.send(action)
    } catch (error) {
      return reply.status(500).send({ error: "Error al actualizar la acción" })
    }
  })
}