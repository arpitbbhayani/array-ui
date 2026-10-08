"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type ArchitectureStatus = "ok" | "warn" | "err" | "info";

export interface ArchitectureNodeItem {
  id: string;
  label: string;
  badge?: string;
  description?: string;
  /** Percentage 0 - 100. Omit x and y to let the canvas place the node automatically. */
  x?: number;
  y?: number;
  status?: ArchitectureStatus;
  metadata?: Record<string, string>;
  /** Id of an entry in `groups`. */
  group?: string;
  /** Whether this node has been visited / completed. Renders a checkmark or filled dot. */
  visited?: boolean;
}

export type ArchitectureEdgeRouting = "smoothstep" | "bezier" | "straight";

export interface ArchitectureConnectionItem {
  from: string;
  to: string;
  label?: string;
  animated?: boolean;
  variant?: "solid" | "dashed";
  status?: "ok" | "warn" | "err" | "primary";
  routing?: ArchitectureEdgeRouting;
}

export interface ArchitectureGroupItem {
  id: string;
  label: string;
  kind?: "service" | "layer" | "package" | "external";
  /** Start collapsed into a single node. */
  defaultCollapsed?: boolean;
}

export type ArchitectureDirection = "LR" | "TB";

/** A node after group collapsing. `collapsedGroupId` is set on a node that stands in for a collapsed group. */
export interface ResolvedArchitectureNode extends ArchitectureNodeItem {
  collapsedGroupId?: string;
}

export interface ArchitectureLayout {
  /** Total canvas size in px. */
  width: number;
  height: number;
  /** Node centers in px, for nodes that had no explicit x/y. */
  positions: Map<string, { x: number; y: number }>;
}

