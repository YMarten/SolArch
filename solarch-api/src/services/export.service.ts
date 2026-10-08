import { Prisma } from "@prisma/client"
import { prisma } from "../prisma"

export const exportService = {
  async generate() {
    // All queries share one snapshot, including catalog entries not yet assigned.
    return prisma.$transaction(async tx => {
      const solutions = await tx.solution.findMany({
        orderBy: { id: "asc" },
        include: {
          technologies: { include: { technology: true } },
          domains: { include: { domain: true } },
          capabilities: { include: { capability: true } },
          areas: { include: { area: true } },
          responsibleArea: true,
          environments: true,
          attachments: true,
          archReviews: { include: { dimensions: true, actions: true } },
          changelog: true,
          groups: { include: { group: true } },
        },
      })
      const connections = await tx.connection.findMany({
        orderBy: { id: "asc" },
        include: {
          from: { select: { id: true, name: true } },
          to: { select: { id: true, name: true } },
          intermediarySolution: { select: { id: true, name: true } },
        },
      })
      const groups = await tx.solutionGroup.findMany({ include: { members: true }, orderBy: { id: "asc" } })
      const technologies = await tx.technology.findMany({ orderBy: { id: "asc" } })
      const domains = await tx.businessDomain.findMany({ orderBy: { id: "asc" } })
      const capabilities = await tx.businessCapability.findMany({ orderBy: { id: "asc" } })
      const areas = await tx.businessArea.findMany({ orderBy: { id: "asc" } })
      return {
        schemaVersion: "1.1",
        application: "SolArch",
        exportedAt: new Date().toISOString(),
        solutions,
        connections,
        groups,
        catalogs: { technologies, domains, capabilities, areas },
      }
    }, { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead, timeout: 60000 })
  },
}
