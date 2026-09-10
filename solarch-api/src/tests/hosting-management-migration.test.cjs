require("dotenv/config")
const { test } = require("node:test")
const assert = require("node:assert/strict")
const { readFileSync } = require("node:fs")
const { join } = require("node:path")
const { Client } = require("pg")

test("hosting and management migration preserves all six mappings and original values", async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()
  try {
    await client.query("BEGIN")
    const schema = "test_management_" + process.pid + "_" + Date.now()
    await client.query('CREATE SCHEMA "' + schema + '"')
    await client.query('SET LOCAL search_path TO "' + schema + '"')
    await client.query(`
      CREATE TYPE "HostingMode" AS ENUM ('ON_PREMISE', 'CLOUD_COMPANY', 'SAAS', 'PROVIDER_HOSTED', 'HYBRID', 'UNKNOWN');
      CREATE TABLE "Solution" (id text PRIMARY KEY, name text, "hostingMode" "HostingMode" NOT NULL DEFAULT 'UNKNOWN');
      CREATE TABLE "ChangeLog" (id text PRIMARY KEY, action text, "entityType" text, field text, "oldValue" text, "newValue" text, note text, "performedBy" text, "solutionId" text REFERENCES "Solution"(id));
    `)
    const old = ["ON_PREMISE", "CLOUD_COMPANY", "SAAS", "PROVIDER_HOSTED", "HYBRID", "UNKNOWN"]
    for (let i=0; i<old.length; i++) {
      await client.query('INSERT INTO "Solution" VALUES ($1,$2,$3)', [String(i), "unchanged", old[i]])
    }
    const sql = readFileSync(join(__dirname, "../../prisma/migrations/20260910010000_separate_hosting_management/migration.sql"), "utf8")
    await client.query(sql.replace(/^BEGIN;/m, "").replace(/^COMMIT;/m, ""))
    const rows = (await client.query('SELECT * FROM "Solution" ORDER BY id')).rows
    assert.deepEqual(rows.map(r => [r.hostingMode,r.managementModel]), [
      ["ON_PREMISE","COMPANY_MANAGED"], ["CLOUD_COMPANY","UNKNOWN"],
      ["EXTERNAL","PROVIDER_MANAGED"], ["EXTERNAL","PROVIDER_MANAGED"],
      ["HYBRID","UNKNOWN"], ["UNKNOWN","UNKNOWN"],
    ])
    rows.forEach((r,i) => { assert.equal(r.id,String(i)); assert.equal(r.name,"unchanged") })
    assert.deepEqual((await client.query('SELECT "oldValue" FROM "ChangeLog" ORDER BY "solutionId"')).rows.map(r=>r.oldValue), old)
    await client.query('INSERT INTO "Solution" (id,name) VALUES ($1,$2)', ["new","default"])
    const fresh = (await client.query('SELECT * FROM "Solution" WHERE id=$1',["new"])).rows[0]
    assert.equal(fresh.hostingMode,"UNKNOWN")
    assert.equal(fresh.managementModel,"UNKNOWN")
  } finally {
    await client.query("ROLLBACK")
    await client.end()
  }
})
