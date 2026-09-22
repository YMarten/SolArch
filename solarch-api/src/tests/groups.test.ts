import assert from "node:assert/strict"
import { randomUUID } from "node:crypto"
import Fastify from "fastify"
import { groupsRoute } from "../routes/groups.route"
import { prisma } from "../prisma"

// Integration checks use isolated records and always clean up their own fixtures.
export async function testGroups() {
  const server = Fastify()
  await server.register(groupsRoute, { prefix: "/api/groups" })
  const suffix = randomUUID()
  const ids: string[] = []
  let solutionId: string | undefined
  try {
    const solution = await prisma.solution.create({ data: {
      name: `Group test ${suffix}`, status: "ACTIVE", type: "WEB", role: "SATELLITE",
      criticality: "LOW", origin: "INTERNAL", owner: "Automated test", tags: [],
    } })
    solutionId = solution.id
    const request = async (method: "GET" | "POST" | "PUT" | "DELETE", path: string, status: number, payload?: object) => {
      const response = await server.inject({ method, url: `/api/groups${path}`, ...(payload ? { payload } : {}) })
      assert.equal(response.statusCode, status, `${method} ${path}: ${response.body}`)
      return response
    }
    await request("POST", "/", 400, { name: "   " })
    await request("GET", "/missing-group", 404)
    for (const name of [`Project A ${suffix}`, `Project B ${suffix}`]) {
      const response = await request("POST", "/", 201, { name, description: "Test project" })
      ids.push(response.json().id)
    }
    await request("POST", "/", 409, { name: `Project A ${suffix}` })
    await request("PUT", `/${ids[0]}`, 200, { description: "Updated" })
    assert.equal((await request("GET", `/${ids[0]}`, 200)).json().description, "Updated")
    await request("PUT", `/${ids[0]}/members/${solution.id}`, 400, { participation: "INVALID" })
    await request("PUT", `/${ids[0]}/members/missing-solution`, 404, { participation: "NEW" })
    await request("PUT", `/${ids[0]}/members/${solution.id}`, 200, { participation: "NEW" })
    await request("PUT", `/${ids[1]}/members/${solution.id}`, 200, { participation: "REUSED" })
    await request("PUT", `/${ids[0]}/members/${solution.id}`, 200, { participation: "ADAPTED" })
    const first = (await request("GET", `/${ids[0]}`, 200)).json()
    assert.equal(first.members.length, 1, "Repeated membership must not duplicate the solution")
    assert.equal(first.members[0].participation, "ADAPTED")
    const second = (await request("GET", `/${ids[1]}`, 200)).json()
    assert.equal(second.members[0].participation, "REUSED", "Participation is specific to each group")
    assert.equal((await request("GET", `/?solutionId=${solution.id}`, 200)).json().length, 2)
    await request("DELETE", `/${ids[0]}/members/${solution.id}`, 204)
    assert.equal((await request("GET", `/${ids[0]}`, 200)).json().members.length, 0)
    await request("DELETE", `/${ids[1]}`, 204)
    assert.ok(await prisma.solution.findUnique({ where: { id: solution.id } }), "Deleting a group must preserve its solutions")
    assert.equal(await prisma.solutionGroupMember.count({ where: { groupId: ids[1] } }), 0)
    console.log("Group integration checks passed")
  } finally {
    try {
      if (ids.length) await prisma.solutionGroup.deleteMany({ where: { id: { in: ids } } })
      if (solutionId) await prisma.solution.delete({ where: { id: solutionId } })
    } finally {
      await server.close()
    }
  }
}

if (require.main === module) {
  testGroups().catch(error => { console.error(error); process.exitCode = 1 }).finally(() => prisma.$disconnect())
}
