"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capabilitiesRoute = capabilitiesRoute;
const capabilities_service_1 = require("../services/capabilities.service");
async function capabilitiesRoute(server) {
    server.get("/", async (request, reply) => {
        try {
            const capabilities = await capabilities_service_1.capabilitiesService.findAll();
            return reply.send(capabilities);
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al obtener las capacidades" });
        }
    });
    server.get("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const capability = await capabilities_service_1.capabilitiesService.findById(id);
            if (!capability)
                return reply.status(404).send({ error: "Capacidad no encontrada" });
            return reply.send(capability);
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al obtener la capacidad" });
        }
    });
    server.post("/", async (request, reply) => {
        try {
            const capability = await capabilities_service_1.capabilitiesService.create(request.body);
            return reply.status(201).send(capability);
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al crear la capacidad" });
        }
    });
    server.put("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const capability = await capabilities_service_1.capabilitiesService.update(id, request.body);
            return reply.send(capability);
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al actualizar la capacidad" });
        }
    });
    server.delete("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            await capabilities_service_1.capabilitiesService.remove(id);
            return reply.status(204).send();
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al eliminar la capacidad" });
        }
    });
}
