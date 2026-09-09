"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.solutionsRoute = solutionsRoute;
const solutions_service_1 = require("../services/solutions.service");
async function solutionsRoute(server) {
    // GET /api/solutions
    server.get("/", async (request, reply) => {
        try {
            const solutions = await solutions_service_1.solutionsService.findAll();
            return reply.send(solutions);
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al obtener las soluciones" });
        }
    });
    // GET /api/solutions/:id
    server.get("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const solution = await solutions_service_1.solutionsService.findById(id);
            if (!solution) {
                return reply.status(404).send({ error: "Solución no encontrada" });
            }
            return reply.send(solution);
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al obtener la solución" });
        }
    });
    // POST /api/solutions
    server.post("/", async (request, reply) => {
        try {
            const body = request.body;
            const solution = await solutions_service_1.solutionsService.create(body);
            return reply.status(201).send(solution);
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al crear la solución" });
        }
    });
    // PUT /api/solutions/:id
    server.put("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const body = request.body;
            const solution = await solutions_service_1.solutionsService.update(id, body);
            return reply.send(solution);
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al actualizar la solución" });
        }
    });
    // DELETE /api/solutions/:id
    server.delete("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            await solutions_service_1.solutionsService.remove(id);
            return reply.status(204).send();
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al eliminar la solución" });
        }
    });
}
