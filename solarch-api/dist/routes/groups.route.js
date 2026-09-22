"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupsRoute = groupsRoute;
const client_1 = require("@prisma/client");
const groups_service_1 = require("../services/groups.service");
const properties = {
    name: { type: "string", minLength: 1, maxLength: 200, pattern: "\\S" },
    description: { type: ["string", "null"], maxLength: 10000 },
};
const idParams = { type: "object", required: ["id"], properties: { id: { type: "string", minLength: 1 } } };
const memberParams = { type: "object", required: ["id", "solutionId"], properties: { ...idParams.properties, solutionId: { type: "string", minLength: 1 } } };
async function groupsRoute(server) {
    server.setErrorHandler((error, request, reply) => {
        if (error instanceof Error && "validation" in error)
            return reply.status(400).send({ error: "Datos de grupo inválidos", details: error.validation });
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002")
                return reply.status(409).send({ error: "Ya existe un grupo con ese nombre" });
            if (error.code === "P2025" || error.code === "P2003")
                return reply.status(404).send({ error: "Grupo, solución o asociación no encontrada" });
        }
        request.log.error(error);
        return reply.status(500).send({ error: "No se pudo completar la operación del grupo" });
    });
    server.get("/", {
        schema: { querystring: { type: "object", properties: { solutionId: { type: "string", minLength: 1 } } } },
    }, request => groups_service_1.groupsService.findAll(request.query.solutionId));
    server.get("/:id", { schema: { params: idParams } }, async (request, reply) => {
        const group = await groups_service_1.groupsService.findById(request.params.id);
        return group ?? reply.status(404).send({ error: "Grupo no encontrado" });
    });
    server.post("/", { schema: { body: { type: "object", required: ["name"], additionalProperties: false, properties } } }, async (request, reply) => {
        return reply.status(201).send(await groups_service_1.groupsService.create(request.body));
    });
    server.put("/:id", {
        schema: { params: idParams, body: { type: "object", minProperties: 1, additionalProperties: false, properties } },
    }, request => groups_service_1.groupsService.update(request.params.id, request.body));
    server.delete("/:id", { schema: { params: idParams } }, async (request, reply) => {
        await groups_service_1.groupsService.remove(request.params.id);
        return reply.status(204).send();
    });
    server.put("/:id/members/:solutionId", {
        schema: { params: memberParams, body: { type: "object", required: ["participation"], additionalProperties: false, properties: { participation: { type: "string", enum: ["NEW", "REUSED", "ADAPTED"] } } } },
    }, request => groups_service_1.groupsService.setMember(request.params.id, request.params.solutionId, request.body));
    server.delete("/:id/members/:solutionId", { schema: { params: memberParams } }, async (request, reply) => {
        await groups_service_1.groupsService.removeMember(request.params.id, request.params.solutionId);
        return reply.status(204).send();
    });
}
