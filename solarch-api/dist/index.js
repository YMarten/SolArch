"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const helmet_1 = __importDefault(require("@fastify/helmet"));
const solutions_route_1 = require("./routes/solutions.route");
const technologies_route_1 = require("./routes/technologies.route");
const domains_route_1 = require("./routes/domains.route");
const areas_route_1 = require("./routes/areas.route");
const capabilities_route_1 = require("./routes/capabilities.route");
const connections_route_1 = require("./routes/connections.route");
const attachments_route_1 = require("./routes/attachments.route");
const environments_route_1 = require("./routes/environments.route");
const reviews_route_1 = require("./routes/reviews.route");
const prisma_1 = require("./prisma");
const server = (0, fastify_1.default)({
    logger: true
});
// Plugins
server.register(cors_1.default, {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
});
server.register(helmet_1.default);
// Health check
server.get("/health", async () => {
    return { status: "ok" };
});
// Arrancar el servidor
const start = async () => {
    try {
        // Ejecutar migraciones al arrancar
        server.log.info("Validando conexion con base de datos");
        await prisma_1.prisma.$executeRaw `SELECT 1`;
        server.log.info("Base de datos conectada");
        const port = Number(process.env.PORT) || 3001;
        await server.listen({ port, host: "0.0.0.0" });
    }
    catch (error) {
        server.log.error(error);
        process.exit(1);
    }
};
server.addContentTypeParser("application/json", { parseAs: "string" }, function (req, body, done) {
    if (!body) {
        done(null, null);
        return;
    }
    try {
        const json = JSON.parse(body);
        done(null, json);
    }
    catch (err) {
        err.statusCode = 400;
        done(err, undefined);
    }
});
//Rutas
server.register(solutions_route_1.solutionsRoute, { prefix: "/api/solutions" });
server.register(technologies_route_1.technologiesRoute, { prefix: "/api/technologies" });
server.register(domains_route_1.domainsRoute, { prefix: "/api/domains" });
server.register(areas_route_1.areasRoute, { prefix: "/api/areas" });
server.register(capabilities_route_1.capabilitiesRoute, { prefix: "/api/capabilities" });
server.register(connections_route_1.connectionsRoute, { prefix: "/api/connections" });
server.register(attachments_route_1.attachmentsRoute, { prefix: "/api/attachments" });
server.register(environments_route_1.environmentsRoute, { prefix: "/api/environments" });
server.register(reviews_route_1.reviewsRoute, { prefix: "/api/reviews" });
start();
