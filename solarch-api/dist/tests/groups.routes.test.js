"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const fastify_1 = __importDefault(require("fastify"));
const client_1 = require("@prisma/client");
const groups_route_1 = require("../routes/groups.route");
const groups_service_1 = require("../services/groups.service");
async function main() {
    const server = (0, fastify_1.default)();
    await server.register(groups_route_1.groupsRoute, { prefix: "/api/groups" });
    const original = { ...groups_service_1.groupsService };
    try {
        let calls = 0;
        groups_service_1.groupsService.create = async () => { calls++; throw new Error("Unexpected mutation"); };
        groups_service_1.groupsService.setMember = async () => { calls++; throw new Error("Unexpected mutation"); };
        for (const payload of [{}, { name: "" }, { name: "   " }, { name: "x".repeat(201) }]) {
            const result = await server.inject({ method: "POST", url: "/api/groups", payload });
            strict_1.default.equal(result.statusCode, 400);
            strict_1.default.ok(result.json().error);
        }
        for (const payload of [{}, { participation: "OTHER" }]) {
            const result = await server.inject({ method: "PUT", url: "/api/groups/g/members/s", payload });
            strict_1.default.equal(result.statusCode, 400);
        }
        strict_1.default.equal(calls, 0, "Invalid payloads must never reach mutation services");
        groups_service_1.groupsService.findById = async () => null;
        strict_1.default.equal((await server.inject({ method: "GET", url: "/api/groups/missing" })).statusCode, 404);
        for (const [code, status] of [["P2002", 409], ["P2003", 404], ["P2025", 404]]) {
            groups_service_1.groupsService.create = async () => { throw new client_1.Prisma.PrismaClientKnownRequestError("Database detail", { code, clientVersion: client_1.Prisma.prismaVersion.client }); };
            const result = await server.inject({ method: "POST", url: "/api/groups", payload: { name: "Example" } });
            strict_1.default.equal(result.statusCode, status);
            strict_1.default.ok(!result.body.includes("Database detail"));
        }
        groups_service_1.groupsService.create = async () => { throw new Error("private database detail"); };
        const failed = await server.inject({ method: "POST", url: "/api/groups", payload: { name: "Example" } });
        strict_1.default.equal(failed.statusCode, 500);
        strict_1.default.ok(!failed.body.includes("private database detail"));
        console.log("Group route validation and error handling checks passed");
    }
    finally {
        Object.assign(groups_service_1.groupsService, original);
        await server.close();
    }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
