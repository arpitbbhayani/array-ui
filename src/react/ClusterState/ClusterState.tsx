"use client";

import React from "react";
import { cn } from "../../utils/cn";

export interface ClusterNodeItem {
  id: string;
  role: "leader" | "follower" | "candidate" | "offline";
  term?: number;
  latency?: string;
  state?: string;
}

export interface ClusterStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  nodes: ClusterNodeItem[];
  requiredQuorum?: number;
  onNodeClick?: (nodeId: string) => void;
}

export const ClusterState = React.forwardRef<HTMLDivElement, ClusterStateProps>(
  (
    {
      title = "Cluster Topology",
      nodes,
      requiredQuorum,
      onNodeClick,
      className,
      ...props
    },
    ref
  ) => {
    const totalNodes = nodes.length;
    const activeNodes = nodes.filter((n) => n.role !== "offline").length;
    const quorum = requiredQuorum ?? Math.floor(totalNodes / 2) + 1;
    const isQuorumReached = activeNodes >= quorum;

    const getNodeRoleClass = (role: string) => {
      switch (role) {
        case "leader":
          return "aui-cluster-node-leader";
        case "candidate":
          return "aui-cluster-node-candidate";
        case "offline":
          return "aui-cluster-node-offline";
        default:
          return "";
      }
    };

    return (
      <div ref={ref} className={cn("aui-cluster-state", className)} {...props}>
        <div className="aui-cluster-header">
          <div className="aui-cluster-title">{title}</div>
          <div
            className={cn(
              "aui-cluster-quorum-badge",
              !isQuorumReached && "is-compromised"
            )}
          >
            Quorum: {activeNodes}/{totalNodes} {isQuorumReached ? "Achieved" : "Lost"} (Need {quorum})
          </div>
        </div>

        <div className="aui-cluster-grid">
          {nodes.map((node) => (
            <div
              key={node.id}
              className={cn("aui-cluster-node", getNodeRoleClass(node.role))}
              onClick={() => onNodeClick?.(node.id)}
            >
              <div className="aui-cluster-node-header">
                <span className="aui-cluster-node-id">{node.id}</span>
                <span className="aui-cluster-node-dot" />
              </div>
              <span className="aui-cluster-node-role">{node.role}</span>
              {typeof node.term === "number" && (
                <span className="aui-cluster-node-term">Term {node.term}</span>
              )}
              {node.latency && (
                <span className="aui-cluster-node-term font-mono">
                  {node.latency}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

ClusterState.displayName = "ClusterState";
