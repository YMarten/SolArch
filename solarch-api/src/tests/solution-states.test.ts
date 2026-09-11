import assert from "node:assert/strict"
import { test } from "node:test"
import Fastify from "fastify"
import { solutionsRoute } from "../routes/solutions.route"
import { solutionsService } from "../services/solutions.service"

test("solution states: validate requests before persistence", async () => {
  const app = Fastify()
  await app.register(solutionsRoute, { prefix: "/api/solutions" })
  const create = solutionsService.create
  const update = solutionsService.update
  const calls: unknown[] = []
  solutionsService.create = async data => {
    calls.push(data)
    return { id: "test", ...data } as Awaited<ReturnType<typeof create>>
  }
  solutionsService.update = async (id, data) => {
    calls.push(data)
    return { id, ...data } as Awaited<ReturnType<typeof update>>
  }
  try {
    for (const method of ["POST", "PUT"] as const) {
      for (const hostingMode of ["ON_PREMISE", "CLOUD_COMPANY", "EXTERNAL", "HYBRID", "UNKNOWN"]) {
        const response = await app.inject({
          method, url: method === "POST" ? "/api/solutions" : "/api/solutions/test",
          payload: { status: "ACTIVE", hostingMode },
        })
        assert.equal(response.statusCode, method === "POST" ? 201 : 200)
        assert.equal(response.json().hostingMode, hostingMode)
      }
      for (const hostingMode of ["SAAS", "PROVIDER_HOSTED", "CLOUD", "INTERNAL_INFRASTRUCTURE", "VENDOR_INFRASTRUCTURE", "INVALID", null]) {
        const count = calls.length
        const response = await app.inject({
          method, url: method === "POST" ? "/api/solutions" : "/api/solutions/test",
          payload: { status: "ACTIVE", hostingMode },
        })
        assert.equal(response.statusCode, 400)
        assert.equal(calls.length, count)
      }
    }
    for (const method of ["POST", "PUT"] as const) {
      for (const managementModel of ["COMPANY_MANAGED", "PROVIDER_MANAGED", "SHARED_MANAGEMENT", "UNKNOWN"]) {
        for (const hostingMode of ["ON_PREMISE", "CLOUD_COMPANY", "EXTERNAL", "HYBRID", "UNKNOWN"]) {
          const response = await app.inject({
            method, url: method === "POST" ? "/api/solutions" : "/api/solutions/test",
            payload: { status: "ACTIVE", hostingMode, managementModel },
          })
          assert.equal(response.statusCode, method === "POST" ? 201 : 200)
          assert.equal(response.json().managementModel, managementModel)
          assert.equal(response.json().hostingMode, hostingMode)
        }
      }
      for (const managementModel of ["INVALID", "SAAS", "", null]) {
        const count = calls.length
        const response = await app.inject({
          method, url: method === "POST" ? "/api/solutions" : "/api/solutions/test",
          payload: { status: "ACTIVE", managementModel },
        })
        assert.equal(response.statusCode, 400)
        assert.equal(calls.length, count)
      }
    }
    for (const usageStatus of ["IN_USE", "LIMITED_USE", "NOT_IN_USE", null]) {
      const response = await app.inject({ method: "POST", url: "/api/solutions", payload: {
        name: "Test", status: "RETIRED", usageStatus,
      } })
      assert.equal(response.statusCode, 201)
      assert.equal(response.json().status, "RETIRED")
      assert.equal(response.json().usageStatus, usageStatus)
    }
    for (const method of ["POST", "PUT"] as const) {
      for (const payload of [
        { status: "RETIRED", usageStatus: "IN_SUBSTITUTION" },
        { status: "ACTIVE", usageStatus: "IN_IMPLEMENTATION" },
        { status: "ACTIVE", usageStatus: "OUT_OF_USE" },
        { status: "INVALID" },
        { status: null },
        { status: "ACTIVE", legacyUsageStatus: "tampered" },
      ]) {
        const count = calls.length
        const response = await app.inject({
          method, url: method === "POST" ? "/api/solutions" : "/api/solutions/test", payload,
        })
        assert.equal(response.statusCode, 400)
        assert.equal(calls.length, count)
      }
    }
    const response = await app.inject({ method: "PUT", url: "/api/solutions/test", payload: { status: "RETIRED" } })
    assert.equal(response.statusCode, 200)
    assert.deepEqual(calls[calls.length - 1], { status: "RETIRED" })
  } finally {
    solutionsService.create = create
    solutionsService.update = update
    await app.close()
  }
})
