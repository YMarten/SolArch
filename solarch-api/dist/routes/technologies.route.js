"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.technologiesRoute = technologiesRoute;
const technologies_service_1 = require("../services/technologies.service");
async function technologiesRoute(server) {
    // GET /api/technologies
    server.get("/", async (request, reply) => {
        try {
            const technologies = await technologies_service_1.technologiesService.findAll();
            return reply.send(technologies);
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al obtener las tecnologías" });
        }
    });
    // GET /api/technologies/:id
    server.get("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const technology = await technologies_service_1.technologiesService.findById(id);
            if (!technology) {
                return reply.status(404).send({ error: "Tecnología no encontrada" });
            }
            return reply.send(technology);
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al obtener la tecnología" });
        }
    });
    // POST /api/technologies
    server.post("/", async (request, reply) => {
        try {
            const body = request.body;
            const technology = await technologies_service_1.technologiesService.create(body);
            return reply.status(201).send(technology);
        }
        catch (error) {
            server.log.error(error);
            return reply.status(500).send({ error: "Error al crear la tecnología" });
        }
    });
    // PUT /api/technologies/:id
    server.put("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const body = request.body;
            const technology = await technologies_service_1.technologiesService.update(id, body);
            return reply.send(technology);
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al actualizar la tecnología" });
        }
    });
    // DELETE /api/technologies/:id
    server.delete("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            await technologies_service_1.technologiesService.remove(id);
            return reply.status(204).send();
        }
        catch (error) {
            server.log.error(error);
            return reply.status(500).send({ error: "Error al eliminar la tecnología" });
        }
    });
}
