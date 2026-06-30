import { FastifyInstance } from "fastify"
import { capabilitiesService } from "../services/capabilities.service"
import { CreateCapabilityDTO, UpdateCapabilityDTO } from "../types/capability.types"

export async function capabilitiesRoute(server: FastifyInstance) {

  server.get("/", async (request, reply) => {
    try {
      const capabilities = await capabilitiesService.findAll()
      return reply.send(capabilities)
    } catch (error) {
      return reply.status(500).send({ error: "Error al obtener las capacidades" })
    }
  })

  server.get("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const capability = await capabilitiesService.findById(id)
      if (!capability) return reply.status(404).send({ error: "Capacidad no encontrada" })
      return reply.send(capability)
    } catch (error) {
      return reply.status(500).send({ error: "Error al obtener la capacidad" })
    }
  })

  server.post("/", async (request, reply) => {
    try {
      const capability = await capabilitiesService.create(request.body as CreateCapabilityDTO)
      return reply.status(201).send(capability)
    } catch (error) {
      return reply.status(500).send({ error: "Error al crear la capacidad" })
    }
  })

  server.put("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const capability = await capabilitiesService.update(id, request.body as UpdateCapabilityDTO)
      return reply.send(capability)
    } catch (error) {
      return reply.status(500).send({ error: "Error al actualizar la capacidad" })
    }
  })

  server.delete("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      await capabilitiesService.remove(id)
      return reply.status(204).send()
    } catch (error) {
      return reply.status(500).send({ error: "Error al eliminar la capacidad" })
    }
  })
}