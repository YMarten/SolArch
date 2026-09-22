import { FastifyInstance } from "fastify"
import { Prisma } from "@prisma/client"
import { groupsService } from "../services/groups.service"
import { CreateGroupDTO, UpdateGroupDTO, GroupMemberDTO } from "../types/group.types"

const properties = {
  name: { type: "string", minLength: 1, maxLength: 200, pattern: "\\S" },
  description: { type: ["string", "null"], maxLength: 10000 },
}
const idParams = { type: "object", required: ["id"], properties: { id: { type: "string", minLength: 1 } } }
const memberParams = { type: "object", required: ["id", "solutionId"], properties: { ...idParams.properties, solutionId: { type: "string", minLength: 1 } } }

export async function groupsRoute(server: FastifyInstance) {
  server.setErrorHandler((error, request, reply) => {
    if (error instanceof Error && "validation" in error) return reply.status(400).send({ error: "Datos de grupo inválidos", details: error.validation })
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") return reply.status(409).send({ error: "Ya existe un grupo con ese nombre" })
      if (error.code === "P2025" || error.code === "P2003") return reply.status(404).send({ error: "Grupo, solución o asociación no encontrada" })
    }
    request.log.error(error)
    return reply.status(500).send({ error: "No se pudo completar la operación del grupo" })
  })
  server.get<{ Querystring: { solutionId?: string } }>("/", {
    schema: { querystring: { type: "object", properties: { solutionId: { type: "string", minLength: 1 } } } },
  }, request => groupsService.findAll(request.query.solutionId))
  server.get<{ Params: { id: string } }>("/:id", { schema: { params: idParams } }, async (request, reply) => {
    const group = await groupsService.findById(request.params.id)
    return group ?? reply.status(404).send({ error: "Grupo no encontrado" })
  })
  server.post<{ Body: CreateGroupDTO }>("/", { schema: { body: { type: "object", required: ["name"], additionalProperties: false, properties } } }, async (request, reply) => {
    return reply.status(201).send(await groupsService.create(request.body))
  })
  server.put<{ Params: { id: string }; Body: UpdateGroupDTO }>("/:id", {
    schema: { params: idParams, body: { type: "object", minProperties: 1, additionalProperties: false, properties } },
  }, request => groupsService.update(request.params.id, request.body))
  server.delete<{ Params: { id: string } }>("/:id", { schema: { params: idParams } }, async (request, reply) => {
    await groupsService.remove(request.params.id)
    return reply.status(204).send()
  })
  server.put<{ Params: { id: string; solutionId: string }; Body: GroupMemberDTO }>("/:id/members/:solutionId", {
    schema: { params: memberParams, body: { type: "object", required: ["participation"], additionalProperties: false, properties: { participation: { type: "string", enum: ["NEW", "REUSED", "ADAPTED"] } } } },
  }, request => groupsService.setMember(request.params.id, request.params.solutionId, request.body))
  server.delete<{ Params: { id: string; solutionId: string } }>("/:id/members/:solutionId", { schema: { params: memberParams } }, async (request, reply) => {
    await groupsService.removeMember(request.params.id, request.params.solutionId)
    return reply.status(204).send()
  })
}
