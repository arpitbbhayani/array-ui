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

export interface ArchitectureConnectionItem {
  from: string;
  to: string;
  label?: string;
  animated?: boolean;
  variant?: "solid" | "dashed";
  status?: "ok" | "warn" | "err" | "primary";
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
}

/** Edge segments in px, clipped to node boxes. Opposite edges between the same pair are offset apart. */
export function routeEdges(
  connections: ArchitectureConnectionItem[],
  center: (id: string) => { x: number; y: number } | undefined
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
    const start = clipToRect(ac.x, ac.y, bc.x, bc.y, hw, hh);
    const end = clipToRect(bc.x, bc.y, ac.x, ac.y, hw + 3, hh + 3);
    edges.push({
      index,
      x1: start.x,
      y1: start.y,
      x2: end.x,
      y2: end.y,
      mx: (start.x + end.x) / 2,
      my: (start.y + end.y) / 2,
    });
  });
  return edges;
}