export interface PxBox {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Fixed node box used when the canvas places nodes itself. */
export const ARCH_NODE_W = 184;
export const ARCH_NODE_H = 88;

const GROUP_GAP = 14;
const GROUP_LABEL_H = 30;
/** Distance from the outermost node centers to the group border. */
export const ARCH_GROUP_PAD = {
  x: ARCH_NODE_W / 2 + GROUP_GAP,
  top: ARCH_NODE_H / 2 + GROUP_GAP + GROUP_LABEL_H,
  bottom: ARCH_NODE_H / 2 + GROUP_GAP,
};

const MARGIN = 24;
/** Node-to-node gaps (px) along the flow direction (main) and across it (cross). */
const GAPS: Record<ArchitectureDirection, { main: number; cross: number }> = {
  LR: { main: 64, cross: 28 },
  TB: { main: 68, cross: 40 },
};
/** Extra spacing between top-level items (groups and loose nodes). */
const ITEM_GAP_EXTRA = 10;

const STATUS_RANK: Record<ArchitectureStatus, number> = { ok: 0, info: 1, warn: 2, err: 3 };

export function groupNodeId(groupId: string): string {
  return `group:${groupId}`;
}

export function initialCollapsedGroups(groups: ArchitectureGroupItem[] = []): string[] {
  return groups.filter((g) => g.defaultCollapsed).map((g) => g.id);
}

/** Replaces every collapsed group's members with one stand-in node and re-targets edges. */
export function collapseArchitecture(
  nodes: ArchitectureNodeItem[],
  connections: ArchitectureConnectionItem[],
  groups: ArchitectureGroupItem[] = [],
  collapsed: string[] = []
): { nodes: ResolvedArchitectureNode[]; connections: ArchitectureConnectionItem[] } {
  const groupMap = new Map(groups.map((g) => [g.id, g]));
  const active = new Set(collapsed.filter((id) => groupMap.has(id)));
  if (active.size === 0) return { nodes, connections };

  const remap = new Map<string, string>();
  const outNodes: ResolvedArchitectureNode[] = [];
  const emitted = new Set<string>();

  for (const n of nodes) {
    if (n.group && active.has(n.group)) {
      const gid = groupNodeId(n.group);
      remap.set(n.id, gid);
      if (emitted.has(n.group)) continue;
      emitted.add(n.group);

      const members = nodes.filter((m) => m.group === n.group);
      const g = groupMap.get(n.group)!;
      const pinned = members.every((m) => m.x !== undefined && m.y !== undefined);
      const worst = members.reduce<ArchitectureStatus | undefined>((acc, m) => {
        if (!m.status) return acc;
        return !acc || STATUS_RANK[m.status] > STATUS_RANK[acc] ? m.status : acc;
      }, undefined);

      outNodes.push({
        id: gid,
        label: g.label,
        badge: `${members.length} nodes`,
        description: members.map((m) => m.label).join(", "),
        x: pinned ? members.reduce((s, m) => s + (m.x as number), 0) / members.length : undefined,
        y: pinned ? members.reduce((s, m) => s + (m.y as number), 0) / members.length : undefined,
        status: worst,
        metadata: { Group: g.label, Members: String(members.length) },
        collapsedGroupId: n.group,
      });
    } else {
      outNodes.push(n);
    }
  }

  const seen = new Map<string, ArchitectureConnectionItem>();
  for (const c of connections) {
    const from = remap.get(c.from) ?? c.from;
    const to = remap.get(c.to) ?? c.to;
    if (from === to) continue;
    const key = `${from}\u0000${to}`;
    const prev = seen.get(key);
    if (prev) {
      if (c.animated) prev.animated = true;
      continue;
    }
    seen.set(key, { ...c, from, to });
  }

  return { nodes: outNodes, connections: Array.from(seen.values()) };
}

/** Longest-path ranking. Edges that close a cycle are ignored so cyclic graphs still lay out. */
function rankItems(ids: string[], edges: [string, string][]): Map<string, number> {
  const idSet = new Set(ids);
  const out = new Map<string, string[]>(ids.map((id) => [id, []]));
  for (const [a, b] of edges) {
    if (a !== b && idSet.has(a) && idSet.has(b)) out.get(a)!.push(b);
  }

  const state = new Map<string, 0 | 1 | 2>(ids.map((id) => [id, 0]));
  const dag: [string, string][] = [];
  for (const start of ids) {
    if (state.get(start) !== 0) continue;
    const stack: { id: string; i: number }[] = [{ id: start, i: 0 }];
    state.set(start, 1);
    while (stack.length) {
      const top = stack[stack.length - 1];
      const next = out.get(top.id)![top.i++];
      if (next === undefined) {
        state.set(top.id, 2);
        stack.pop();
        continue;
      }
      const s = state.get(next);
      if (s === 1) continue; // back edge
      dag.push([top.id, next]);
      if (s === 0) {
        state.set(next, 1);
        stack.push({ id: next, i: 0 });
      }
    }
  }

  const indeg = new Map<string, number>(ids.map((id) => [id, 0]));
  const succ = new Map<string, string[]>(ids.map((id) => [id, []]));
  for (const [a, b] of dag) {
    indeg.set(b, indeg.get(b)! + 1);
    succ.get(a)!.push(b);
  }
  const rank = new Map<string, number>(ids.map((id) => [id, 0]));
  const queue = ids.filter((id) => indeg.get(id) === 0);
  while (queue.length) {
    const u = queue.shift()!;
    for (const v of succ.get(u)!) {
      rank.set(v, Math.max(rank.get(v)!, rank.get(u)! + 1));
      indeg.set(v, indeg.get(v)! - 1);
      if (indeg.get(v) === 0) queue.push(v);
    }
  }
  return rank;
}

/** Ranks, then orders each rank with a few barycenter sweeps to cut edge crossings. */
function layerItems(ids: string[], edges: [string, string][]): string[][] {
  const rank = rankItems(ids, edges);
  const count = ids.length ? Math.max(...ids.map((id) => rank.get(id)!)) + 1 : 0;
  const layers: string[][] = Array.from({ length: count }, () => []);
  for (const id of ids) layers[rank.get(id)!].push(id);

  const idSet = new Set(ids);
  const nbrs = new Map<string, string[]>(ids.map((id) => [id, []]));
  for (const [a, b] of edges) {
    if (a === b || !idSet.has(a) || !idSet.has(b)) continue;
    nbrs.get(a)!.push(b);
    nbrs.get(b)!.push(a);
  }

  const norm = new Map<string, number>();
  const refresh = () =>
    layers.forEach((layer) => layer.forEach((id, i) => norm.set(id, (i + 0.5) / layer.length)));
  refresh();

  const sweep = (r: number, useLower: boolean) => {
    const layer = layers[r];
    const keyed = layer.map((id, i) => {
      const peers = nbrs.get(id)!.filter((n) => (useLower ? rank.get(n)! < r : rank.get(n)! > r));
      const bary = peers.length ? peers.reduce((s, n) => s + norm.get(n)!, 0) / peers.length : norm.get(id)!;
      return { id, bary, i };
    });
    keyed.sort((a, b) => a.bary - b.bary || a.i - b.i);
    layers[r] = keyed.map((k) => k.id);
    refresh();
  };

  for (let it = 0; it < 4; it++) {
    for (let r = 1; r < layers.length; r++) sweep(r, true);
    for (let r = layers.length - 2; r >= 0; r--) sweep(r, false);
  }
  return layers;
}

interface Item {
  id: string;
  members: string[];
  /** Local ranks for grouped items, used to reorder members against external edges. */
  layers?: string[][];
  /** Member center offsets from the item's top-left corner. */
  offsets: Map<string, { x: number; y: number }>;
  w: number;
  h: number;
}

function localItem(
  id: string,
  members: string[],
  edges: [string, string][],
  direction: ArchitectureDirection,
  grouped: boolean,
  gapMain: number
): Item {
  const gaps = { ...GAPS[direction], main: gapMain };
  const mainStep = (direction === "LR" ? ARCH_NODE_W : ARCH_NODE_H) + gaps.main;
  const crossStep = (direction === "LR" ? ARCH_NODE_H : ARCH_NODE_W) + gaps.cross;

  const centers = new Map<string, { x: number; y: number }>();
  let layers: string[][] | undefined;
  if (!grouped) {
    centers.set(members[0], { x: 0, y: 0 });
  } else {
    layers = layerItems(members, edges);
    layers.forEach((layer, r) => {
      layer.forEach((m, i) => {
        const cross = (i - (layer.length - 1) / 2) * crossStep;
        const main = r * mainStep;
        centers.set(m, direction === "LR" ? { x: main, y: cross } : { x: cross, y: main });
      });
    });
  }

  const xs = Array.from(centers.values()).map((c) => c.x);
  const ys = Array.from(centers.values()).map((c) => c.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const pad = grouped
    ? ARCH_GROUP_PAD
    : { x: ARCH_NODE_W / 2, top: ARCH_NODE_H / 2, bottom: ARCH_NODE_H / 2 };

  const offsets = new Map<string, { x: number; y: number }>();
  centers.forEach((c, m) => offsets.set(m, { x: c.x - minX + pad.x, y: c.y - minY + pad.top }));
  return { id, members, layers, offsets, w: maxX - minX + pad.x * 2, h: maxY - minY + pad.top + pad.bottom };
}

/**
 * Places nodes that have no explicit x/y. Groups are laid out as single blocks so their borders
 * never overlap, then members are laid out inside. Positions are px node centers.
 * Returns null when every node already has coordinates.
 */
export function layoutArchitecture(
  nodes: ArchitectureNodeItem[],
  connections: ArchitectureConnectionItem[],
  groups: ArchitectureGroupItem[] = [],
  direction: ArchitectureDirection = "LR"
): ArchitectureLayout | null {
  const auto = nodes.filter((n) => n.x === undefined || n.y === undefined);
  if (auto.length === 0) return null;

  const autoIds = new Set(auto.map((n) => n.id));
  const groupIds = new Set(groups.map((g) => g.id));
  const itemOf = new Map<string, string>();
  const itemMembers = new Map<string, string[]>();
  const itemOrder: string[] = [];

  for (const n of auto) {
    const itemId = n.group && groupIds.has(n.group) ? `g:${n.group}` : `n:${n.id}`;
    itemOf.set(n.id, itemId);
    if (!itemMembers.has(itemId)) {
      itemMembers.set(itemId, []);
      itemOrder.push(itemId);
    }
    itemMembers.get(itemId)!.push(n.id);
  }

  const edgePairs: [string, string][] = connections
    .filter((c) => autoIds.has(c.from) && autoIds.has(c.to))
    .map((c) => [c.from, c.to]);

  // Leave room between ranks for edge labels (left-to-right only: labels are wide, not tall).
  const labelWidth = connections
    .filter((c) => c.label && autoIds.has(c.from) && autoIds.has(c.to))
    .reduce((m, c) => Math.max(m, (c.label as string).length * 7.2 + 26), 0);
  const gapMain =
    direction === "LR" ? Math.max(GAPS.LR.main, Math.min(labelWidth + 44, 200)) : GAPS.TB.main;

  const items = new Map<string, Item>();
  for (const itemId of itemOrder) {
    const members = itemMembers.get(itemId)!;
    const grouped = itemId.startsWith("g:");
    const inner = edgePairs.filter(([a, b]) => itemOf.get(a) === itemId && itemOf.get(b) === itemId);
    items.set(itemId, localItem(itemId, members, inner, direction, grouped, gapMain));
  }

  const metaEdges: [string, string][] = [];
  for (const [a, b] of edgePairs) {
    const ia = itemOf.get(a)!;
    const ib = itemOf.get(b)!;
    if (ia !== ib) metaEdges.push([ia, ib]);
  }
  const layers = layerItems(itemOrder, metaEdges);

  const mainGap = gapMain + ITEM_GAP_EXTRA;
  const crossGap = GAPS[direction].cross + ITEM_GAP_EXTRA / 2;
  const mainSize = (it: Item) => (direction === "LR" ? it.w : it.h);
  const crossSize = (it: Item) => (direction === "LR" ? it.h : it.w);

  const layerMain = layers.map((l) => Math.max(...l.map((id) => mainSize(items.get(id)!))));
  const layerCross = layers.map(
    (l) => l.reduce((s, id) => s + crossSize(items.get(id)!), 0) + crossGap * (l.length - 1)
  );
  const totalCross = Math.max(...layerCross);
  const totalMain = layerMain.reduce((s, m) => s + m, 0) + mainGap * (layers.length - 1);

  const positions = new Map<string, { x: number; y: number }>();
  const itemPos = new Map<string, { left: number; top: number }>();
  let mainCursor = MARGIN;
  layers.forEach((layer, r) => {
    let crossCursor = MARGIN + (totalCross - layerCross[r]) / 2;
    for (const id of layer) {
      const it = items.get(id)!;
      const mainPos = mainCursor + (layerMain[r] - mainSize(it)) / 2;
      const left = direction === "LR" ? mainPos : crossCursor;
      const top = direction === "LR" ? crossCursor : mainPos;
      itemPos.set(id, { left, top });
      it.offsets.forEach((o, m) => positions.set(m, { x: left + o.x, y: top + o.y }));
      crossCursor += crossSize(it) + crossGap;
    }
    mainCursor += layerMain[r] + mainGap;
  });

  // Members were ordered before their group's final place was known. Reorder each group's
  // members within a rank by where their outside neighbors ended up, to untangle crossings.
  const cross = (p: { x: number; y: number }) => (direction === "LR" ? p.y : p.x);
  const nbrs = new Map<string, string[]>(auto.map((n) => [n.id, []]));
  for (const [a, b] of edgePairs) {
    nbrs.get(a)!.push(b);
    nbrs.get(b)!.push(a);
  }
  for (let pass = 0; pass < 2; pass++) {
    for (const it of items.values()) {
      if (!it.layers) continue;
      const { left, top } = itemPos.get(it.id)!;
      for (const layer of it.layers) {
        if (layer.length < 2) continue;
        const slots = layer.map((m) => cross(it.offsets.get(m)!)).sort((a, b) => a - b);
        const keyed = layer
          .map((m, i) => {
            const outside = nbrs.get(m)!.filter((n) => itemOf.get(n) !== it.id);
            const key = outside.length
              ? outside.reduce((sum, n) => sum + cross(positions.get(n)!), 0) / outside.length
              : cross(positions.get(m)!);
            return { m, key, i };
          })
          .sort((a, b) => a.key - b.key || a.i - b.i);
        keyed.forEach((k, idx) => {
          const o = it.offsets.get(k.m)!;
          const next = direction === "LR" ? { x: o.x, y: slots[idx] } : { x: slots[idx], y: o.y };
          it.offsets.set(k.m, next);
          positions.set(k.m, { x: left + next.x, y: top + next.y });
        });
      }
    }
  }

  const width = (direction === "LR" ? totalMain : totalCross) + MARGIN * 2;
  const height = (direction === "LR" ? totalCross : totalMain) + MARGIN * 2;
  return { width, height, positions };
}

/** Group borders in px, from final node centers. Only groups with at least one placed member. */
export function groupBoxes(
  groups: ArchitectureGroupItem[],
  nodes: ArchitectureNodeItem[],
  center: (id: string) => { x: number; y: number } | undefined
): PxBox[] {
  const boxes: PxBox[] = [];
  for (const g of groups) {
    const pts = nodes
      .filter((n) => n.group === g.id)
      .map((n) => center(n.id))
      .filter((p): p is { x: number; y: number } => Boolean(p));
    if (pts.length === 0) continue;
    const minX = Math.min(...pts.map((p) => p.x));
    const maxX = Math.max(...pts.map((p) => p.x));
    const minY = Math.min(...pts.map((p) => p.y));
    const maxY = Math.max(...pts.map((p) => p.y));
    boxes.push({
      id: g.id,
      x: minX - ARCH_GROUP_PAD.x,
      y: minY - ARCH_GROUP_PAD.top,
      w: maxX - minX + ARCH_GROUP_PAD.x * 2,
      h: maxY - minY + ARCH_GROUP_PAD.top + ARCH_GROUP_PAD.bottom,
    });
  }
  return boxes;
}

/** Point where the segment from (cx, cy) toward (tx, ty) leaves a centered rectangle. */
export function clipToRect(cx: number, cy: number, tx: number, ty: number, hw: number, hh: number) {
  const dx = tx - cx;
  const dy = ty - cy;
  if (dx === 0 && dy === 0) return { x: cx, y: cy };
  const t = Math.min(dx === 0 ? Infinity : hw / Math.abs(dx), dy === 0 ? Infinity : hh / Math.abs(dy));
  return { x: cx + dx * t, y: cy + dy * t };
}

export interface PxEdge {
  index: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  mx: number;
  my: number;
  path: string;
}

/** Computes an SVG path data string and midpoint for straight, bezier, or smoothstep (orthogonal with rounded corners) edges. */
export function buildEdgePath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  routing: ArchitectureEdgeRouting = "smoothstep",
  direction: ArchitectureDirection = "LR",
  borderRadius: number = 8
): { path: string; mx: number; my: number } {
  if (routing === "straight") {
    return {
      path: `M ${x1} ${y1} L ${x2} ${y2}`,
      mx: (x1 + x2) / 2,
      my: (y1 + y2) / 2,
    };
  }

  if (routing === "bezier") {
    if (direction === "LR") {
      const dx = Math.max(32, Math.abs(x2 - x1) * 0.5);
      const cx1 = x1 + dx;
      const cy1 = y1;
      const cx2 = x2 - dx;
      const cy2 = y2;
      return {
        path: `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`,
        mx: (x1 + x2) / 2,
        my: (y1 + y2) / 2,
      };
    } else {
      const dy = Math.max(32, Math.abs(y2 - y1) * 0.5);
      const cx1 = x1;
      const cy1 = y1 + dy;
      const cx2 = x2;
      const cy2 = y2 - dy;
      return {
        path: `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`,
        mx: (x1 + x2) / 2,
        my: (y1 + y2) / 2,
      };
    }
  }

  // "smoothstep" - orthogonal step routing with rounded corners
  if (direction === "LR") {
    const dx = x2 - x1;
    const dy = y2 - y1;

    if (dx >= 12) {
      const mx = x1 + dx / 2;
      const r = Math.min(borderRadius, Math.abs(dx) / 2, Math.abs(dy) / 2);
      if (r <= 1 || Math.abs(dy) <= 2) {
        return {
          path: `M ${x1} ${y1} L ${mx} ${y1} L ${mx} ${y2} L ${x2} ${y2}`,
          mx,
          my: (y1 + y2) / 2,
        };
      }
      const sy = dy > 0 ? 1 : -1;
      return {
        path: `M ${x1} ${y1} L ${mx - r} ${y1} Q ${mx} ${y1} ${mx} ${y1 + r * sy} L ${mx} ${y2 - r * sy} Q ${mx} ${y2} ${mx + r} ${y2} L ${x2} ${y2}`,
        mx,
        my: (y1 + y2) / 2,
      };
    } else {
      const r = Math.min(borderRadius, 12);
      const offset = 32;
      const midY = dy >= 0 ? Math.max(y1, y2) + offset : Math.min(y1, y2) - offset;
      const sy1 = midY > y1 ? 1 : -1;
      const sy2 = y2 > midY ? 1 : -1;
      return {
        path: `M ${x1} ${y1} L ${x1 + 16} ${y1} Q ${x1 + 16 + r} ${y1} ${x1 + 16 + r} ${y1 + r * sy1} L ${x1 + 16 + r} ${midY - r * sy1} Q ${x1 + 16 + r} ${midY} ${x1 + 16} ${midY} L ${x2 - 16} ${midY} Q ${x2 - 16 - r} ${midY} ${x2 - 16 - r} ${midY + r * sy2} L ${x2 - 16 - r} ${y2 - r * sy2} Q ${x2 - 16 - r} ${y2} ${x2 - 16} ${y2} L ${x2} ${y2}`,
        mx: (x1 + x2) / 2,
        my: midY,
      };
    }
  } else {
    const dx = x2 - x1;
    const dy = y2 - y1;

    if (dy >= 12) {
      const my = y1 + dy / 2;
      const r = Math.min(borderRadius, Math.abs(dx) / 2, Math.abs(dy) / 2);
      if (r <= 1 || Math.abs(dx) <= 2) {
        return {
          path: `M ${x1} ${y1} L ${x1} ${my} L ${x2} ${my} L ${x2} ${y2}`,
          mx: (x1 + x2) / 2,
          my,
        };
      }
      const sx = dx > 0 ? 1 : -1;
      return {
        path: `M ${x1} ${y1} L ${x1} ${my - r} Q ${x1} ${my} ${x1 + r * sx} ${my} L ${x2 - r * sx} ${my} Q ${x2} ${my} ${x2} ${my + r} L ${x2} ${y2}`,
        mx: (x1 + x2) / 2,
        my,
      };
    } else {
      const r = Math.min(borderRadius, 12);
      const offset = 36;
      const midX = dx >= 0 ? Math.max(x1, x2) + offset : Math.min(x1, x2) - offset;
      const sx1 = midX > x1 ? 1 : -1;
      const sx2 = x2 > midX ? 1 : -1;
      return {
        path: `M ${x1} ${y1} L ${x1} ${y1 + 16} Q ${x1} ${y1 + 16 + r} ${x1 + r * sx1} ${y1 + 16 + r} L ${midX - r * sx1} ${y1 + 16 + r} Q ${midX} ${y1 + 16 + r} ${midX} ${y1 + 16} L ${midX} ${y2 - 16} Q ${midX} ${y2 - 16 - r} ${midX + r * sx2} ${y2 - 16 - r} L ${x2 - r * sx2} ${y2 - 16 - r} Q ${x2} ${y2 - 16 - r} ${x2} ${y2 - 16} L ${x2} ${y2}`,
        mx: midX,
        my: (y1 + y2) / 2,
      };
    }
  }
}

/** Edge segments in px, clipped to node boxes. Opposite edges between the same pair are offset apart. */
export function routeEdges(
  connections: ArchitectureConnectionItem[],
  center: (id: string) => { x: number; y: number } | undefined,
  defaultRouting: ArchitectureEdgeRouting = "smoothstep",
  direction: ArchitectureDirection = "LR"
): PxEdge[] {
  const pairs = new Set(connections.map((c) => `${c.from}\u0000${c.to}`));
  const hw = ARCH_NODE_W / 2;
  const hh = ARCH_NODE_H / 2;
  const edges: PxEdge[] = [];

  connections.forEach((c, index) => {
    const a = center(c.from);
    const b = center(c.to);
    if (!a || !b) return;

    let ox = 0;
    let oy = 0;
    if (pairs.has(`${c.to}\u0000${c.from}`)) {
      const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
      ox = (-(b.y - a.y) / len) * 7;
      oy = ((b.x - a.x) / len) * 7;
    }
    const ac = { x: a.x + ox, y: a.y + oy };
    const bc = { x: b.x + ox, y: b.y + oy };

    let start = clipToRect(ac.x, ac.y, bc.x, bc.y, hw, hh);
    let end = clipToRect(bc.x, bc.y, ac.x, ac.y, hw + 3, hh + 3);

    const routing = c.routing ?? defaultRouting;
    if (routing !== "straight") {
      if (direction === "LR" && b.x >= a.x + hw) {
        start = { x: a.x + hw, y: a.y + oy };
        end = { x: b.x - hw - 3, y: b.y + oy };
      } else if (direction === "TB" && b.y >= a.y + hh) {
        start = { x: a.x + ox, y: a.y + hh };
        end = { x: b.x + ox, y: b.y - hh - 3 };
      }
    }

    const geom = buildEdgePath(start.x, start.y, end.x, end.y, routing, direction);

    edges.push({
      index,
      x1: start.x,
      y1: start.y,
      x2: end.x,
      y2: end.y,
      mx: geom.mx,
      my: geom.my,
      path: geom.path,
    });
  });
  return edges;
}

export interface ArchitectureCanvasProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  nodes: ArchitectureNodeItem[];
  connections?: ArchitectureConnectionItem[];
  /** Boundaries (services, layers, packages). Members point at a group with `node.group`. */
  groups?: ArchitectureGroupItem[];
  /** Flow direction used when nodes have no x/y. Default "LR". */
  direction?: ArchitectureDirection;
  selectedNodeId?: string;
  onNodeSelect?: (nodeId: string) => void;
  /** Edge routing algorithm: "smoothstep" (orthogonal with rounded corners), "bezier" (smooth spline), or "straight". Default "smoothstep". */
  routing?: ArchitectureEdgeRouting;
  /** Whether to show canvas navigation / zoom controls (+, -, reset). Default false. */
  showControls?: boolean;
  /** Whether to show connection port handles on nodes. Default true. */
  showHandles?: boolean;
  /** Compact mode for narrow sidebars or split panes. Reduces viewport padding and default min-height. */
  compact?: boolean;
  /** Minimum width for the viewport canvas or container. */
  minWidth?: number | string;
  /** Minimum height for the viewport canvas or container. Default 380px (or 240px if compact). */
  minHeight?: number | string;
  /** Whether to wrap node labels instead of single-line truncation. Default false. */
  wrapLabels?: boolean;
}

