"use client";

import * as React from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
  type ReactFlowProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { cn } from "@/lib/utils";

export type ArchitectureStatus = "ok" | "warn" | "err" | "info";
export type ArchitectureDirection = "LR" | "TB";
export type ArchitectureEdgeRouting = "smoothstep" | "bezier" | "straight";

export interface ArchitectureNodeItem {
  id: string;
  label: string;
  badge?: string;
  description?: string;
  x?: number;
  y?: number;
  status?: ArchitectureStatus;
  metadata?: Record<string, string>;
  group?: string;
  visited?: boolean;
}

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
}

export interface ArrayUINodeData extends Record<string, unknown> {
  label: string;
  badge?: string;
  description?: string;
  status?: ArchitectureStatus;
  visited?: boolean;
  metadata?: Record<string, string>;
  group?: string;
  direction?: ArchitectureDirection;
}

export interface ArrayUIGroupNodeData extends Record<string, unknown> {
  label: string;
  kind?: "service" | "layer" | "package" | "external";
}

export type ArrayUIFlowNode = Node<ArrayUINodeData, "architecture">;
export type ArrayUIFlowGroupNode = Node<ArrayUIGroupNodeData, "group">;

const STATUS_BORDER: Record<ArchitectureStatus, string> = {
  ok: "border-l-[3px] border-l-emerald-500",
  info: "",
  warn: "border-l-[3px] border-l-amber-500",
  err: "border-l-[3px] border-l-rose-500",
};

export const ArrayUINode: React.FC<NodeProps<ArrayUIFlowNode>> = ({ data, selected }) => {
  const isTB = data.direction === "TB";
  const targetPos = isTB ? Position.Top : Position.Left;
  const sourcePos = isTB ? Position.Bottom : Position.Right;

  return (
    <div
      className={cn(
        "relative bg-card border border-border rounded-md shadow-xs transition-all hover:border-primary/60 cursor-grab",
        selected && "border-primary ring-2 ring-primary bg-primary/5",
        data.status && STATUS_BORDER[data.status],
        !data.status && data.visited && "border-l-[3px] border-l-emerald-500"
      )}
      style={{ width: 184, minHeight: 72, padding: "0.6rem 0.8rem" }}
    >
      <Handle
        type="target"
        position={targetPos}
        className="!size-2 !rounded-full !bg-background !border !border-border hover:!bg-primary hover:!border-primary"
      />

      <div className="flex items-center justify-between gap-1.5 mb-1">
        <div className="flex items-center gap-1.5 min-w-0">
          {data.visited && (
            <span
              className="inline-flex items-center justify-center size-3.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-medium shrink-0"
              title="Visited"
              aria-label="Visited"
            >
              ✓
            </span>
          )}
          <span className="font-mono text-sm font-medium tracking-tight text-foreground truncate" title={data.label}>
            {data.label}
          </span>
        </div>
        {data.badge && (
          <span className="font-mono text-xs font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0">
            {data.badge}
          </span>
        )}
      </div>

      {data.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{data.description}</p>
      )}

      <Handle
        type="source"
        position={sourcePos}
        className="!size-2 !rounded-full !bg-background !border !border-border hover:!bg-primary hover:!border-primary"
      />
    </div>
  );
};

export const ArrayUIGroupNode: React.FC<NodeProps<ArrayUIFlowGroupNode>> = ({ data, selected }) => {
  return (
    <div
      className={cn(
        "w-full h-full relative rounded-md border border-dashed border-border bg-card/40 pointer-events-none",
        selected && "border-primary"
      )}
    >
      <div className="flex items-center gap-2 h-7 px-2.5 font-mono text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{data.label}</span>
        {data.kind && <span className="uppercase tracking-wider text-[0.68rem]">{data.kind}</span>}
      </div>
    </div>
  );
};

export const arrayUINodeTypes = {
  architecture: ArrayUINode,
  group: ArrayUIGroupNode,
};

