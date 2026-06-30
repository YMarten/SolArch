import "dotenv/config"
import Fastify from "fastify"
import cors from "@fastify/cors"
import helmet from "@fastify/helmet"

const server = Fastify({
  logger: true
})

// Plugins
server.register(cors, {
  origin: "http://localhost:3000" // URL del frontend
})

server.register(helmet)

// Health check
server.get("/health", async () => {
  return { status: "ok" }
})

// Arrancar el servidor
const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3001
    await server.listen({ port, host: "0.0.0.0" })
  } catch (error) {
    server.log.error(error)
    process.exit(1)
  }
}

server.addContentTypeParser(
  "application/json",
  { parseAs: "string" },
  function (req, body, done) {
    try {
      const json = JSON.parse(body as string)
      done(null, json)
    } catch (err: any) {
      err.statusCode = 400
      done(err, undefined)
    }
  }
)

//Rutas

import { solutionsRoute } from "./routes/solutions.route"
import { technologiesRoute } from "./routes/technologies.route"
import { domainsRoute } from "./routes/domains.route"
import { areasRoute } from "./routes/areas.route"
import { capabilitiesRoute } from "./routes/capabilities.route"
import { connectionsRoute } from "./routes/connections.route"
import { attachmentsRoute } from "./routes/attachments.route"
import { environmentsRoute } from "./routes/environments.route"
import { reviewsRoute } from "./routes/reviews.route"

server.register(solutionsRoute, { prefix: "/api/solutions" })
server.register(technologiesRoute, { prefix: "/api/technologies" })
server.register(domainsRoute, { prefix: "/api/domains" })
server.register(areasRoute, { prefix: "/api/areas" })
server.register(capabilitiesRoute, { prefix: "/api/capabilities" })
server.register(connectionsRoute, { prefix: "/api/connections" })
server.register(attachmentsRoute, { prefix: "/api/attachments" })
server.register(environmentsRoute, { prefix: "/api/environments" })
server.register(reviewsRoute, { prefix: "/api/reviews" })

start()