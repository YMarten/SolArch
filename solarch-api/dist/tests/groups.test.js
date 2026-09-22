"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testGroups = testGroups;
const strict_1 = __importDefault(require("node:assert/strict"));
const node_crypto_1 = require("node:crypto");
const fastify_1 = __importDefault(require("fastify"));
const groups_route_1 = require("../routes/groups.route");
const prisma_1 = require("../prisma");
// Integration checks use isolated records and always clean up their own fixtures.
async function testGroups() {
    const server = (0, fastify_1.default)();
    await server.register(groups_route_1.groupsRoute, { prefix: "/api/groups" });
    const suffix = (0, node_crypto_1.randomUUID)();
    const ids = [];
    let solutionId;
    try {
        const solution = await prisma_1.prisma.solution.create({ data: {
                name: `Group test ${suffix}`, status: "ACTIVE", type: "WEB", role: "SATELLITE",
                criticality: "LOW", origin: "INTERNAL", owner: "Automated test", tags: [],
            } });
        solutionId = solution.id;
        const request = async (method, path, status, payload) => {
            const response = await server.inject({ method, url: `/api/groups${path}`, ...(payload ? { payload } : {}) });
            strict_1.default.equal(response.statusCode, status, `${method} ${path}: ${response.body}`);
            return response;
        };
        await request("POST", "/", 400, { name: "   " });
        await request("GET", "/missing-group", 404);
        for (const name of [`Project A ${suffix}`, `Project B ${suffix}`]) {
            const response = await request("POST", "/", 201, { name, description: "Test project" });
            ids.push(response.json().id);
        }
        await request("POST", "/", 409, { name: `Project A ${suffix}` });
        await request("PUT", `/${ids[0]}`, 200, { description: "Updated" });
        strict_1.default.equal((await request("GET", `/${ids[0]}`, 200)).json().description, "Updated");
        await request("PUT", `/${ids[0]}/members/${solution.id}`, 400, { participation: "INVALID" });
        await request("PUT", `/${ids[0]}/members/missing-solution`, 404, { participation: "NEW" });
        await request("PUT", `/${ids[0]}/members/${solution.id}`, 200, { participation: "NEW" });
        await request("PUT", `/${ids[1]}/members/${solution.id}`, 200, { participation: "REUSED" });
        await request("PUT", `/${ids[0]}/members/${solution.id}`, 200, { participation: "ADAPTED" });
        const first = (await request("GET", `/${ids[0]}`, 200)).json();
        strict_1.default.equal(first.members.length, 1, "Repeated membership must not duplicate the solution");
        strict_1.default.equal(first.members[0].participation, "ADAPTED");
        const second = (await request("GET", `/${ids[1]}`, 200)).json();
        strict_1.default.equal(second.members[0].participation, "REUSED", "Participation is specific to each group");
        strict_1.default.equal((await request("GET", `/?solutionId=${solution.id}`, 200)).json().length, 2);
        await request("DELETE", `/${ids[0]}/members/${solution.id}`, 204);
        strict_1.default.equal((await request("GET", `/${ids[0]}`, 200)).json().members.length, 0);
        await request("DELETE", `/${ids[1]}`, 204);
        strict_1.default.ok(await prisma_1.prisma.solution.findUnique({ where: { id: solution.id } }), "Deleting a group must preserve its solutions");
        strict_1.default.equal(await prisma_1.prisma.solutionGroupMember.count({ where: { groupId: ids[1] } }), 0);
        console.log("Group integration checks passed");
    }
    finally {
        try {
            if (ids.length)
                await prisma_1.prisma.solutionGroup.deleteMany({ where: { id: { in: ids } } });
            if (solutionId)
                await prisma_1.prisma.solution.delete({ where: { id: solutionId } });
        }
        finally {
            await server.close();
        }
    }
}
if (require.main === module) {
    testGroups().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => prisma_1.prisma.$disconnect());
}
