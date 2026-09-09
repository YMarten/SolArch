"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewsRoute = reviewsRoute;
const reviews_service_1 = require("../services/reviews.service");
async function reviewsRoute(server) {
    // GET /api/reviews?solutionId=xxx
    server.get("/", async (request, reply) => {
        try {
            const { solutionId } = request.query;
            if (!solutionId) {
                return reply.status(400).send({ error: "solutionId es requerido" });
            }
            const reviews = await reviews_service_1.reviewsService.findBySolution(solutionId);
            return reply.send(reviews);
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al obtener las revisiones" });
        }
    });
    // GET /api/reviews/actions/pending
    server.get("/actions/pending", async (request, reply) => {
        try {
            const actions = await reviews_service_1.reviewsService.findPendingActions();
            return reply.send(actions);
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al obtener las acciones pendientes" });
        }
    });
    // GET /api/reviews/:id
    server.get("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const review = await reviews_service_1.reviewsService.findById(id);
            if (!review)
                return reply.status(404).send({ error: "Revisión no encontrada" });
            return reply.send(review);
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al obtener la revisión" });
        }
    });
    // POST /api/reviews
    server.post("/", async (request, reply) => {
        try {
            const review = await reviews_service_1.reviewsService.create(request.body);
            return reply.status(201).send(review);
        }
        catch (error) {
            server.log.error(error);
            return reply.status(500).send({ error: "Error al crear la revisión" });
        }
    });
    // PUT /api/reviews/:id
    server.put("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const review = await reviews_service_1.reviewsService.update(id, request.body);
            return reply.send(review);
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al actualizar la revisión" });
        }
    });
    // DELETE /api/reviews/:id
    server.delete("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            await reviews_service_1.reviewsService.remove(id);
            return reply.status(204).send();
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al eliminar la revisión" });
        }
    });
    // PATCH /api/reviews/actions/:actionId
    server.patch("/actions/:actionId", async (request, reply) => {
        try {
            const { actionId } = request.params;
            const action = await reviews_service_1.reviewsService.updateAction(actionId, request.body);
            return reply.send(action);
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al actualizar la acción" });
        }
    });
}
