import { FastifyInstance } from "fastify"
import { exportService } from "../services/export.service"

export async function exportRoute(server: FastifyInstance) {
  server.get("/", async (request, reply) => {
    reply.header("Cache-Control", "no-store")
    try {
      return reply.send(await exportService.generate())
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({ error: "No se pudo generar el JSON. Intenta nuevamente." })
    }
  })
}
