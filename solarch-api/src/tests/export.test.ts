import assert from "node:assert/strict"
import { Prisma } from "@prisma/client"
import Fastify from "fastify"
import { exportRoute } from "../routes/export.route"
import { exportService } from "../services/export.service"
import { prisma } from "../prisma"

async function main() {
  const server = Fastify()
  await server.register(exportRoute, { prefix: "/api/export" })
  try {
    const response = await server.inject({ method: "GET", url: "/api/export" })
    assert.equal(response.statusCode, 200, response.body)
    assert.equal(response.headers["cache-control"], "no-store")
    const data = response.json() as Awaited<ReturnType<typeof exportService.generate>>
    assert.equal(data.schemaVersion, "1.1")
    assert.ok(Number.isFinite(Date.parse(data.exportedAt)))
    const solutions = data.solutions
    const solutionById = new Map(solutions.map(solution => [solution.id, solution]))
    assert.equal(new Set(data.connections.map(connection => connection.id)).size, data.connections.length)
    for (const connection of data.connections) {
      assert.equal(typeof connection.isActive, "boolean")
      assert.equal(connection.from.id, connection.fromId)
      assert.equal(connection.to.id, connection.toId)
      assert.equal(connection.from.name, solutionById.get(connection.fromId)?.name)
      assert.equal(connection.to.name, solutionById.get(connection.toId)?.name)
      if (connection.intermediarySolutionId === null) {
        assert.equal(connection.intermediarySolution, null)
      } else {
        assert.equal(connection.intermediarySolution?.id, connection.intermediarySolutionId)
        assert.ok(solutionById.has(connection.intermediarySolutionId))
        assert.equal(connection.intermediarySolution?.name, solutionById.get(connection.intermediarySolutionId)?.name)
      }
    }
    const reviews = solutions.flatMap(solution => solution.archReviews)
    const tables = [
      ["Solution", solutions, () => prisma.solution.count()],
      ["Technology", data.catalogs.technologies, () => prisma.technology.count()],
      ["BusinessDomain", data.catalogs.domains, () => prisma.businessDomain.count()],
      ["BusinessCapability", data.catalogs.capabilities, () => prisma.businessCapability.count()],
      ["BusinessArea", data.catalogs.areas, () => prisma.businessArea.count()],
      ["SolutionGroup", data.groups, () => prisma.solutionGroup.count()],
      ["SolutionGroupMember", data.groups.flatMap(group => group.members), () => prisma.solutionGroupMember.count()],
      ["Connection", data.connections, () => prisma.connection.count()],
      ["TechnologyOnSolution", solutions.flatMap(solution => solution.technologies), () => prisma.technologyOnSolution.count()],
      ["DomainOnSolution", solutions.flatMap(solution => solution.domains), () => prisma.domainOnSolution.count()],
      ["CapabilityOnSolution", solutions.flatMap(solution => solution.capabilities), () => prisma.capabilityOnSolution.count()],
      ["AreaOnSolution", solutions.flatMap(solution => solution.areas), () => prisma.areaOnSolution.count()],
      ["Environment", solutions.flatMap(solution => solution.environments), () => prisma.environment.count()],
      ["Attachment", solutions.flatMap(solution => solution.attachments), () => prisma.attachment.count()],
      ["ArchReview", reviews, () => prisma.archReview.count()],
      ["ReviewDimension", reviews.flatMap(review => review.dimensions), () => prisma.reviewDimension.count()],
      ["ReviewAction", reviews.flatMap(review => review.actions), () => prisma.reviewAction.count()],
      ["ChangeLog", solutions.flatMap(solution => solution.changelog), () => prisma.changeLog.count()],
    ] as const
    for (const [modelName, records, count] of tables) {
      assert.equal(records.length, await count(), `${modelName}: missing records`)
      const model = Prisma.dmmf.datamodel.models.find(model => model.name === modelName)!
      for (const record of records) {
        for (const field of model.fields.filter(field => field.kind !== "object")) {
          assert.ok(Object.prototype.hasOwnProperty.call(record, field.name), `${modelName}.${field.name}: missing field`)
        }
      }
    }
    assert.equal(tables.length, Prisma.dmmf.datamodel.models.length, "Every model must be covered")
    console.log(`Export verified: ${solutions.length} solutions; all ${tables.length} models and stored fields covered. No records modified.`)
  } finally {
    await server.close()
    await prisma.$disconnect()
  }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
