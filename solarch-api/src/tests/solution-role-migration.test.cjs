require("dotenv/config")
const { test } = require("node:test")
const assert = require("node:assert/strict")
const { readFileSync } = require("node:fs")
const { join } = require("node:path")
const { Client } = require("pg")

test("channel migration preserves solutions and audits only reclassified roles", async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()
  try {
    await client.query("BEGIN")
    const schema = "test_role_" + process.pid + "_" + Date.now()
    await client.query('CREATE SCHEMA "' + schema + '"')
    await client.query('SET LOCAL search_path TO "' + schema + '"')
    await client.query(`
      CREATE TYPE "SolutionRole" AS ENUM ('CORE_TRANSACTIONAL','SATELLITE','INTEGRATION','DATA_ANALYTICS','INTERACTION_CHANNEL');
      CREATE TABLE "Solution" (id text PRIMARY KEY, name text, role "SolutionRole" NOT NULL);
      CREATE TABLE "ChangeLog" (id text PRIMARY KEY, action text, "entityType" text, field text, "oldValue" text, "newValue" text, note text, "performedBy" text, "solutionId" text REFERENCES "Solution"(id));
    `)
    const roles = ["CORE_TRANSACTIONAL","SATELLITE","INTEGRATION","DATA_ANALYTICS","INTERACTION_CHANNEL"]
    for (let i=0;i<roles.length;i++) {
      await client.query('INSERT INTO "Solution" VALUES ($1,$2,$3)',[String(i),"unchanged",roles[i]])
    }
    const sql = readFileSync(join(__dirname,"../../prisma/migrations/20260915000000_merge_channel_into_satellite/migration.sql"),"utf8")
    await client.query(sql.replace(/^BEGIN;/m,"").replace(/^COMMIT;/m,""))
    const rows = (await client.query('SELECT * FROM "Solution" ORDER BY id')).rows
    assert.deepEqual(rows,roles.map((role,i)=>({id:String(i),name:"unchanged",role:role==="INTERACTION_CHANNEL"?"SATELLITE":role})))
    const history = (await client.query('SELECT "solutionId","oldValue","newValue" FROM "ChangeLog"')).rows
    assert.deepEqual(history,[{solutionId:"4",oldValue:"INTERACTION_CHANNEL",newValue:"SATELLITE"}])
    const values = (await client.query('SELECT unnest(enum_range(NULL::"SolutionRole"))::text AS role')).rows
    assert.deepEqual(values.map(r=>r.role),roles.slice(0,4))
  } finally {
    await client.query("ROLLBACK")
    await client.end()
  }
})
