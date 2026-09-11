require("dotenv/config")
const { test } = require("node:test")
const assert = require("node:assert/strict")
const { readFileSync } = require("node:fs")
const { join } = require("node:path")
const { Client } = require("pg")

test("hosting migration preserves rows and aborts for ambiguous CLOUD", async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()
  const sql = readFileSync(join(__dirname, "../../prisma/migrations/20260910000000_refine_hosting_modes/migration.sql"), "utf8")
    .replace(/^BEGIN;/m, "").replace(/^COMMIT;/m, "")
  try {
    await client.query("BEGIN")
    const schema = "test_hosting_" + process.pid + "_" + Date.now()
    await client.query('CREATE SCHEMA "' + schema + '"')
    await client.query('SET LOCAL search_path TO "' + schema + '"')
    await client.query(`
      CREATE TYPE "HostingMode" AS ENUM ('CLOUD', 'INTERNAL_INFRASTRUCTURE', 'VENDOR_INFRASTRUCTURE', 'HYBRID', 'UNKNOWN');
      CREATE TABLE "Solution" (id integer PRIMARY KEY, name text, "hostingMode" "HostingMode" NOT NULL DEFAULT 'UNKNOWN');
      INSERT INTO "Solution" VALUES (1,'internal','INTERNAL_INFRASTRUCTURE'), (2,'vendor','VENDOR_INFRASTRUCTURE'), (3,'hybrid','HYBRID'), (4,'unknown','UNKNOWN');
      SAVEPOINT ambiguous;
      INSERT INTO "Solution" VALUES (5,'cloud','CLOUD');
    `)
    await assert.rejects(client.query(sql), /Hay soluciones con CLOUD/)
    await client.query("ROLLBACK TO SAVEPOINT ambiguous")
    await client.query(sql)
    const rows = (await client.query('SELECT * FROM "Solution" ORDER BY id')).rows
    assert.deepEqual(rows, [
      { id: 1, name: "internal", hostingMode: "ON_PREMISE" },
      { id: 2, name: "vendor", hostingMode: "PROVIDER_HOSTED" },
      { id: 3, name: "hybrid", hostingMode: "HYBRID" },
      { id: 4, name: "unknown", hostingMode: "UNKNOWN" },
    ])
    await client.query('INSERT INTO "Solution" (id, name) VALUES (5, \'default\')')
    assert.equal((await client.query('SELECT "hostingMode" FROM "Solution" WHERE id=5')).rows[0].hostingMode, "UNKNOWN")
  } finally {
    await client.query("ROLLBACK")
    await client.end()
  }
})
