"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.areasRoute = areasRoute;
const areas_service_1 = require("../services/areas.service");
async function areasRoute(server) {
    server.get("/", async (request, reply) => {
        try {
            const areas = await areas_service_1.areasService.findAll();
            return reply.send(areas);
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al obtener las áreas" });
        }
    });
    server.get("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const area = await areas_service_1.areasService.findById(id);
            if (!area)
                return reply.status(404).send({ error: "Área no encontrada" });
            return reply.send(area);
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al obtener el área" });
        }
    });
    server.post("/", async (request, reply) => {
        try {
            const area = await areas_service_1.areasService.create(request.body);
            return reply.status(201).send(area);
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al crear el área" });
        }
    });
    server.put("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const area = await areas_service_1.areasService.update(id, request.body);
            return reply.send(area);
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al actualizar el área" });
        }
    });
    server.delete("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            await areas_service_1.areasService.remove(id);
            return reply.status(204).send();
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al eliminar el área" });
        }
    });
}
