"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachmentsRoute = attachmentsRoute;
const attachments_service_1 = require("../services/attachments.service");
async function attachmentsRoute(server) {
    // GET /api/attachments?solutionId=xxx
    server.get("/", async (request, reply) => {
        try {
            const { solutionId } = request.query;
            if (!solutionId) {
                return reply.status(400).send({ error: "solutionId es requerido" });
            }
            const attachments = await attachments_service_1.attachmentsService.findBySolution(solutionId);
            return reply.send(attachments);
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al obtener los adjuntos" });
        }
    });
    // GET /api/attachments/:id
    server.get("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const attachment = await attachments_service_1.attachmentsService.findById(id);
            if (!attachment)
                return reply.status(404).send({ error: "Adjunto no encontrado" });
            return reply.send(attachment);
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al obtener el adjunto" });
        }
    });
    // POST /api/attachments
    server.post("/", async (request, reply) => {
        try {
            const attachment = await attachments_service_1.attachmentsService.create(request.body);
            return reply.status(201).send(attachment);
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al crear el adjunto" });
        }
    });
    // PUT /api/attachments/:id
    server.put("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const attachment = await attachments_service_1.attachmentsService.update(id, request.body);
            return reply.send(attachment);
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al actualizar el adjunto" });
        }
    });
    // DELETE /api/attachments/:id
    server.delete("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            await attachments_service_1.attachmentsService.remove(id);
            return reply.status(204).send();
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al eliminar el adjunto" });
        }
    });
}
