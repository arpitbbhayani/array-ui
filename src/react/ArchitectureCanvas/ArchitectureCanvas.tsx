"use client";

import React, { useState } from "react";
import { cn } from "../../utils/cn";

export interface ArchitectureNodeItem {
  id: string;
  label: string;
  badge?: string;
  description?: string;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
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

export const ArchitectureCanvas = React.forwardRef<HTMLDivElement, ArchitectureCanvasProps>(
  (
    {
      title = "System Architecture",
      subtitle,
      badge,
      nodes,
      connections = [],
      selectedNodeId: controlledSelected,
      onNodeSelect,
      className,
      ...props
    },
    ref
  ) => {
    const [internalSelected, setInternalSelected] = useState<string | null>(
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
      <div ref={ref} className={cn("aui-arch-canvas", className)} {...props}>
        <div className="aui-arch-header">
          <div className="aui-arch-title-group">
            <span className="aui-arch-title">{title}</span>
            {subtitle && <span className="aui-arch-subtitle">{subtitle}</span>}
          </div>
          {badge && <div className="aui-canvas-badge">{badge}</div>}
        </div>

        <div className="aui-arch-viewport">
          <svg className="aui-arch-svg-layer" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <marker
                id="aui-arch-arrow"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--aui-border-strong)" />
              </marker>
              <marker
                id="aui-arch-arrow-active"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--aui-primary)" />
              </marker>
            </defs>

            {connections.map((conn, idx) => {
              const src = nodeMap.get(conn.from);
              const dst = nodeMap.get(conn.to);
              if (!src || !dst) return null;

              const isConnActive = activeNodeId === conn.from || activeNodeId === conn.to;
              const strokeColor = isConnActive ? "var(--aui-primary)" : "var(--aui-border-strong)";

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
                    markerEnd={isConnActive ? "url(#aui-arch-arrow-active)" : "url(#aui-arch-arrow)"}
                  />
                  {conn.animated && (
                    <circle r="3" fill="var(--aui-primary)">
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

          <div className="aui-arch-nodes-container">
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
                  className="aui-arch-edge-label-box"
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
                  className={cn("aui-arch-node", isSelected && "is-selected")}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  onClick={() => handleNodeClick(node.id)}
                >
                  <div className="aui-arch-node-top">
                    <span className="aui-arch-node-name">{node.label}</span>
                    {node.badge && <span className="aui-arch-node-badge">{node.badge}</span>}
                  </div>
                  {node.description && <p className="aui-arch-node-desc">{node.description}</p>}
                </div>
              );
            })}
          </div>
        </div>

        {activeNode && (
          <div className="aui-arch-inspector">
            <div className="flex items-center gap-2">
              <span className="aui-arch-inspector-title">Inspecting: {activeNode.label}</span>
              {activeNode.badge && <span className="aui-arch-node-badge">{activeNode.badge}</span>}
            </div>
            {activeNode.metadata && (
              <div className="aui-arch-inspector-meta">
                {Object.entries(activeNode.metadata).map(([key, val]) => (
                  <div key={key} className="aui-arch-meta-item">
                    <span>{key}:</span>
                    <strong>{val}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

ArchitectureCanvas.displayName = "ArchitectureCanvas";
