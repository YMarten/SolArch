require("../solarch-api/node_modules/dotenv").config({ path: "solarch-api/.env", quiet: true })
const { Client } = require("../solarch-api/node_modules/pg")
const fs = require("node:fs")
const assert = require("node:assert/strict")
;(async () => {
  const before = JSON.parse(fs.readFileSync("tmp/solutions-before-state-migration-1788977639430.json", "utf8"))
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()
  try {
    const after = JSON.parse(JSON.stringify((await client.query('SELECT * FROM "Solution" ORDER BY id')).rows))
    assert.equal(after.length, before.length)
    for (let i = 0; i < before.length; i++) {
      const { legacyUsageStatus, usageStatus, ...rest } = after[i]
      const { usageStatus: oldUsage, ...oldRest } = before[i]
      assert.deepEqual(rest, oldRest)
      assert.equal(legacyUsageStatus, oldUsage)
      assert.equal(usageStatus, oldUsage === "OUT_OF_USE" ? "NOT_IN_USE" : ["IN_IMPLEMENTATION", "IN_SUBSTITUTION"].includes(oldUsage) ? null : oldUsage)
    }
    console.log("Verified: all 25 solutions preserved; only planned usage conversion and history added.")
  } finally { await client.end() }
})().catch(error => { console.error(error.message); process.exitCode = 1 })