const STATUS_BORDER: Record<ArchitectureStatus, string> = {
  ok: "border-l-[3px] border-l-emerald-500",
  info: "",
  warn: "border-l-[3px] border-l-amber-500",
  err: "border-l-[3px] border-l-rose-500",
};

export function ArchitectureCanvas({
  title = "System Architecture",
  subtitle,
  badge,
  nodes: inputNodes,
  connections: inputConnections = [],
  groups = [],
  direction = "LR",
  selectedNodeId: controlledSelected,
  onNodeSelect,
  routing = "smoothstep",
  showControls = false,
  showHandles = true,
  compact = false,
  minWidth,
  minHeight,
  wrapLabels = false,
  className,
  ...props
}: ArchitectureCanvasProps) {
  const [collapsed, setCollapsed] = React.useState<string[]>(() => initialCollapsedGroups(groups));
  const [internalSelected, setInternalSelected] = React.useState<string | null>(
    inputNodes.length > 0 ? inputNodes[0].id : null
  );
  const [zoom, setZoom] = React.useState(1);

  const handleZoomIn = () => setZoom((z) => Math.min(2.0, Math.round((z + 0.15) * 100) / 100));
  const handleZoomOut = () => setZoom((z) => Math.max(0.5, Math.round((z - 0.15) * 100) / 100));
  const handleZoomReset = () => setZoom(1);

  const { nodes, connections } = React.useMemo(
    () => collapseArchitecture(inputNodes, inputConnections, groups, collapsed),
    [inputNodes, inputConnections, groups, collapsed]
  );
  const layout = React.useMemo(
    () => layoutArchitecture(nodes, connections, groups, direction),
    [nodes, connections, groups, direction]
  );

  const activeNodeId = controlledSelected !== undefined ? controlledSelected : internalSelected;
  const activeNode = nodes.find((n) => n.id === activeNodeId);

  const toggleGroup = (id: string) =>
    setCollapsed((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]));

  const handleNodeClick = (id: string, collapsedGroupId?: string) => {
    if (collapsedGroupId) toggleGroup(collapsedGroupId);
    if (controlledSelected === undefined) {
      setInternalSelected(id);
    }
    onNodeSelect?.(id);
  };

  const nodeMap = new Map<string, ArchitectureNodeItem>();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  // Px mode: some nodes were placed automatically, so everything is positioned in px.
  const center = (id: string) => {
    const n = nodeMap.get(id);
    if (!n || !layout) return undefined;
    if (n.x !== undefined && n.y !== undefined) {
      return { x: (n.x / 100) * layout.width, y: (n.y / 100) * layout.height };
    }
    return layout.positions.get(id);
  };

  const pxEdges = layout ? routeEdges(connections, center, routing, direction) : [];
  const pxGroups = layout ? groupBoxes(groups, nodes, center) : [];
  const groupMap = new Map(groups.map((g) => [g.id, g]));

  // Percent mode (all nodes pinned): group borders as calc() around the member bounding box.
  const pctGroups = layout
    ? []
    : groups.flatMap((g) => {
        const m = nodes.filter((n) => n.group === g.id && n.x !== undefined && n.y !== undefined);
        if (m.length === 0) return [];
        const xs = m.map((n) => n.x as number);
        const ys = m.map((n) => n.y as number);
        const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
        return [
          {
            id: g.id,
            style: {
              left: `calc(${x0}% - ${ARCH_GROUP_PAD.x}px)`,
              top: `calc(${y0}% - ${ARCH_GROUP_PAD.top}px)`,
              width: `calc(${x1 - x0}% + ${ARCH_GROUP_PAD.x * 2}px)`,
              height: `calc(${y1 - y0}% + ${ARCH_GROUP_PAD.top + ARCH_GROUP_PAD.bottom}px)`,
            } as React.CSSProperties,
          },
        ];
      });

  const renderGroup = (id: string, style: React.CSSProperties) => {
    const g = groupMap.get(id);
    if (!g) return null;
    return (
      <div
        key={`group-${id}`}
        className={cn(
          "absolute z-0 box-border rounded-md border bg-card/60 pointer-events-none",
          g.kind === "external" ? "border-dotted border-border bg-transparent" : "border-dashed border-border",
          g.kind === "layer" && "border-solid"
        )}
        style={style}
      >
        <div className="flex items-center gap-2 h-[30px] px-2.5 font-mono text-xs text-muted-foreground">
          <button
            type="button"
            aria-expanded="true"
            aria-label={`Collapse ${g.label}`}
            onClick={() => toggleGroup(id)}
            className="pointer-events-auto cursor-pointer size-[1.15rem] leading-none rounded border border-border bg-background text-muted-foreground hover:text-foreground"
          >
            -
          </button>
          <span className="font-semibold text-foreground">{g.label}</span>
          {g.kind && <span className="uppercase tracking-wider text-[0.68rem]">{g.kind}</span>}
        </div>
      </div>
    );
  };

  const renderNode = (node: (typeof nodes)[number], style: React.CSSProperties, fixed: boolean) => {
    const isSelected = node.id === activeNodeId;
    const isVisited = node.visited;
    return (
      <div
        key={node.id}
        className={cn(
          "absolute -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-md shadow-xs cursor-pointer transition-all hover:-translate-y-[52%]",
          fixed ? "overflow-hidden px-3 py-2.5" : "min-w-[160px] max-w-[240px] p-3.5",
          node.collapsedGroupId && "border-dashed",
          node.status && STATUS_BORDER[node.status],
          !node.status && isVisited && "border-l-[3px] border-l-emerald-500/70",
          isSelected && "border-primary ring-2 ring-primary bg-primary/5"
        )}
        style={style}
        onClick={() => handleNodeClick(node.id, node.collapsedGroupId)}
        title={node.label}
      >
        {showHandles && !node.collapsedGroupId && (
          <>
            {direction === "TB" ? (
              <>
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 size-2 rounded-full bg-background border border-border pointer-events-none" aria-hidden="true" />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-2 rounded-full bg-background border border-border pointer-events-none" aria-hidden="true" />
              </>
            ) : (
              <>
                <span className="absolute -left-1 top-1/2 -translate-y-1/2 size-2 rounded-full bg-background border border-border pointer-events-none" aria-hidden="true" />
                <span className="absolute -right-1 top-1/2 -translate-y-1/2 size-2 rounded-full bg-background border border-border pointer-events-none" aria-hidden="true" />
              </>
            )}
          </>
        )}
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5 min-w-0">
            {isVisited && (
              <span
                className="inline-flex items-center justify-center size-3.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold shrink-0"
                title="Visited"
                aria-label="Visited"
              >
                ✓
              </span>
            )}
            <span
              className={cn(
                "font-mono text-sm font-medium tracking-tight text-foreground",
                wrapLabels ? "whitespace-normal break-words leading-tight" : "truncate"
              )}
              title={node.label}
            >
              {node.collapsedGroupId ? `+ ${node.label}` : node.label}
            </span>
          </div>
          {node.badge && (
            <span className="font-mono text-xs font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0">
              {node.badge}
            </span>
          )}
        </div>
        {node.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{node.description}</p>
        )}
      </div>
    );
  };

  const labelClass =
    "absolute -translate-x-1/2 -translate-y-1/2 bg-background border border-border rounded px-2 py-0.5 font-mono text-xs font-medium text-foreground shadow-xs z-30";

  const viewportMinHeight = minHeight !== undefined ? minHeight : compact ? "240px" : "380px";
  const viewportMinWidth = minWidth !== undefined ? minWidth : undefined;

  return (
    <div
      className={cn(
        "flex flex-col border border-border rounded-lg bg-card overflow-hidden shadow-xs my-6",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between p-3.5 bg-background border-b border-border flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <span className="font-heading font-bold text-base text-foreground">{title}</span>
          {subtitle && <span className="text-sm text-muted-foreground">{subtitle}</span>}
        </div>
        {badge && <div>{badge}</div>}
      </div>

      <div
        className={cn(
          "relative w-full overflow-x-auto overflow-y-hidden bg-background",
          compact ? "p-3.5" : "p-6"
        )}
        style={{
          minHeight: viewportMinHeight,
          minWidth: viewportMinWidth,
        }}
      >
        {layout ? (
          <div
            className="relative z-20 mx-auto"
            style={{
              width: layout.width,
              height: layout.height,
              transform: zoom !== 1 ? `scale(${zoom})` : undefined,
              transformOrigin: "top left",
              transition: "transform 0.15s ease-out",
            }}
          >
            {pxGroups.map((b) => renderGroup(b.id, { left: b.x, top: b.y, width: b.w, height: b.h }))}

            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              width={layout.width}
              height={layout.height}
              viewBox={`0 0 ${layout.width} ${layout.height}`}
            >
              <defs>
                <marker id="aui-reg-arrow-px" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" className="fill-muted-foreground" />
                </marker>
                <marker id="aui-reg-arrow-px-active" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" className="fill-primary" />
                </marker>
              </defs>
              {pxEdges.map((e) => {
                const conn = connections[e.index];
                const isActive = activeNodeId === conn.from || activeNodeId === conn.to;
                return (
                  <g key={`edge-${e.index}`}>
                    <path
                      d={e.path}
                      fill="none"
                      className={cn(conn.animated && "animate-pulse")}
                      stroke={isActive ? "hsl(var(--primary))" : "hsl(var(--border))"}
                      strokeWidth={isActive ? 2 : 1.5}
                      strokeDasharray={conn.variant === "dashed" ? "4 4" : undefined}
                      markerEnd={isActive ? "url(#aui-reg-arrow-px-active)" : "url(#aui-reg-arrow-px)"}
                    />
                    {conn.animated && (
                      <circle r="3.5" className="fill-primary">
                        <animateMotion path={e.path} dur="2.4s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>

            {pxEdges.map((e) => {
              const label = connections[e.index].label;
              if (!label) return null;
              return (
                <div key={`label-${e.index}`} className={labelClass} style={{ left: e.mx, top: e.my }}>
                  {label}
                </div>
              );
            })}

            {nodes.map((node) => {
              const c = center(node.id);
              if (!c) return null;
              return renderNode(node, { left: c.x, top: c.y, width: ARCH_NODE_W, height: ARCH_NODE_H }, true);
            })}
          </div>
        ) : (
          <>
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <marker
                  id="aui-reg-arrow"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" className="fill-muted-foreground" />
                </marker>
                <marker
                  id="aui-reg-arrow-active"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" className="fill-primary" />
                </marker>
              </defs>

              {connections.map((conn, idx) => {
                const src = nodeMap.get(conn.from);
                const dst = nodeMap.get(conn.to);
                if (!src || !dst) return null;

                const isConnActive = activeNodeId === conn.from || activeNodeId === conn.to;
                const strokeColor = isConnActive ? "hsl(var(--primary))" : "hsl(var(--border))";
                const edgeRouting = conn.routing ?? routing;
                const geom = buildEdgePath(
                  src.x as number,
                  src.y as number,
                  dst.x as number,
                  dst.y as number,
                  edgeRouting,
                  direction
                );

                return (
                  <g key={`edge-${idx}`}>
                    <path
                      d={geom.path}
                      fill="none"
                      className={cn(conn.animated && "animate-pulse")}
                      stroke={strokeColor}
                      strokeWidth={isConnActive ? 2 : 1.5}
                      strokeDasharray={conn.variant === "dashed" ? "4 4" : undefined}
                      markerEnd={isConnActive ? "url(#aui-reg-arrow-active)" : "url(#aui-reg-arrow)"}
                    />
                    {conn.animated && (
                      <circle r="3.5" className="fill-primary">
                        <animateMotion path={geom.path} dur="2.4s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>

            <div
              className="relative z-20 w-full min-w-[640px] h-full min-h-[320px]"
              style={{
                transform: zoom !== 1 ? `scale(${zoom})` : undefined,
                transformOrigin: "top left",
                transition: "transform 0.15s ease-out",
              }}
            >
              {pctGroups.map((g) => renderGroup(g.id, g.style))}

              {connections.map((conn, idx) => {
                if (!conn.label) return null;
                const src = nodeMap.get(conn.from);
                const dst = nodeMap.get(conn.to);
                if (!src || !dst) return null;

                const edgeRouting = conn.routing ?? routing;
                const geom = buildEdgePath(
                  src.x as number,
                  src.y as number,
                  dst.x as number,
                  dst.y as number,
                  edgeRouting,
                  direction
                );

                return (
                  <div key={`label-${idx}`} className={labelClass} style={{ left: `${geom.mx}%`, top: `${geom.my}%` }}>
                    {conn.label}
                  </div>
                );
              })}

              {nodes.map((node) => renderNode(node, { left: `${node.x}%`, top: `${node.y}%` }, false))}
            </div>
          </>
        )}

        {showControls && (
          <div className="absolute bottom-3 right-3 inline-flex items-center bg-card border border-border rounded-md shadow-xs z-30 overflow-hidden" role="toolbar" aria-label="Canvas zoom controls">
            <button
              type="button"
              className="inline-flex items-center justify-center size-6.5 text-muted-foreground hover:text-foreground hover:bg-muted font-mono text-sm font-medium border-r border-border"
              onClick={handleZoomIn}
              title="Zoom in"
              aria-label="Zoom in"
            >
              +
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center size-6.5 text-muted-foreground hover:text-foreground hover:bg-muted font-mono text-sm font-medium border-r border-border"
              onClick={handleZoomOut}
              title="Zoom out"
              aria-label="Zoom out"
            >
              −
            </button>
            <button
              type="button"
              className="px-1.5 font-mono text-[0.7rem] text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={handleZoomReset}
              title="Reset zoom"
              aria-label="Reset zoom"
            >
              {Math.round(zoom * 100)}%
            </button>
          </div>
        )}
      </div>

      {activeNode && (
        <div className="p-3.5 bg-card border-t border-border flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-medium text-foreground">
              Inspecting: {activeNode.label}
            </span>
            {activeNode.badge && (
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                {activeNode.badge}
              </span>
            )}
          </div>
          {activeNode.metadata && (
            <div className="flex items-center gap-4 flex-wrap">
              {Object.entries(activeNode.metadata).map(([key, val]) => (
                <div key={key} className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                  <span>{key}:</span>
                  <strong className="text-foreground">{val}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
