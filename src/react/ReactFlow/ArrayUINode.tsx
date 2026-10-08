"use client";

import React from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { cn } from "../../utils/cn";
import type { ArrayUIFlowNode } from "./types";

export const ArrayUINode: React.FC<NodeProps<ArrayUIFlowNode>> = ({ data, selected }) => {
  const isTB = data.direction === "TB";
  const targetPos = isTB ? Position.Top : Position.Left;
  const sourcePos = isTB ? Position.Bottom : Position.Right;

  return (
    <div
      className={cn(
        "aui-arch-node",
        "is-fixed",
        selected && "is-selected",
        data.status && `is-${data.status}`,
        data.visited && "is-visited is-done"
      )}
      style={{
        position: "relative",
        transform: "none",
        width: 184,
        minHeight: 72,
        cursor: "grab",
      }}
    >
      <Handle
        type="target"
        position={targetPos}
        className="aui-rf-handle"
      />

      <div className="aui-arch-node-top">
        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", minWidth: 0 }}>
          {data.visited && (
            <span className="aui-arch-node-visited-icon" aria-label="Visited" title="Visited">
              ✓
            </span>
          )}
          <span className="aui-arch-node-name" title={data.label}>
            {data.label}
          </span>
        </div>
        {data.badge && <span className="aui-arch-node-badge">{data.badge}</span>}
      </div>

      {data.description && <p className="aui-arch-node-desc">{data.description}</p>}

      <Handle
        type="source"
        position={sourcePos}
        className="aui-rf-handle"
      />
    </div>
  );
};
