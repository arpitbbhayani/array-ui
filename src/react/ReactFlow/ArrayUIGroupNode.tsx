"use client";

import React from "react";
import type { NodeProps } from "@xyflow/react";
import { cn } from "../../utils/cn";
import type { ArrayUIFlowGroupNode } from "./types";

export const ArrayUIGroupNode: React.FC<NodeProps<ArrayUIFlowGroupNode>> = ({ data, selected }) => {
  return (
    <div
      className={cn(
        "aui-arch-group",
        data.kind && `aui-arch-group-${data.kind}`,
        selected && "is-selected"
      )}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <div className="aui-arch-group-head">
        <span className="aui-arch-group-label">{data.label}</span>
        {data.kind && <span className="aui-arch-group-kind">{data.kind}</span>}
      </div>
    </div>
  );
};
