"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionsRoute = connectionsRoute;
const connections_service_1 = require("../services/connections.service");
async function connectionsRoute(server) {
    // GET /api/connections?solutionId=xxx
    server.get("/", async (request, reply) => {
        try {
            const { solutionId } = request.query;
            if (!solutionId) {
                return reply.status(400).send({ error: "solutionId es requerido" });
            }
            const connections = await connections_service_1.connectionsService.findBySolution(solutionId);
            return reply.send(connections);
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al obtener las conexiones" });
        }
    });
    // GET /api/connections/:id
    server.get("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const connection = await connections_service_1.connectionsService.findById(id);
            if (!connection)
                return reply.status(404).send({ error: "Conexión no encontrada" });
            return reply.send(connection);
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al obtener la conexión" });
        }
    });
    // POST /api/connections
    server.post("/", async (request, reply) => {
        try {
            const connection = await connections_service_1.connectionsService.create(request.body);
            return reply.status(201).send(connection);
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al crear la conexión" });
        }
    });
    // PUT /api/connections/:id
    server.put("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const connection = await connections_service_1.connectionsService.update(id, request.body);
            return reply.send(connection);
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al actualizar la conexión" });
        }
    });
    // DELETE /api/connections/:id
    server.delete("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            await connections_service_1.connectionsService.remove(id);
            return reply.status(204).send();
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al eliminar la conexión" });
        }
    });
}
