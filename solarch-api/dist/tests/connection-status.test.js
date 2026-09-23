"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_crypto_1 = require("node:crypto");
const fastify_1 = __importDefault(require("fastify"));
const prisma_1 = require("../prisma");
const connections_route_1 = require("../routes/connections.route");
async function main() {
    const server = (0, fastify_1.default)();
    await server.register(connections_route_1.connectionsRoute, { prefix: "/api/connections" });
    const ids = [];
    try {
        for (const label of ["Caller", "Callee"]) {
            const solution = await prisma_1.prisma.solution.create({ data: {
                    name: `Connection status test ${label} ${(0, node_crypto_1.randomUUID)()}`, owner: "Test",
                    status: "ACTIVE", type: "API", role: "INTEGRATION", criticality: "LOW", origin: "INTERNAL", tags: [],
                } });
            ids.push(solution.id);
        }
        const created = await server.inject({ method: "POST", url: "/api/connections", payload: { fromId: ids[0], toId: ids[1], type: "REST" } });
        strict_1.default.equal(created.statusCode, 201, created.body);
        strict_1.default.equal(created.json().isActive, true);
        const url = `/api/connections/${created.json().id}`;
        for (const isActive of [false, true]) {
            const updated = await server.inject({ method: "PUT", url, payload: { isActive } });
            strict_1.default.equal(updated.statusCode, 200, updated.body);
            strict_1.default.equal((await server.inject({ method: "GET", url })).json().isActive, isActive);
        }
        await server.inject({ method: "PUT", url, payload: { isActive: false } });
        await server.inject({ method: "PUT", url, payload: { description: "Preserve inactive state" } });
        strict_1.default.equal((await server.inject({ method: "GET", url })).json().isActive, false);
        const invalid = await server.inject({ method: "PUT", url, payload: { isActive: "invalid" } });
        strict_1.default.equal(invalid.statusCode, 400);
        console.log("Connection status: default active, deactivate/reactivate, persistence and validation passed");
    }
    finally {
        if (ids.length)
            await prisma_1.prisma.solution.deleteMany({ where: { id: { in: ids } } });
        await server.close();
        await prisma_1.prisma.$disconnect();
    }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
