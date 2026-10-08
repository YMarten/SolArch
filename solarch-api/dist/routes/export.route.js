"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportRoute = exportRoute;
const export_service_1 = require("../services/export.service");
async function exportRoute(server) {
    server.get("/", async (request, reply) => {
        reply.header("Cache-Control", "no-store");
        try {
            return reply.send(await export_service_1.exportService.generate());
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({ error: "No se pudo generar el JSON. Intenta nuevamente." });
        }
    });
}
