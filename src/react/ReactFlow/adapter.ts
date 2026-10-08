import type { Edge } from "@xyflow/react";
import {
  ARCH_NODE_H,
  ARCH_NODE_W,
  collapseArchitecture,
  groupBoxes,
  layoutArchitecture,
  type ArchitectureConnectionItem,
  type ArchitectureDirection,
  type ArchitectureGroupItem,
  type ArchitectureNodeItem,
} from "../ArchitectureCanvas/layout";
import type { ArrayUIFlowNode, ArrayUIFlowGroupNode, ToReactFlowOptions } from "./types";

export function toReactFlowNodesAndEdges(
  nodes: ArchitectureNodeItem[],
  connections: ArchitectureConnectionItem[] = [],
  groups: ArchitectureGroupItem[] = [],
  options: ToReactFlowOptions = {}
): {
  nodes: (ArrayUIFlowNode | ArrayUIFlowGroupNode)[];
  edges: Edge[];
} {
  const direction: ArchitectureDirection = options.direction ?? "LR";
  const defaultRouting = options.defaultRouting ?? "smoothstep";

  const { nodes: resolvedNodes, connections: resolvedConnections } = collapseArchitecture(
    nodes,
    connections,
    groups,
    []
  );

  const layout = layoutArchitecture(resolvedNodes, resolvedConnections, groups, direction);

  const flowNodes: (ArrayUIFlowNode | ArrayUIFlowGroupNode)[] = [];

  // 1. Group nodes (boundaries)
  if (layout) {
    const center = (id: string) => layout.positions.get(id);
    const boxes = groupBoxes(groups, resolvedNodes, center);
    for (const b of boxes) {
      const g = groups.find((item) => item.id === b.id);
      flowNodes.push({
        id: b.id,
        type: "group",
        position: { x: b.x, y: b.y },
        style: { width: b.w, height: b.h, zIndex: -1, pointerEvents: "none" },
        data: {
          label: g?.label ?? b.id,
          kind: g?.kind,
        },
        draggable: false,
        selectable: false,
      });
    }
  }

  // 2. Member / regular nodes
  for (const n of resolvedNodes) {
    let x = 0;
    let y = 0;
    if (n.x !== undefined && n.y !== undefined && layout) {
      x = (n.x / 100) * layout.width - ARCH_NODE_W / 2;
      y = (n.y / 100) * layout.height - ARCH_NODE_H / 2;
    } else if (layout) {
      const pos = layout.positions.get(n.id);
      if (pos) {
        x = pos.x - ARCH_NODE_W / 2;
        y = pos.y - ARCH_NODE_H / 2;
      }
    }

    flowNodes.push({
      id: n.id,
      type: "architecture",
      position: { x, y },
      data: {
        label: n.label,
        badge: n.badge,
        description: n.description,
        status: n.status,
        visited: n.visited,
        metadata: n.metadata,
        group: n.group,
        direction,
      },
    });
  }

  // 3. Edges
  const flowEdges: Edge[] = resolvedConnections.map((c, i) => {
    const edgeType = c.routing ?? defaultRouting;
    return {
      id: `e-${c.from}-${c.to}-${i}`,
      source: c.from,
      target: c.to,
      type: edgeType,
      animated: c.animated,
      label: c.label,
      style: {
        stroke: c.status === "primary" ? "var(--aui-primary)" : "var(--aui-border-strong)",
        strokeWidth: 1.5,
        strokeDasharray: c.variant === "dashed" ? "4 4" : undefined,
      },
      labelStyle: {
        fontFamily: "var(--aui-font-mono)",
        fontSize: "0.76rem",
        fontWeight: 600,
        fill: "var(--aui-text-primary)",
      },
      labelBgStyle: {
        fill: "var(--aui-bg-primary)",
        stroke: "var(--aui-border-color)",
        strokeWidth: 1,
        rx: 4,
        ry: 4,
      },
      labelBgPadding: [6, 3] as [number, number],
    };
  });

  return { nodes: flowNodes, edges: flowEdges };
}
