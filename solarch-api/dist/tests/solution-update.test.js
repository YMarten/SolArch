"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const prisma_1 = require("../prisma");
const solutions_service_1 = require("../services/solutions.service");
(0, node_test_1.test)("PUT normalizes empty dates and preserves omitted dates", async () => {
    const original = prisma_1.prisma.solution.update;
    const captured = [];
    prisma_1.prisma.solution.update = (async (args) => {
        captured.push(args.data);
        return { id: "test" };
    });
    try {
        for (const value of ["", null, "2026-09-09", undefined]) {
            await solutions_service_1.solutionsService.update("test", { lastDeploy: value });
        }
        const data = captured;
        strict_1.default.equal(data[0].lastDeploy, null);
        strict_1.default.equal(data[1].lastDeploy, null);
        strict_1.default.equal(data[2].lastDeploy?.toISOString(), "2026-09-09T00:00:00.000Z");
        strict_1.default.equal(data[3].lastDeploy, undefined);
    }
    finally {
        prisma_1.prisma.solution.update = original;
    }
});
