"use client";

import React, { useMemo } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  type Edge,
  type Node,
  type ReactFlowProps,
} from "@xyflow/react";
import { cn } from "../../utils/cn";
import { ArrayUINode } from "./ArrayUINode";
import { ArrayUIGroupNode } from "./ArrayUIGroupNode";
import { toReactFlowNodesAndEdges } from "./adapter";
import type {
  ArchitectureConnectionItem,
  ArchitectureDirection,
  ArchitectureEdgeRouting,
  ArchitectureGroupItem,
  ArchitectureNodeItem,
} from "../ArchitectureCanvas/layout";

export const arrayUINodeTypes = {
  architecture: ArrayUINode,
  group: ArrayUIGroupNode,
};

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

export const ReactFlowCanvas = React.forwardRef<HTMLDivElement, ReactFlowCanvasProps>(
  (
    {
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
    },
    ref
  ) => {
    const isArrayUINodes =
      inputNodes.length === 0 ||
      !("position" in (inputNodes[0] as Record<string, unknown>));

    const { nodes, edges } = useMemo(() => {
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
        ref={ref}
        className={cn("aui-arch-canvas", className)}
        style={{ margin: "1.5rem 0" }}
      >
        {(title || badge) && (
          <div className="aui-arch-header">
            <div className="aui-arch-title-group">
              <span className="aui-arch-title">{title}</span>
              {subtitle && <span className="aui-arch-subtitle">{subtitle}</span>}
            </div>
            {badge && <div className="aui-canvas-badge">{badge}</div>}
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
                color="var(--aui-border-strong)"
              />
            )}
            {showControls && <Controls />}
          </ReactFlow>
        </div>
      </div>
    );
  }
);

ReactFlowCanvas.displayName = "ReactFlowCanvas";
