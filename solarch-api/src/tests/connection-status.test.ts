import assert from "node:assert/strict"
import { randomUUID } from "node:crypto"
import Fastify from "fastify"
import { prisma } from "../prisma"
import { connectionsRoute } from "../routes/connections.route"

async function main() {
  const server = Fastify()
  await server.register(connectionsRoute, { prefix: "/api/connections" })
  const ids: string[] = []
  try {
    for (const label of ["Caller", "Callee"]) {
      const solution = await prisma.solution.create({ data: {
        name: `Connection status test ${label} ${randomUUID()}`, owner: "Test",
        status: "ACTIVE", type: "API", role: "INTEGRATION", criticality: "LOW", origin: "INTERNAL", tags: [],
      } })
      ids.push(solution.id)
    }
    const created = await server.inject({ method: "POST", url: "/api/connections", payload: { fromId: ids[0], toId: ids[1], type: "REST" } })
    assert.equal(created.statusCode, 201, created.body)
    assert.equal(created.json().isActive, true)
    const url = `/api/connections/${created.json().id}`
    for (const isActive of [false, true]) {
      const updated = await server.inject({ method: "PUT", url, payload: { isActive } })
      assert.equal(updated.statusCode, 200, updated.body)
      assert.equal((await server.inject({ method: "GET", url })).json().isActive, isActive)
    }
    await server.inject({ method: "PUT", url, payload: { isActive: false } })
    await server.inject({ method: "PUT", url, payload: { description: "Preserve inactive state" } })
    assert.equal((await server.inject({ method: "GET", url })).json().isActive, false)
    const invalid = await server.inject({ method: "PUT", url, payload: { isActive: "invalid" } })
    assert.equal(invalid.statusCode, 400)
    console.log("Connection status: default active, deactivate/reactivate, persistence and validation passed")
  } finally {
    if (ids.length) await prisma.solution.deleteMany({ where: { id: { in: ids } } })
    await server.close()
    await prisma.$disconnect()
  }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
