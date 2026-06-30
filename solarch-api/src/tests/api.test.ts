const BASE_URL = "http://localhost:3001"

interface TestResult {
  endpoint: string
  method: string
  status: number
  ok: boolean
  error?: string
}

const results: TestResult[] = []

async function test(method: string, path: string, body?: object) {
  const endpoint = `${BASE_URL}${path}`
  try {
    const res = await fetch(endpoint, {
      method,
      headers: body ? { "Content-Type": "application/json" } : {},
      body: body ? JSON.stringify(body) : undefined
    })
    const ok = res.status < 400
    let errorDetail: string | undefined
    if (!ok) {
      const text = await res.text()
      errorDetail = text
    }
    results.push({ endpoint, method, status: res.status, ok, error: errorDetail })
  } catch (error: any) {
    results.push({ endpoint, method, status: 0, ok: false, error: error.message })
  }
}

async function runTests() {
  console.log("\nProbando endpoints del backend...\n")

  // Health
  await test("GET", "/health")

  // Solutions
  await test("GET", "/api/solutions")
  const sol = await fetch(`${BASE_URL}/api/solutions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Test Solution",
      status: "ACTIVE",
      type: "WEB",
      role: "CORE_TRANSACTIONAL",
      criticality: "HIGH",
      origin: "INTERNAL",
      owner: "Test Owner"
    })
  })
  const solData = await sol.json() as { id: string }
  const solId = solData.id
  results.push({ endpoint: `${BASE_URL}/api/solutions`, method: "POST", status: sol.status, ok: sol.status < 400 })

  await test("GET", `/api/solutions/${solId}`)
  await test("PUT", `/api/solutions/${solId}`, { name: "Test Solution Updated" })

  // Technologies
  await test("GET", "/api/technologies")
  const tech = await fetch(`${BASE_URL}/api/technologies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Test Tech", category: "FRAMEWORK" })
  })
  const techData = await tech.json() as { id: string }
  const techId = techData.id
  results.push({ endpoint: `${BASE_URL}/api/technologies`, method: "POST", status: tech.status, ok: tech.status < 400 })
  await test("PUT", `/api/technologies/${techId}`, { name: "Test Tech Updated" })

  // Domains
  await test("GET", "/api/domains")
  const dom = await fetch(`${BASE_URL}/api/domains`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Test Domain" })
  })
  const domData = await dom.json() as { id: string }
  const domId = domData.id
  results.push({ endpoint: `${BASE_URL}/api/domains`, method: "POST", status: dom.status, ok: dom.status < 400 })
  await test("PUT", `/api/domains/${domId}`, { name: "Test Domain Updated" })

  // Areas
  await test("GET", "/api/areas")
  const area = await fetch(`${BASE_URL}/api/areas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Test Area" })
  })
  const areaData = await area.json() as { id: string }
  const areaId = areaData.id
  results.push({ endpoint: `${BASE_URL}/api/areas`, method: "POST", status: area.status, ok: area.status < 400 })
  await test("PUT", `/api/areas/${areaId}`, { name: "Test Area Updated" })

  // Capabilities
  await test("GET", "/api/capabilities")
  const cap = await fetch(`${BASE_URL}/api/capabilities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Test Capability", domainId: domId })
  })
  const capData = await cap.json() as { id: string }
  const capId = capData.id
  results.push({ endpoint: `${BASE_URL}/api/capabilities`, method: "POST", status: cap.status, ok: cap.status < 400 })
  await test("PUT", `/api/capabilities/${capId}`, { name: "Test Capability Updated" })

  // Connections
  const sol2 = await fetch(`${BASE_URL}/api/solutions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Test Solution 2",
      status: "ACTIVE",
      type: "API",
      role: "INTEGRATION",
      criticality: "MEDIUM",
      origin: "INTERNAL",
      owner: "Test Owner 2"
    })
  })
  const sol2Data = await sol2.json() as { id: string }
  const sol2Id = sol2Data.id
  results.push({ endpoint: `${BASE_URL}/api/solutions`, method: "POST", status: sol2.status, ok: sol2.status < 400 })

  await test("GET", `/api/connections?solutionId=${solId}`)
  const conn = await fetch(`${BASE_URL}/api/connections`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fromId: solId, toId: sol2Id, type: "REST", description: "Test connection" })
  })
  const connData = await conn.json() as { id: string }
  const connId = connData.id
  results.push({ endpoint: `${BASE_URL}/api/connections`, method: "POST", status: conn.status, ok: conn.status < 400 })
  await test("PUT", `/api/connections/${connId}`, { description: "Updated connection" })

  // Attachments
  await test("GET", `/api/attachments?solutionId=${solId}`)
  const att = await fetch(`${BASE_URL}/api/attachments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Test Doc", url: "https://example.com", category: "DIAGRAM", solutionId: solId })
  })
  const attData = await att.json() as { id: string }
  const attId = attData.id
  results.push({ endpoint: `${BASE_URL}/api/attachments`, method: "POST", status: att.status, ok: att.status < 400 })
  await test("PUT", `/api/attachments/${attId}`, { title: "Updated Doc" })

  // Environments
  await test("GET", `/api/environments?solutionId=${solId}`)
  const env = await fetch(`${BASE_URL}/api/environments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "DEV", url: "https://dev.example.com", isActive: true, solutionId: solId })
  })
  const envData = await env.json() as { id: string }
  const envId = envData.id
  results.push({ endpoint: `${BASE_URL}/api/environments`, method: "POST", status: env.status, ok: env.status < 400 })
  await test("PUT", `/api/environments/${envId}`, { isActive: false })

  // Reviews
  await test("GET", `/api/reviews?solutionId=${solId}`)
  await test("GET", "/api/reviews/actions/pending")
  const rev = await fetch(`${BASE_URL}/api/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      solutionId: solId,
      reviewedAt: new Date(),
      reviewedBy: "Test Architect",
      result: "COMPLIANT",
      summary: "Test review",
      dimensions: [{ dimension: "SECURITY", result: "COMPLIANT", observation: "All good" }],
      actions: [{ description: "Fix docs", responsible: "Dev Team", dueDate: new Date() }]
    })
  })
  const revData = await rev.json() as { id: string, actions?: { id: string }[] }
  const revId = revData.id
  const actionId = revData.actions?.[0]?.id
  results.push({ endpoint: `${BASE_URL}/api/reviews`, method: "POST", status: rev.status, ok: rev.status < 400 })
  await test("GET", `/api/reviews/${revId}`)
  await test("PUT", `/api/reviews/${revId}`, { summary: "Updated review" })
  if (actionId) {
    await test("PATCH", `/api/reviews/actions/${actionId}`, { status: "IN_PROGRESS" })
  }

  // Cleanup
  await test("DELETE", `/api/reviews/${revId}`)
  await test("DELETE", `/api/attachments/${attId}`)
  await test("DELETE", `/api/environments/${envId}`)
  await test("DELETE", `/api/connections/${connId}`)
  await test("DELETE", `/api/capabilities/${capId}`)
  await test("DELETE", `/api/areas/${areaId}`)
  await test("DELETE", `/api/domains/${domId}`)
  await test("DELETE", `/api/technologies/${techId}`)
  await test("DELETE", `/api/solutions/${sol2Id}`)
  await test("DELETE", `/api/solutions/${solId}`)

  // Reporte final
  const passed = results.filter(r => r.ok).length
  const failed = results.filter(r => !r.ok).length

  console.log("-".repeat(70))

results.forEach(r => {
    const icon = r.ok ? "OK  " : "FAIL"
    const status = r.status === 0 ? "ERR" : r.status
    console.log(`[${icon}] [${status}] ${r.method.padEnd(6)} ${r.endpoint.replace(BASE_URL, "")}`)
    if (r.error) console.log(`   Error: ${r.error}`)
  })

  console.log("-".repeat(70))
  console.log(`\nPasaron: ${passed} | Fallaron: ${failed} | Total: ${results.length}\n`)
}

runTests()