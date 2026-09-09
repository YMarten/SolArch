"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environmentsRoute = environmentsRoute;
const environments_service_1 = require("../services/environments.service");
async function environmentsRoute(server) {
    // GET /api/environments?solutionId=xxx
    server.get("/", async (request, reply) => {
        try {
            const { solutionId } = request.query;
            if (!solutionId) {
                return reply.status(400).send({ error: "solutionId es requerido" });
            }
            const environments = await environments_service_1.environmentsService.findBySolution(solutionId);
            return reply.send(environments);
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al obtener los ambientes" });
        }
    });
    // GET /api/environments/:id
    server.get("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const environment = await environments_service_1.environmentsService.findById(id);
            if (!environment)
                return reply.status(404).send({ error: "Ambiente no encontrado" });
            return reply.send(environment);
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al obtener el ambiente" });
        }
    });
    // POST /api/environments
    server.post("/", async (request, reply) => {
        try {
            const environment = await environments_service_1.environmentsService.create(request.body);
            return reply.status(201).send(environment);
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al crear el ambiente" });
        }
    });
    // PUT /api/environments/:id
    server.put("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const environment = await environments_service_1.environmentsService.update(id, request.body);
            return reply.send(environment);
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al actualizar el ambiente" });
        }
    });
    // DELETE /api/environments/:id
    server.delete("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            await environments_service_1.environmentsService.remove(id);
            return reply.status(204).send();
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al eliminar el ambiente" });
        }
    });
}
