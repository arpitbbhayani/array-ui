"use client";

import React, { useMemo, useState } from "react";
import { cn } from "../../utils/cn";
import {
  ARCH_GROUP_PAD,
  ARCH_NODE_H,
  ARCH_NODE_W,
  buildEdgePath,
  collapseArchitecture,
  groupBoxes,
  initialCollapsedGroups,
  layoutArchitecture,
  routeEdges,
  type ArchitectureConnectionItem,
  type ArchitectureDirection,
  type ArchitectureEdgeRouting,
  type ArchitectureGroupItem,
  type ArchitectureNodeItem,
} from "./layout";

export type {
  ArchitectureConnectionItem,
  ArchitectureDirection,
  ArchitectureEdgeRouting,
  ArchitectureGroupItem,
  ArchitectureNodeItem,
} from "./layout";

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

const PX_MARKERS = (
  <defs>
    <marker id="aui-arch-arrow-px" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--aui-border-strong)" />
    </marker>
    <marker id="aui-arch-arrow-px-active" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--aui-primary)" />
    </marker>
  </defs>
);

export const ArchitectureCanvas = React.forwardRef<HTMLDivElement, ArchitectureCanvasProps>(
  (
    {
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
    },
    ref
  ) => {
    const [collapsed, setCollapsed] = useState<string[]>(() => initialCollapsedGroups(groups));
    const [internalSelected, setInternalSelected] = useState<string | null>(
      inputNodes.length > 0 ? inputNodes[0].id : null
    );
    const [zoom, setZoom] = useState(1);

    const handleZoomIn = () => setZoom((z) => Math.min(2.0, Math.round((z + 0.15) * 100) / 100));
    const handleZoomOut = () => setZoom((z) => Math.max(0.5, Math.round((z - 0.15) * 100) / 100));
    const handleZoomReset = () => setZoom(1);

    const { nodes, connections } = useMemo(
      () => collapseArchitecture(inputNodes, inputConnections, groups, collapsed),
      [inputNodes, inputConnections, groups, collapsed]
    );
    const layout = useMemo(
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
        <div key={`group-${id}`} className={cn("aui-arch-group", g.kind && `aui-arch-group-${g.kind}`)} style={style}>
          <div className="aui-arch-group-head">
            <button
              type="button"
              className="aui-arch-group-toggle"
              aria-expanded="true"
              aria-label={`Collapse ${g.label}`}
              onClick={() => toggleGroup(id)}
            >
              -
            </button>
            <span className="aui-arch-group-label">{g.label}</span>
            {g.kind && <span className="aui-arch-group-kind">{g.kind}</span>}
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
            "aui-arch-node",
            fixed && "is-fixed",
            node.collapsedGroupId && "is-group",
            node.status && `is-${node.status}`,
            isVisited && "is-visited is-done",
            isSelected && "is-selected"
          )}
          style={style}
          onClick={() => handleNodeClick(node.id, node.collapsedGroupId)}
          title={node.label}
        >
          {showHandles && !node.collapsedGroupId && (
            <>
              {direction === "TB" ? (
                <>
                  <span className="aui-arch-handle aui-arch-handle-top" aria-hidden="true" />
                  <span className="aui-arch-handle aui-arch-handle-bottom" aria-hidden="true" />
                </>
              ) : (
                <>
                  <span className="aui-arch-handle aui-arch-handle-left" aria-hidden="true" />
                  <span className="aui-arch-handle aui-arch-handle-right" aria-hidden="true" />
                </>
              )}
            </>
          )}
          <div className="aui-arch-node-top">
            <div className="aui-arch-node-title-group" style={{ display: "flex", alignItems: "center", gap: "0.35rem", minWidth: 0 }}>
              {isVisited && (
                <span className="aui-arch-node-visited-icon" aria-label="Visited" title="Visited">
                  ✓
                </span>
              )}
              <span
                className={cn(
                  "aui-arch-node-name",
                  wrapLabels && "is-wrapped"
                )}
                title={node.label}
              >
                {node.collapsedGroupId ? `+ ${node.label}` : node.label}
              </span>
            </div>
            {node.badge && <span className="aui-arch-node-badge">{node.badge}</span>}
          </div>
          {node.description && <p className="aui-arch-node-desc">{node.description}</p>}
        </div>
      );
    };

    return (
      <div ref={ref} className={cn("aui-arch-canvas", className)} {...props}>
        <div className="aui-arch-header">
          <div className="aui-arch-title-group">
            <span className="aui-arch-title">{title}</span>
            {subtitle && <span className="aui-arch-subtitle">{subtitle}</span>}
          </div>
          {badge && <div className="aui-canvas-badge">{badge}</div>}
        </div>

        <div
          className={cn("aui-arch-viewport", compact && "is-compact")}
          style={{
            minHeight: minHeight !== undefined ? minHeight : compact ? "240px" : undefined,
            minWidth: minWidth !== undefined ? minWidth : undefined,
          }}
        >
          {layout ? (
            <div
              className="aui-arch-nodes-container is-px"
              style={{
                width: layout.width,
                height: layout.height,
                transform: zoom !== 1 ? `scale(${zoom})` : undefined,
                transformOrigin: "top left",
                transition: "transform 0.15s ease-out",
              }}
            >
              {pxGroups.map((b) =>
                renderGroup(b.id, { left: b.x, top: b.y, width: b.w, height: b.h })
              )}

              <svg
                className="aui-arch-svg-layer"
                width={layout.width}
                height={layout.height}
                viewBox={`0 0 ${layout.width} ${layout.height}`}
              >
                {PX_MARKERS}
                {pxEdges.map((e) => {
                  const conn = connections[e.index];
                  const isActive = activeNodeId === conn.from || activeNodeId === conn.to;
                  return (
                    <g key={`edge-${e.index}`}>
                      <path
                        d={e.path}
                        fill="none"
                        className={cn("aui-arch-edge", conn.animated && "is-animated")}
                        stroke={isActive ? "var(--aui-primary)" : "var(--aui-border-strong)"}
                        strokeWidth={isActive ? 2 : 1.5}
                        strokeDasharray={conn.variant === "dashed" ? "4 4" : undefined}
                        markerEnd={isActive ? "url(#aui-arch-arrow-px-active)" : "url(#aui-arch-arrow-px)"}
                      />
                      {conn.animated && (
                        <circle r="3.5" fill="var(--aui-primary)">
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
                  <div key={`label-${e.index}`} className="aui-arch-edge-label-box" style={{ left: e.mx, top: e.my }}>
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
                        className={cn("aui-arch-edge", conn.animated && "is-animated")}
                        stroke={strokeColor}
                        strokeWidth={isConnActive ? 2 : 1.5}
                        strokeDasharray={conn.variant === "dashed" ? "4 4" : undefined}
                        markerEnd={isConnActive ? "url(#aui-arch-arrow-active)" : "url(#aui-arch-arrow)"}
                      />
                      {conn.animated && (
                        <circle r="3.5" fill="var(--aui-primary)">
                          <animateMotion path={geom.path} dur="2.4s" repeatCount="indefinite" />
                        </circle>
                      )}
                    </g>
                  );
                })}
              </svg>

              <div
                className="aui-arch-nodes-container"
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
                    <div
                      key={`label-${idx}`}
                      className="aui-arch-edge-label-box"
                      style={{ left: `${geom.mx}%`, top: `${geom.my}%` }}
                    >
                      {conn.label}
                    </div>
                  );
                })}

                {nodes.map((node) =>
                  renderNode(node, { left: `${node.x}%`, top: `${node.y}%` }, false)
                )}
              </div>
            </>
          )}

          {showControls && (
            <div className="aui-arch-controls" role="toolbar" aria-label="Canvas zoom controls">
              <button
                type="button"
                className="aui-arch-control-btn"
                onClick={handleZoomIn}
                title="Zoom in"
                aria-label="Zoom in"
              >
                +
              </button>
              <button
                type="button"
                className="aui-arch-control-btn"
                onClick={handleZoomOut}
                title="Zoom out"
                aria-label="Zoom out"
              >
                −
              </button>
              <button
                type="button"
                className="aui-arch-control-btn aui-arch-control-reset"
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
