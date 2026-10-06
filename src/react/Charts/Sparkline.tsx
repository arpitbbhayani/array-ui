"use client";

import React from "react";
import { cn } from "../../utils/cn";

export interface SparklineProps {
  data: number[];
  color?: "primary" | "emerald" | "amber" | "rose" | "cyan";
  height?: number;
  width?: number;
  className?: string;
}

const COLOR_MAP: Record<string, string> = {
  primary: "var(--aui-primary, #e5000f)",
  emerald: "var(--aui-c-green, #10b981)",
  amber: "var(--aui-c-amber, #d97706)",
  rose: "var(--aui-c-red, #dc2626)",
  cyan: "var(--aui-c-cyan, #0891b2)",
};

export function Sparkline({
  data = [],
  color = "primary",
  height = 32,
  width = 96,
  className,
}: SparklineProps) {
  if (!data || data.length < 2) {
    return (
      <div
        className={cn("aui-sparkline aui-sparkline-empty", className)}
        style={{ width, height }}
      />
    );
  }

  const strokeColor = COLOR_MAP[color] || COLOR_MAP.primary;
  const padding = 3;
  const drawW = width - padding * 2;
  const drawH = height - padding * 2;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1)) * drawW;
    const y = padding + drawH - ((val - min) / range) * drawH;
    return { x, y };
  });

  const lineD = points.reduce(
    (acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
    ""
  );

  const lastPt = points[points.length - 1];

  return (
    <div
      className={cn("aui-sparkline", className)}
      style={{ width, height }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="aui-sparkline-svg"
      >
        <path
          d={lineD}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={lastPt.x}
          cy={lastPt.y}
          r="2.5"
          fill={strokeColor}
        />
      </svg>
    </div>
  );
}
