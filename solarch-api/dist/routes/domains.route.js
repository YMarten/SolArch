"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.domainsRoute = domainsRoute;
const domains_service_1 = require("../services/domains.service");
async function domainsRoute(server) {
    server.get("/", async (request, reply) => {
        try {
            const domains = await domains_service_1.domainsService.findAll();
            return reply.send(domains);
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al obtener los dominios" });
        }
    });
    server.get("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const domain = await domains_service_1.domainsService.findById(id);
            if (!domain)
                return reply.status(404).send({ error: "Dominio no encontrado" });
            return reply.send(domain);
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al obtener el dominio" });
        }
    });
    server.post("/", async (request, reply) => {
        try {
            const domain = await domains_service_1.domainsService.create(request.body);
            return reply.status(201).send(domain);
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al crear el dominio" });
        }
    });
    server.put("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const domain = await domains_service_1.domainsService.update(id, request.body);
            return reply.send(domain);
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al actualizar el dominio" });
        }
    });
    server.delete("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            await domains_service_1.domainsService.remove(id);
            return reply.status(204).send();
        }
        catch (error) {
            return reply.status(500).send({ error: "Error al eliminar el dominio" });
        }
    });
}