export function toReactFlowNodesAndEdges(
  nodes: ArchitectureNodeItem[],
  connections: ArchitectureConnectionItem[] = [],
  groups: ArchitectureGroupItem[] = [],
  options: { direction?: ArchitectureDirection; defaultRouting?: ArchitectureEdgeRouting } = {}
): {
  nodes: (ArrayUIFlowNode | ArrayUIFlowGroupNode)[];
  edges: Edge[];
} {
  const direction = options.direction ?? "LR";
  const defaultRouting = options.defaultRouting ?? "smoothstep";

  const flowNodes: (ArrayUIFlowNode | ArrayUIFlowGroupNode)[] = [];

  // Group nodes
  for (const g of groups) {
    const members = nodes.filter((n) => n.group === g.id);
    if (members.length === 0) continue;
    flowNodes.push({
      id: g.id,
      type: "group",
      position: { x: 0, y: 0 },
      style: { width: "100%", height: "100%", zIndex: -1 },
      data: { label: g.label, kind: g.kind },
      draggable: false,
      selectable: false,
    });
  }

  // Member nodes
  nodes.forEach((n, idx) => {
    const defaultX = direction === "LR" ? idx * 240 + 40 : 120;
    const defaultY = direction === "LR" ? 120 : idx * 140 + 40;
    const x = n.x !== undefined ? n.x * 6 : defaultX;
    const y = n.y !== undefined ? n.y * 4 : defaultY;

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
  });

  // Edges
  const flowEdges: Edge[] = connections.map((c, i) => ({
    id: `e-${c.from}-${c.to}-${i}`,
    source: c.from,
    target: c.to,
    type: c.routing ?? defaultRouting,
    animated: c.animated,
    label: c.label,
    style: {
      stroke: c.status === "primary" ? "hsl(var(--primary))" : "hsl(var(--border))",
      strokeWidth: 1.5,
      strokeDasharray: c.variant === "dashed" ? "4 4" : undefined,
    },
  }));

  return { nodes: flowNodes, edges: flowEdges };
}

export interface ReactFlowCanvasProps extends Omit<ReactFlowProps, "nodes" | "edges" | "height"> {
  title?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  nodes?: ArchitectureNodeItem[] | Node[];
  connections?: ArchitectureConnectionItem[];
  groups?: ArchitectureGroupItem[];
  direction?: ArchitectureDirection;
  defaultRouting?: ArchitectureEdgeRouting;
  edges?: Edge[];
  height?: number | string;
  showControls?: boolean;
  showBackground?: boolean;
}

export function ReactFlowCanvas({
  title = "System Architecture",
  subtitle,
  badge,
  nodes: inputNodes = [],
  connections = [],
  groups = [],
  direction = "LR",
  defaultRouting = "smoothstep",
  edges: controlledEdges,
  height = 480,
  showControls = true,
  showBackground = true,
  className,
  ...props
}: ReactFlowCanvasProps) {
  const isArrayUINodes =
    inputNodes.length === 0 ||
    !("position" in (inputNodes[0] as Record<string, unknown>));

  const { nodes, edges } = React.useMemo(() => {
    if (!isArrayUINodes) {
      return {
        nodes: inputNodes as Node[],
        edges: controlledEdges ?? [],
      };
    }
    return toReactFlowNodesAndEdges(
      inputNodes as ArchitectureNodeItem[],
      connections,
      groups,
      { direction, defaultRouting }
    );
  }, [isArrayUINodes, inputNodes, connections, groups, direction, defaultRouting, controlledEdges]);

  return (
    <div
      className={cn(
        "flex flex-col border border-border rounded-lg bg-card overflow-hidden shadow-xs my-6",
        className
      )}
    >
      {(title || badge) && (
        <div className="flex items-center justify-between p-3.5 bg-background border-b border-border flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <span className="font-heading font-bold text-base text-foreground">{title}</span>
            {subtitle && <span className="text-sm text-muted-foreground">{subtitle}</span>}
          </div>
          {badge && <div>{badge}</div>}
        </div>
      )}

      <div style={{ width: "100%", height, position: "relative" }}>
        <ReactFlow
          nodes={nodes}
          edges={controlledEdges ?? edges}
          nodeTypes={arrayUINodeTypes}
          fitView
          {...props}
        >
          {showBackground && (
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1.5}
              color="hsl(var(--border))"
            />
          )}
          {showControls && <Controls />}
        </ReactFlow>
      </div>
    </div>
  );
}
