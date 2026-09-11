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
      const expected = before.map(row => ({
        ...row,
        hostingMode: ["SAAS","PROVIDER_HOSTED"].includes(row.hostingMode) ? "EXTERNAL" : row.hostingMode,
        managementModel: row.hostingMode === "ON_PREMISE" ? "COMPANY_MANAGED" : ["SAAS","PROVIDER_HOSTED"].includes(row.hostingMode) ? "PROVIDER_MANAGED" : "UNKNOWN",
      }))
      assert.deepEqual(rows,expected)
      const history = (await client.query('SELECT "solutionId", "oldValue" FROM "ChangeLog" WHERE "performedBy"=$1 ORDER BY "solutionId"', ["migration:20260910010000_separate_hosting_management"])).rows
      assert.deepEqual(history,before.map(r=>({solutionId:r.id,oldValue:r.hostingMode})))
      console.log("Verified all fields, original hosting history and " + rows.length + " records")
      console.log(JSON.stringify(rows.reduce((counts,r)=>{ const k=r.hostingMode+"/"+r.managementModel; counts[k]=(counts[k]||0)+1; return counts },{})))
    } else {
      const path = "tmp/solutions-before-management-" + Date.now() + ".json"
      fs.writeFileSync(path, JSON.stringify(rows,null,2),{flag:"wx"})
      console.log(JSON.stringify({backup:path,count:rows.length}))
    }
  } finally { await client.end() }
})().catch(error=>{ console.error(error.message);process.exitCode=1 })
