require("../solarch-api/node_modules/dotenv").config({ path: "solarch-api/.env", quiet: true })
const { Client } = require("../solarch-api/node_modules/pg")
const fs = require("node:fs")
;(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()
  try {
    const result = await client.query('SELECT * FROM "Solution" ORDER BY id')
    const path = "tmp/solutions-before-state-migration-" + Date.now() + ".json"
    fs.writeFileSync(path, JSON.stringify(result.rows, null, 2), { flag: "wx" })
    console.log(JSON.stringify({ backup: path, records: result.rows.length }))
  } finally { await client.end() }
})().catch(error => { console.error(error.message); process.exitCode = 1 })
