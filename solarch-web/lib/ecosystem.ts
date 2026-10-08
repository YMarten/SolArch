import type { Solution } from "@/types/solution"
import type { Connection } from "@/services/connections.service"

export const participants = (c: Connection) => [c.fromId, c.intermediarySolutionId, c.toId].filter((id): id is string => !!id)

export function ecosystemView(solutions: Solution[], connections: Connection[], scope: string[] | undefined, role: string | null, protocol: string | null, activity: string) {
  const registered = new Set(connections.flatMap(participants))
  const candidates = solutions.filter(s => (!scope || scope.includes(s.id)) && (!role || s.role === role))
  const ids = new Set(candidates.map(s => s.id))
  const visible = connections.filter(c => ids.has(c.fromId) && ids.has(c.toId) && (!protocol || c.type === protocol) && (activity === "all" || c.isActive === (activity === "active")))
  const visibleIds = new Set(visible.flatMap(participants))
  return {
    connections: visible,
    nodes: solutions.filter(s => visibleIds.has(s.id)),
    isolated: candidates.filter(s => !registered.has(s.id)),
    hidden: candidates.filter(s => registered.has(s.id) && !visibleIds.has(s.id)),
  }
}

export function connectedSets(ids: string[], connections: Connection[]): string[][] {
  const adjacent = new Map(ids.map(id => [id, new Set<string>()]))
  for (const c of connections) {
    const path = participants(c)
    for (let i = 1; i < path.length; i++) {
      adjacent.get(path[i - 1])?.add(path[i])
      adjacent.get(path[i])?.add(path[i - 1])
    }
  }
  const seen = new Set<string>(), groups: string[][] = []
  for (const id of [...ids].sort()) {
    if (seen.has(id)) continue
    const group: string[] = [], queue = [id]
    seen.add(id)
    while (queue.length) {
      const next = queue.pop()!
      group.push(next)
      for (const other of adjacent.get(next) ?? []) if (!seen.has(other)) { seen.add(other); queue.push(other) }
    }
    groups.push(group)
  }
  return groups.sort((a, b) => b.length - a.length)
}
