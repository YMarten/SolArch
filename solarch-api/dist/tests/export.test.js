"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const client_1 = require("@prisma/client");
const fastify_1 = __importDefault(require("fastify"));
const export_route_1 = require("../routes/export.route");
const prisma_1 = require("../prisma");
async function main() {
    const server = (0, fastify_1.default)();
    await server.register(export_route_1.exportRoute, { prefix: "/api/export" });
    try {
        const response = await server.inject({ method: "GET", url: "/api/export" });
        strict_1.default.equal(response.statusCode, 200, response.body);
        strict_1.default.equal(response.headers["cache-control"], "no-store");
        const data = response.json();
        strict_1.default.equal(data.schemaVersion, "1.1");
        strict_1.default.ok(Number.isFinite(Date.parse(data.exportedAt)));
        const solutions = data.solutions;
        const solutionById = new Map(solutions.map(solution => [solution.id, solution]));
        strict_1.default.equal(new Set(data.connections.map(connection => connection.id)).size, data.connections.length);
        for (const connection of data.connections) {
            strict_1.default.equal(typeof connection.isActive, "boolean");
            strict_1.default.equal(connection.from.id, connection.fromId);
            strict_1.default.equal(connection.to.id, connection.toId);
            strict_1.default.equal(connection.from.name, solutionById.get(connection.fromId)?.name);
            strict_1.default.equal(connection.to.name, solutionById.get(connection.toId)?.name);
            if (connection.intermediarySolutionId === null) {
                strict_1.default.equal(connection.intermediarySolution, null);
            }
            else {
                strict_1.default.equal(connection.intermediarySolution?.id, connection.intermediarySolutionId);
                strict_1.default.ok(solutionById.has(connection.intermediarySolutionId));
                strict_1.default.equal(connection.intermediarySolution?.name, solutionById.get(connection.intermediarySolutionId)?.name);
            }
        }
        const reviews = solutions.flatMap(solution => solution.archReviews);
        const tables = [
            ["Solution", solutions, () => prisma_1.prisma.solution.count()],
            ["Technology", data.catalogs.technologies, () => prisma_1.prisma.technology.count()],
            ["BusinessDomain", data.catalogs.domains, () => prisma_1.prisma.businessDomain.count()],
            ["BusinessCapability", data.catalogs.capabilities, () => prisma_1.prisma.businessCapability.count()],
            ["BusinessArea", data.catalogs.areas, () => prisma_1.prisma.businessArea.count()],
            ["SolutionGroup", data.groups, () => prisma_1.prisma.solutionGroup.count()],
            ["SolutionGroupMember", data.groups.flatMap(group => group.members), () => prisma_1.prisma.solutionGroupMember.count()],
            ["Connection", data.connections, () => prisma_1.prisma.connection.count()],
            ["TechnologyOnSolution", solutions.flatMap(solution => solution.technologies), () => prisma_1.prisma.technologyOnSolution.count()],
            ["DomainOnSolution", solutions.flatMap(solution => solution.domains), () => prisma_1.prisma.domainOnSolution.count()],
            ["CapabilityOnSolution", solutions.flatMap(solution => solution.capabilities), () => prisma_1.prisma.capabilityOnSolution.count()],
            ["AreaOnSolution", solutions.flatMap(solution => solution.areas), () => prisma_1.prisma.areaOnSolution.count()],
            ["Environment", solutions.flatMap(solution => solution.environments), () => prisma_1.prisma.environment.count()],
            ["Attachment", solutions.flatMap(solution => solution.attachments), () => prisma_1.prisma.attachment.count()],
            ["ArchReview", reviews, () => prisma_1.prisma.archReview.count()],
            ["ReviewDimension", reviews.flatMap(review => review.dimensions), () => prisma_1.prisma.reviewDimension.count()],
            ["ReviewAction", reviews.flatMap(review => review.actions), () => prisma_1.prisma.reviewAction.count()],
            ["ChangeLog", solutions.flatMap(solution => solution.changelog), () => prisma_1.prisma.changeLog.count()],
        ];
        for (const [modelName, records, count] of tables) {
            strict_1.default.equal(records.length, await count(), `${modelName}: missing records`);
            const model = client_1.Prisma.dmmf.datamodel.models.find(model => model.name === modelName);
            for (const record of records) {
                for (const field of model.fields.filter(field => field.kind !== "object")) {
                    strict_1.default.ok(Object.prototype.hasOwnProperty.call(record, field.name), `${modelName}.${field.name}: missing field`);
                }
            }
        }
        strict_1.default.equal(tables.length, client_1.Prisma.dmmf.datamodel.models.length, "Every model must be covered");
        console.log(`Export verified: ${solutions.length} solutions; all ${tables.length} models and stored fields covered. No records modified.`);
    }
    finally {
        await server.close();
        await prisma_1.prisma.$disconnect();
    }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
