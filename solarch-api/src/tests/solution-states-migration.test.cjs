require("dotenv/config")
const { test } = require("node:test")
const assert = require("node:assert/strict")
const { readFileSync } = require("node:fs")
const { join } = require("node:path")
const { Client } = require("pg")

test("migration preserves original usage and architectural status", async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()
  try {
    await client.query("BEGIN")
    // Dedicated transactional schema: no application tables are modified.
    const schema = "test_solution_states_" + process.pid + "_" + Date.now()
    await client.query('CREATE SCHEMA "' + schema + '"')
    await client.query('SET LOCAL search_path TO "' + schema + '"')
    await client.query(`
      CREATE TYPE "SolutionStatus" AS ENUM ('ACTIVE', 'DEPRECATED', 'IN_SUBSTITUTION', 'IN_DEVELOPMENT', 'MAINTENANCE');
      CREATE TYPE "UsageStatus" AS ENUM ('IN_USE', 'LIMITED_USE', 'IN_IMPLEMENTATION', 'IN_SUBSTITUTION', 'OUT_OF_USE');
      CREATE TABLE "Solution" (id integer PRIMARY KEY, status "SolutionStatus", "usageStatus" "UsageStatus", notes text);
      INSERT INTO "Solution" VALUES
      (1, 'ACTIVE', 'IN_USE', 'keep'), (2, 'MAINTENANCE', 'LIMITED_USE', 'keep'),
      (3, 'IN_DEVELOPMENT', 'IN_IMPLEMENTATION', 'keep'), (4, 'ACTIVE', 'IN_SUBSTITUTION', 'keep'),
      (5, 'DEPRECATED', 'OUT_OF_USE', 'keep'), (6, 'ACTIVE', NULL, 'keep');
    `)
    const before = (await client.query('SELECT * FROM "Solution" ORDER BY id')).rows
    const sql = readFileSync(join(__dirname, "../../prisma/migrations/20260909000000_separate_solution_states/migration.sql"), "utf8")
    await client.query(sql.replace(/^BEGIN;/m, "").replace(/^COMMIT;/m, ""))
    const after = (await client.query('SELECT * FROM "Solution" ORDER BY id')).rows
    assert.equal(after.length, before.length)
    assert.deepEqual(after.map(row => row.usageStatus), ["IN_USE", "LIMITED_USE", null, null, "NOT_IN_USE", null])
    after.forEach((row, index) => {
      assert.equal(row.legacyUsageStatus, before[index].usageStatus)
      assert.equal(row.status, before[index].status)
      assert.equal(row.notes, before[index].notes)
      assert.equal(row.id, before[index].id)
    })
  } finally {
    await client.query("ROLLBACK")
    await client.end()
  }
})
