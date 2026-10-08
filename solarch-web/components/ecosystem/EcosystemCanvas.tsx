"use client"

import { useEffect, useId, useRef } from "react"
import * as d3 from "d3"
import type { Solution } from "@/types/solution"
import type { Connection } from "@/services/connections.service"
import { connectedSets, participants } from "@/lib/ecosystem"

export const roleColors: Record<string, string> = { CORE_TRANSACTIONAL: "#4263eb", SATELLITE: "#7048e8", INTEGRATION: "#f76707", DATA_ANALYTICS: "#0ca678" }
interface Node extends d3.SimulationNodeDatum { id: string; name: string; role: string }
interface Edge extends d3.SimulationLinkDatum<Node> { connection: Connection; lane: number }
interface Props {
  solutions: Solution[]; connections: Connection[]; focus: string | null; selectedConnection: string | null
  fitVersion: number; onSelect: (id: string) => void; onConnection: (c: Connection) => void
}

export function EcosystemCanvas({ solutions, connections, focus, selectedConnection, fitVersion, onSelect, onConnection }: Props) {
  const ref = useRef<SVGSVGElement>(null)
  const marker = useId().replace(/:/g, "")
  const callbacks = useRef({ onSelect, onConnection })
  useEffect(() => { callbacks.current = { onSelect, onConnection } }, [onSelect, onConnection])
  const controls = useRef<{ fit: () => void; focus: (id: string | null, connection: string | null) => void } | null>(null)

  useEffect(() => {
    if (!ref.current) return
    const svg = d3.select(ref.current)
    svg.selectAll("*").remove()
    const root = svg.append("g")
    const nodes: Node[] = solutions.map(s => ({ id: s.id, name: s.name, role: s.role }))
    const byId = new Map(nodes.map(n => [n.id, n]))
    const edges: Edge[] = connections.flatMap(c => {
      const path = participants(c)
      return path.slice(1).map((to, i) => ({ source: byId.get(path[i])!, target: byId.get(to)!, connection: c, lane: 0 }))
    }).filter(e => e.source && e.target)
    const pairs = new Map<string, Edge[]>()
    for (const edge of edges) {
      const key = [(edge.source as Node).id, (edge.target as Node).id].sort().join("|")
      pairs.set(key, [...(pairs.get(key) ?? []), edge])
    }
    for (const group of pairs.values()) group.sort((a, b) => a.connection.id.localeCompare(b.connection.id)).forEach((edge, i) => { edge.lane = (i - (group.length - 1) / 2) * 42 })

    const sets = connectedSets(nodes.map(n => n.id), connections)
    let left = 0, top = 0, rowHeight = 0
    const rowWidth = Math.max(900, Math.sqrt(nodes.length) * 170)
    for (const ids of sets) {
      const members = ids.map(id => byId.get(id)!)
      const set = new Set(ids)
      const links = edges.filter(e => set.has((e.source as Node).id) && set.has((e.target as Node).id))
      const sim = d3.forceSimulation(members).force("link", d3.forceLink<Node, Edge>(links).id(n => n.id).distance(160))
        .force("charge", d3.forceManyBody().strength(-450)).force("x", d3.forceX(0).strength(0.06))
        .force("y", d3.forceY(0).strength(0.06)).force("collision", d3.forceCollide(65)).stop()
      sim.tick(220)
      const minX = Math.min(...members.map(n => n.x!)), minY = Math.min(...members.map(n => n.y!))
      const w = Math.max(...members.map(n => n.x!)) - minX + 190
      const h = Math.max(...members.map(n => n.y!)) - minY + 150
      if (left && left + w > rowWidth) { left = 0; top += rowHeight + 90; rowHeight = 0 }
      for (const n of members) { n.x = n.x! - minX + left + 95; n.y = n.y! - minY + top + 65 }
      left += w + 90; rowHeight = Math.max(rowHeight, h)
    }
    const zoom = d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.02, 4]).on("zoom", e => root.attr("transform", e.transform))
    svg.call(zoom).on("dblclick.zoom", null)
    svg.append("defs").append("marker").attr("id", marker).attr("viewBox", "0 -5 10 10").attr("refX", 9)
      .attr("markerWidth", 7).attr("markerHeight", 7).attr("orient", "auto").append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", "#74839a")

    const geometry = (e: Edge) => {
      const a = e.source as Node, b = e.target as Node
      const dx = b.x! - a.x!, dy = b.y! - a.y!, length = Math.hypot(dx, dy) || 1
      const sign = a.id < b.id ? 1 : -1
      const cx = (a.x! + b.x!) / 2 - dy / length * e.lane * sign
      const cy = (a.y! + b.y!) / 2 + dx / length * e.lane * sign
      const start = Math.hypot(cx - a.x!, cy - a.y!) || 1, end = Math.hypot(b.x! - cx, b.y! - cy) || 1
      return { path: `M${a.x! + (cx-a.x!)/start*23},${a.y! + (cy-a.y!)/start*23} Q${cx},${cy} ${b.x! - (b.x!-cx)/end*27},${b.y! - (b.y!-cy)/end*27}`, x: (a.x! + 2*cx + b.x!)/4, y: (a.y! + 2*cy + b.y!)/4 - 8 }
    }
    const edge = root.append("g").selectAll("g").data(edges).join("g").attr("class", "edge")
    edge.append("path").attr("class", "stroke").attr("fill", "none").attr("stroke", "#74839a").attr("stroke-width", 1.7)
      .attr("stroke-dasharray", e => e.connection.isActive ? null : "6 5").attr("marker-end", `url(#${marker})`)
    edge.append("path").attr("class", "hit").attr("fill", "none").attr("stroke", "transparent").attr("stroke-width", 16)
      .attr("tabindex", 0).attr("role", "button").style("cursor", "pointer")
      .attr("aria-label", e => `${e.connection.from.name} → ${e.connection.to.name}, ${e.connection.type}${e.connection.intermediarySolution ? ` vía ${e.connection.intermediarySolution.name}` : ""}`)
      .on("click", (_, e) => callbacks.current.onConnection(e.connection))
      .on("keydown", (event, e) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); callbacks.current.onConnection(e.connection) } })
    edge.append("title").text(e => `${e.connection.from.name} → ${e.connection.to.name} · ${e.connection.type} · ${e.connection.isActive ? "Activa" : "Inactiva"}\n${e.connection.description ?? ""}`)
    const labels = edge.append("text").attr("text-anchor", "middle").attr("font-size", 11).attr("fill", "currentColor")
      .attr("stroke", "var(--mantine-color-body)").attr("stroke-width", 4).attr("paint-order", "stroke").style("pointer-events", "none")
      .style("display", "none").text(e => `${e.connection.type} · ${e.connection.isActive ? "Activa" : "Inactiva"}`)
    const node = root.append("g").selectAll<SVGGElement, Node>("g").data(nodes).join("g").attr("tabindex", 0).attr("role", "button")
      .attr("aria-label", n => `Enfocar ${n.name}`).style("cursor", "pointer")
      .on("click", (_, n) => callbacks.current.onSelect(n.id))
      .on("keydown", (event, n) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); callbacks.current.onSelect(n.id) } })
    node.append("circle").attr("r", 22).attr("fill", n => roleColors[n.role] ?? "#868e96").attr("stroke", "var(--mantine-color-body)").attr("stroke-width", 3)
    node.append("text").attr("y", 39).attr("text-anchor", "middle").attr("font-size", 12).attr("fill", "currentColor")
      .attr("paint-order", "stroke").attr("stroke", "var(--mantine-color-body)").attr("stroke-width", 3)
      .text(n => n.name.length > 25 ? n.name.slice(0, 23) + "…" : n.name)
    node.append("title").text(n => n.name)
    const draw = () => {
      node.attr("transform", n => `translate(${n.x},${n.y})`)
      edge.selectAll<SVGPathElement, Edge>("path").attr("d", e => geometry(e).path)
      labels.attr("x", e => geometry(e).x).attr("y", e => geometry(e).y)
    }
    node.call(d3.drag<SVGGElement, Node>().on("drag", (event, n) => { n.x = event.x; n.y = event.y; draw() }))
    draw()
    const frame = (members: Node[]) => {
      if (!ref.current || !members.length) return
      const w = ref.current.clientWidth, h = ref.current.clientHeight
      const x0 = Math.min(...members.map(n => n.x!))-130, x1 = Math.max(...members.map(n => n.x!))+130
      const y0 = Math.min(...members.map(n => n.y!))-80, y1 = Math.max(...members.map(n => n.y!))+90
      const scale = Math.min(1.5, Math.max(0.02, Math.min(w/(x1-x0), h/(y1-y0))*0.9))
      svg.call(zoom.transform, d3.zoomIdentity.translate(w/2-(x0+x1)/2*scale, h/2-(y0+y1)/2*scale).scale(scale))
    }
    controls.current = {
      fit: () => frame(nodes),
      focus: (id, connection) => {
        const relevant = connections.filter(c => connection ? c.id === connection : id ? participants(c).includes(id) : false)
        const related = new Set(relevant.flatMap(participants))
        if (id) related.add(id)
        const active = !!id || !!connection
        const relevantIds = new Set(relevant.map(c => c.id))
        node.attr("opacity", n => !active || related.has(n.id) ? 1 : 0.18)
        node.select("circle").attr("stroke-width", n => n.id === id ? 6 : 3)
        edge.attr("opacity", e => !active || relevantIds.has(e.connection.id) ? 1 : 0.1)
        edge.select(".stroke").attr("stroke", e => relevantIds.has(e.connection.id) ? "#228be6" : "#74839a").attr("stroke-width", e => relevantIds.has(e.connection.id) ? 3 : 1.7)
        labels.style("display", e => relevantIds.has(e.connection.id) ? null : "none")
        frame(active ? nodes.filter(n => related.has(n.id)) : nodes)
      },
    }
    const observer = new ResizeObserver(() => controls.current?.fit())
    observer.observe(ref.current)
    controls.current.fit()
    return () => { observer.disconnect(); svg.on(".zoom", null); controls.current = null }
  }, [solutions, connections, marker])

  useEffect(() => { controls.current?.focus(focus, selectedConnection) }, [focus, selectedConnection, solutions, connections])
  useEffect(() => { controls.current?.fit() }, [fitVersion])
  return <svg ref={ref} aria-label="Mapa de relaciones entre soluciones" style={{ width: "100%", height: "min(68vh, 740px)", minHeight: 420, display: "block", touchAction: "none" }} />
}
