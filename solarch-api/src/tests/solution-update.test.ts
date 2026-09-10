import assert from "node:assert/strict"
import { test } from "node:test"
import { prisma } from "../prisma"
import { solutionsService } from "../services/solutions.service"

test("PUT normalizes empty dates and preserves omitted dates", async () => {
  const original = prisma.solution.update
  const captured: unknown[] = []
  prisma.solution.update = (async (args: { data: unknown }) => {
    captured.push(args.data)
    return { id: "test" }
  }) as unknown as typeof prisma.solution.update
  try {
    for (const value of ["", null, "2026-09-09", undefined]) {
      await solutionsService.update("test", { lastDeploy: value })
    }
    const data = captured as { lastDeploy?: Date | null }[]
    assert.equal(data[0].lastDeploy, null)
    assert.equal(data[1].lastDeploy, null)
    assert.equal(data[2].lastDeploy?.toISOString(), "2026-09-09T00:00:00.000Z")
    assert.equal(data[3].lastDeploy, undefined)
  } finally {
    prisma.solution.update = original
  }
})
