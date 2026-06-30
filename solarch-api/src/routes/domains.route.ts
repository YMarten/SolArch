import { FastifyInstance } from "fastify"
import { domainsService } from "../services/domains.service"
import { CreateDomainDTO, UpdateDomainDTO } from "../types/domain.types"

export async function domainsRoute(server: FastifyInstance) {

  server.get("/", async (request, reply) => {
    try {
      const domains = await domainsService.findAll()
      return reply.send(domains)
    } catch (error) {
      return reply.status(500).send({ error: "Error al obtener los dominios" })
    }
  })

  server.get("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const domain = await domainsService.findById(id)
      if (!domain) return reply.status(404).send({ error: "Dominio no encontrado" })
      return reply.send(domain)
    } catch (error) {
      return reply.status(500).send({ error: "Error al obtener el dominio" })
    }
  })

  server.post("/", async (request, reply) => {
    try {
      const domain = await domainsService.create(request.body as CreateDomainDTO)
      return reply.status(201).send(domain)
    } catch (error) {
      return reply.status(500).send({ error: "Error al crear el dominio" })
    }
  })

  server.put("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const domain = await domainsService.update(id, request.body as UpdateDomainDTO)
      return reply.send(domain)
    } catch (error) {
      return reply.status(500).send({ error: "Error al actualizar el dominio" })
    }
  })

  server.delete("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      await domainsService.remove(id)
      return reply.status(204).send()
    } catch (error) {
      return reply.status(500).send({ error: "Error al eliminar el dominio" })
    }
  })
}