"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const fastify_1 = __importDefault(require("fastify"));
const solutions_route_1 = require("../routes/solutions.route");
const solutions_service_1 = require("../services/solutions.service");
(0, node_test_1.test)("solution states: validate requests before persistence", async () => {
    const app = (0, fastify_1.default)();
    await app.register(solutions_route_1.solutionsRoute, { prefix: "/api/solutions" });
    const create = solutions_service_1.solutionsService.create;
    const update = solutions_service_1.solutionsService.update;
    const calls = [];
    solutions_service_1.solutionsService.create = async (data) => {
        calls.push(data);
        return { id: "test", ...data };
    };
    solutions_service_1.solutionsService.update = async (id, data) => {
        calls.push(data);
        return { id, ...data };
    };
    try {
        for (const method of ["POST", "PUT"]) {
            for (const role of ["CORE_TRANSACTIONAL", "SATELLITE", "INTEGRATION", "DATA_ANALYTICS"]) {
                const response = await app.inject({
                    method, url: method === "POST" ? "/api/solutions" : "/api/solutions/test",
                    payload: { status: "ACTIVE", role },
                });
                strict_1.default.equal(response.statusCode, method === "POST" ? 201 : 200);
                strict_1.default.equal(response.json().role, role);
            }
            for (const role of ["INTERACTION_CHANNEL", "INVALID", "", null]) {
                const count = calls.length;
                const response = await app.inject({
                    method, url: method === "POST" ? "/api/solutions" : "/api/solutions/test",
                    payload: { status: "ACTIVE", role },
                });
                strict_1.default.equal(response.statusCode, 400);
                strict_1.default.equal(calls.length, count);
            }
        }
        for (const method of ["POST", "PUT"]) {
            for (const hostingMode of ["ON_PREMISE", "CLOUD_COMPANY", "EXTERNAL", "HYBRID", "UNKNOWN"]) {
                const response = await app.inject({
                    method, url: method === "POST" ? "/api/solutions" : "/api/solutions/test",
                    payload: { status: "ACTIVE", hostingMode },
                });
                strict_1.default.equal(response.statusCode, method === "POST" ? 201 : 200);
                strict_1.default.equal(response.json().hostingMode, hostingMode);
            }
            for (const hostingMode of ["SAAS", "PROVIDER_HOSTED", "CLOUD", "INTERNAL_INFRASTRUCTURE", "VENDOR_INFRASTRUCTURE", "INVALID", null]) {
                const count = calls.length;
                const response = await app.inject({
                    method, url: method === "POST" ? "/api/solutions" : "/api/solutions/test",
                    payload: { status: "ACTIVE", hostingMode },
                });
                strict_1.default.equal(response.statusCode, 400);
                strict_1.default.equal(calls.length, count);
            }
        }
        for (const method of ["POST", "PUT"]) {
            for (const managementModel of ["COMPANY_MANAGED", "PROVIDER_MANAGED", "SHARED_MANAGEMENT", "UNKNOWN"]) {
                for (const hostingMode of ["ON_PREMISE", "CLOUD_COMPANY", "EXTERNAL", "HYBRID", "UNKNOWN"]) {
                    const response = await app.inject({
                        method, url: method === "POST" ? "/api/solutions" : "/api/solutions/test",
                        payload: { status: "ACTIVE", hostingMode, managementModel },
                    });
                    strict_1.default.equal(response.statusCode, method === "POST" ? 201 : 200);
                    strict_1.default.equal(response.json().managementModel, managementModel);
                    strict_1.default.equal(response.json().hostingMode, hostingMode);
                }
            }
            for (const managementModel of ["INVALID", "SAAS", "", null]) {
                const count = calls.length;
                const response = await app.inject({
                    method, url: method === "POST" ? "/api/solutions" : "/api/solutions/test",
                    payload: { status: "ACTIVE", managementModel },
                });
                strict_1.default.equal(response.statusCode, 400);
                strict_1.default.equal(calls.length, count);
            }
        }
        for (const usageStatus of ["IN_USE", "LIMITED_USE", "NOT_IN_USE", null]) {
            const response = await app.inject({ method: "POST", url: "/api/solutions", payload: {
                    name: "Test", status: "RETIRED", usageStatus,
                } });
            strict_1.default.equal(response.statusCode, 201);
            strict_1.default.equal(response.json().status, "RETIRED");
            strict_1.default.equal(response.json().usageStatus, usageStatus);
        }
        for (const method of ["POST", "PUT"]) {
            for (const payload of [
                { status: "RETIRED", usageStatus: "IN_SUBSTITUTION" },
                { status: "ACTIVE", usageStatus: "IN_IMPLEMENTATION" },
                { status: "ACTIVE", usageStatus: "OUT_OF_USE" },
                { status: "INVALID" },
                { status: null },
                { status: "ACTIVE", legacyUsageStatus: "tampered" },
            ]) {
                const count = calls.length;
                const response = await app.inject({
                    method, url: method === "POST" ? "/api/solutions" : "/api/solutions/test", payload,
                });
                strict_1.default.equal(response.statusCode, 400);
                strict_1.default.equal(calls.length, count);
            }
        }
        const response = await app.inject({ method: "PUT", url: "/api/solutions/test", payload: { status: "RETIRED" } });
        strict_1.default.equal(response.statusCode, 200);
        strict_1.default.deepEqual(calls[calls.length - 1], { status: "RETIRED" });
    }
    finally {
        solutions_service_1.solutionsService.create = create;
        solutions_service_1.solutionsService.update = update;
        await app.close();
    }
});
