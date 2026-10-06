"use client";

import React, { useState } from "react";
import { cn } from "../../utils/cn";

export interface MemorySegment {
  name: string;
  bytes: number;
  offset?: string;
  type?: string;
  value?: string;
  description?: string;
  color?: "crimson" | "emerald" | "amber" | "blue" | "violet" | "neutral";
}

export interface MemoryLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  totalBytes?: number | string;
  segments: MemorySegment[];
}

export const MemoryLayout = React.forwardRef<HTMLDivElement, MemoryLayoutProps>(
  ({ title = "Memory Layout", totalBytes, segments, className, ...props }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    const totalCalculated =
      totalBytes ??
      segments.reduce((acc, s) => acc + (typeof s.bytes === "number" ? s.bytes : 0), 0);

    const activeSeg = segments[selectedIndex] ?? segments[0];

    const getColorClass = (c?: string) => {
      switch (c) {
        case "crimson":
          return "aui-memory-block-crimson";
        case "emerald":
          return "aui-memory-block-emerald";
        case "amber":
          return "aui-memory-block-amber";
        case "blue":
          return "aui-memory-block-blue";
        case "violet":
          return "aui-memory-block-violet";
        default:
          return "aui-memory-block-neutral";
      }
    };

    return (
      <div ref={ref} className={cn("aui-memory-layout", className)} {...props}>
        <div className="aui-canvas-header">
          <div className="aui-canvas-title">
            <span className="aui-canvas-title-dot" />
            <span>{title}</span>
          </div>
          <div className="text-xs font-mono text-muted-foreground">
            Total: {totalCalculated} bytes
          </div>
        </div>

        <div className="aui-memory-bar-wrapper">
          <div className="aui-memory-bar">
            {segments.map((seg, idx) => {
              const flexGrow = Math.max(seg.bytes, 1);
              const isSelected = selectedIndex === idx;

              return (
                <div
                  key={idx}
                  className={cn(
                    "aui-memory-block",
                    getColorClass(seg.color),
                    isSelected && "is-selected"
                  )}
                  style={{ flex: `${flexGrow} 1 0%` }}
                  onClick={() => setSelectedIndex(idx)}
                  title={`${seg.name} (${seg.bytes} bytes)`}
                >
                  <span className="aui-memory-block-name">{seg.name}</span>
                  <span className="aui-memory-block-bytes">
                    {seg.offset ?? `${seg.bytes}B`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {activeSeg && (
          <div className="aui-memory-inspector">
            <div className="aui-memory-inspector-grid">
              <div className="aui-memory-inspector-item">
                <span className="aui-memory-inspector-label">Field</span>
                <span className="aui-memory-inspector-value">{activeSeg.name}</span>
              </div>
              <div className="aui-memory-inspector-item">
                <span className="aui-memory-inspector-label">Offset</span>
                <span className="aui-memory-inspector-value">
                  {activeSeg.offset ?? "—"}
                </span>
              </div>
              <div className="aui-memory-inspector-item">
                <span className="aui-memory-inspector-label">Size</span>
                <span className="aui-memory-inspector-value">
                  {activeSeg.bytes} bytes ({activeSeg.bytes * 8} bits)
                </span>
              </div>
              {activeSeg.type && (
                <div className="aui-memory-inspector-item">
                  <span className="aui-memory-inspector-label">Type</span>
                  <span className="aui-memory-inspector-value">{activeSeg.type}</span>
                </div>
              )}
              {activeSeg.value && (
                <div className="aui-memory-inspector-item">
                  <span className="aui-memory-inspector-label">Value / Format</span>
                  <span className="aui-memory-inspector-value font-mono">
                    {activeSeg.value}
                  </span>
                </div>
              )}
              {activeSeg.description && (
                <div
                  className="aui-memory-inspector-item"
                  style={{ gridColumn: "1 / -1" }}
                >
                  <span className="aui-memory-inspector-label">Description</span>
                  <span className="aui-memory-inspector-value font-normal text-sm">
                    {activeSeg.description}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

MemoryLayout.displayName = "MemoryLayout";
