"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ArchitectureNodeItem {
  id: string;
  label: string;
  badge?: string;
  description?: string;
  x: number;
  y: number;
  status?: "ok" | "warn" | "err" | "info";
  metadata?: Record<string, string>;
}

export interface ArchitectureConnectionItem {
  from: string;
  to: string;
  label?: string;
  animated?: boolean;
  variant?: "solid" | "dashed";
  status?: "ok" | "warn" | "err" | "primary";
}

export interface ArchitectureCanvasProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  nodes: ArchitectureNodeItem[];
  connections?: ArchitectureConnectionItem[];
  selectedNodeId?: string;
  onNodeSelect?: (nodeId: string) => void;
}

export function ArchitectureCanvas({
  title = "System Architecture",
  subtitle,
  badge,
  nodes,
  connections = [],
  selectedNodeId: controlledSelected,
  onNodeSelect,
  className,
  ...props
}: ArchitectureCanvasProps) {
  const [internalSelected, setInternalSelected] = React.useState<string | null>(
    nodes.length > 0 ? nodes[0].id : null
  );

  const activeNodeId = controlledSelected !== undefined ? controlledSelected : internalSelected;
  const activeNode = nodes.find((n) => n.id === activeNodeId);

  const handleNodeClick = (id: string) => {
    if (controlledSelected === undefined) {
      setInternalSelected(id);
    }
    onNodeSelect?.(id);
  };

  const nodeMap = new Map<string, ArchitectureNodeItem>();
  nodes.forEach((n) => nodeMap.set(n.id, n));

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

      <div className="relative min-h-[380px] w-full overflow-x-auto overflow-y-hidden bg-background p-6">
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

            return (
              <g key={`edge-${idx}`}>
                <line
                  x1={`${src.x}%`}
                  y1={`${src.y}%`}
                  x2={`${dst.x}%`}
                  y2={`${dst.y}%`}
                  stroke={strokeColor}
                  strokeWidth={isConnActive ? "2" : "1.5"}
                  strokeDasharray={conn.variant === "dashed" ? "4 4" : undefined}
                  markerEnd={isConnActive ? "url(#aui-reg-arrow-active)" : "url(#aui-reg-arrow)"}
                />
                {conn.animated && (
                  <circle r="3" className="fill-primary">
                    <animate
                      attributeName="cx"
                      from={`${src.x}%`}
                      to={`${dst.x}%`}
                      dur="2.4s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="cy"
                      from={`${src.y}%`}
                      to={`${dst.y}%`}
                      dur="2.4s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0;1;1;0"
                      dur="2.4s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>

        <div className="relative z-20 w-full min-w-[640px] h-full min-h-[320px]">
          {connections.map((conn, idx) => {
            if (!conn.label) return null;
            const src = nodeMap.get(conn.from);
            const dst = nodeMap.get(conn.to);
            if (!src || !dst) return null;

            const midX = (src.x + dst.x) / 2;
            const midY = (src.y + dst.y) / 2;

            return (
              <div
                key={`label-${idx}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 bg-background border border-border rounded px-2 py-0.5 font-mono text-xs font-semibold text-foreground shadow-xs z-30"
                style={{ left: `${midX}%`, top: `${midY}%` }}
              >
                {conn.label}
              </div>
            );
          })}

          {nodes.map((node) => {
            const isSelected = node.id === activeNodeId;
            return (
              <div
                key={node.id}
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 min-w-[160px] max-w-[240px] p-3.5 bg-card border border-border rounded-md shadow-xs cursor-pointer transition-all hover:-translate-y-[52%]",
                  isSelected && "border-primary ring-2 ring-primary bg-primary/5"
                )}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                onClick={() => handleNodeClick(node.id)}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-mono text-sm font-bold text-foreground truncate">
                    {node.label}
                  </span>
                  {node.badge && (
                    <span className="font-mono text-xs font-semibold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      {node.badge}
                    </span>
                  )}
                </div>
                {node.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {node.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {activeNode && (
        <div className="p-3.5 bg-card border-t border-border flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-foreground">
              Inspecting: {activeNode.label}
            </span>
            {activeNode.badge && (
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground font-semibold">
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
