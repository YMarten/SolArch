import assert from "node:assert/strict"
import Fastify from "fastify"
import { Prisma } from "@prisma/client"
import { groupsRoute } from "../routes/groups.route"
import { groupsService } from "../services/groups.service"

async function main() {
  const server = Fastify()
  await server.register(groupsRoute, { prefix: "/api/groups" })
  const original = { ...groupsService }
  try {
    let calls = 0
    groupsService.create = async () => { calls++; throw new Error("Unexpected mutation") }
    groupsService.setMember = async () => { calls++; throw new Error("Unexpected mutation") }
    for (const payload of [{}, { name: "" }, { name: "   " }, { name: "x".repeat(201) }]) {
      const result = await server.inject({ method: "POST", url: "/api/groups", payload })
      assert.equal(result.statusCode, 400)
      assert.ok(result.json().error)
    }
    for (const payload of [{}, { participation: "OTHER" }]) {
      const result = await server.inject({ method: "PUT", url: "/api/groups/g/members/s", payload })
      assert.equal(result.statusCode, 400)
    }
    assert.equal(calls, 0, "Invalid payloads must never reach mutation services")
    groupsService.findById = async () => null
    assert.equal((await server.inject({ method: "GET", url: "/api/groups/missing" })).statusCode, 404)
    for (const [code, status] of [["P2002", 409], ["P2003", 404], ["P2025", 404]] as const) {
      groupsService.create = async () => { throw new Prisma.PrismaClientKnownRequestError("Database detail", { code, clientVersion: Prisma.prismaVersion.client }) }
      const result = await server.inject({ method: "POST", url: "/api/groups", payload: { name: "Example" } })
      assert.equal(result.statusCode, status)
      assert.ok(!result.body.includes("Database detail"))
    }
    groupsService.create = async () => { throw new Error("private database detail") }
    const failed = await server.inject({ method: "POST", url: "/api/groups", payload: { name: "Example" } })
    assert.equal(failed.statusCode, 500)
    assert.ok(!failed.body.includes("private database detail"))
    console.log("Group route validation and error handling checks passed")
  } finally {
    Object.assign(groupsService, original)
    await server.close()
  }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
