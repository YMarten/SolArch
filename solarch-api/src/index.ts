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

//Rutas de la BD

import { solutionsRoute } from "./routes/solutions.route"

// Rutas
server.register(solutionsRoute, { prefix: "/api/solutions" })

start()