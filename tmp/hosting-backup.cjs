require("../solarch-api/node_modules/dotenv").config({ path: "solarch-api/.env", quiet: true })
const { Client } = require("../solarch-api/node_modules/pg")
const fs = require("node:fs")
const assert = require("node:assert/strict")
;(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()
  try {
    const rows = JSON.parse(JSON.stringify((await client.query('SELECT * FROM "Solution" ORDER BY id')).rows))
    if (process.argv[2] === "verify") {
      const before = JSON.parse(fs.readFileSync(process.argv[3], "utf8"))
      const mapping = { INTERNAL_INFRASTRUCTURE: "ON_PREMISE", VENDOR_INFRASTRUCTURE: "PROVIDER_HOSTED" }
      assert.deepEqual(rows, before.map(row => ({ ...row, hostingMode: mapping[row.hostingMode] ?? row.hostingMode })))
      console.log("Verified all fields and " + rows.length + " solution records")
    } else {
      assert.equal(rows.some(row => row.hostingMode === "CLOUD"), false, "Ambiguous CLOUD requires review")
      const path = "tmp/solutions-before-hosting-" + Date.now() + ".json"
      fs.writeFileSync(path, JSON.stringify(rows, null, 2), { flag: "wx" })
      console.log(JSON.stringify({ backup: path, count: rows.length }))
    }
  } finally { await client.end() }
})().catch(error => { console.error(error.message); process.exitCode = 1 })
