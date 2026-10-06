"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

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

export function ClusterState({
  title = "Cluster Topology",
  nodes,
  requiredQuorum,
  onNodeClick,
  className,
  ...props
}: ClusterStateProps) {
  const totalNodes = nodes.length;
  const activeNodes = nodes.filter((n) => n.role !== "offline").length;
  const quorum = requiredQuorum ?? Math.floor(totalNodes / 2) + 1;
  const isQuorumReached = activeNodes >= quorum;

  const getNodeRoleStyle = (role: string) => {
    switch (role) {
      case "leader":
        return "border-primary bg-primary/10 ring-1 ring-primary";
      case "candidate":
        return "border-amber-500 bg-amber-500/10";
      case "offline":
        return "border-dashed border-border opacity-50 bg-muted";
      default:
        return "border-border bg-card";
    }
  };

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-4 space-y-4 my-4 shadow-xs",
        className
      )}
      {...props}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-xs font-bold text-foreground">
          {title}
        </span>
        <div
          className={cn(
            "font-mono text-xs font-semibold px-2 py-0.5 rounded border",
            isQuorumReached
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
          )}
        >
          Quorum: {activeNodes}/{totalNodes} {isQuorumReached ? "Achieved" : "Lost"} (Need {quorum})
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {nodes.map((node) => (
          <div
            key={node.id}
            className={cn(
              "flex flex-col p-3 rounded-md border transition-all cursor-pointer hover:-translate-y-0.5",
              getNodeRoleStyle(node.role)
            )}
            onClick={() => onNodeClick?.(node.id)}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs font-bold text-foreground">
                {node.id}
              </span>
              <span
                className={cn(
                  "w-2 h-2 rounded-full",
                  node.role === "leader" && "bg-primary shadow-xs",
                  node.role === "offline" && "bg-muted-foreground",
                  node.role !== "leader" && node.role !== "offline" && "bg-emerald-500"
                )}
              />
            </div>
            <span
              className={cn(
                "font-mono text-[10px] font-bold uppercase tracking-wider mb-1",
                node.role === "leader" ? "text-primary" : "text-muted-foreground"
              )}
            >
              {node.role}
            </span>
            {typeof node.term === "number" && (
              <span className="font-mono text-[10px] text-muted-foreground">
                Term {node.term}
              </span>
            )}
            {node.latency && (
              <span className="font-mono text-[10px] text-muted-foreground">
                {node.latency}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
