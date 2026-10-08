import type { Node, Edge } from "@xyflow/react";
import type {
  ArchitectureConnectionItem,
  ArchitectureDirection,
  ArchitectureEdgeRouting,
  ArchitectureGroupItem,
  ArchitectureNodeItem,
  ArchitectureStatus,
} from "../ArchitectureCanvas/layout";

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
  count?: number;
}

export type ArrayUIFlowNode = Node<ArrayUINodeData, "architecture">;
export type ArrayUIFlowGroupNode = Node<ArrayUIGroupNodeData, "group">;
export type ArrayUIFlowNodeUnion = ArrayUIFlowNode | ArrayUIFlowGroupNode;

export interface ToReactFlowOptions {
  direction?: ArchitectureDirection;
  defaultRouting?: ArchitectureEdgeRouting;
}
