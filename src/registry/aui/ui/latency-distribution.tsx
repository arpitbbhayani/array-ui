"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface LatencyBracket {
  label: string;
  value: number;
  display: string;
  color?: "emerald" | "amber" | "rose" | "blue" | "violet" | string;
}

export interface LatencyDistributionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  sla?: string;
  percentiles: LatencyBracket[];
}

export function LatencyDistribution({
  title = "Latency Distribution",
  sla,
  percentiles,
  className,
  ...props
}: LatencyDistributionProps) {
  const totalVal = percentiles.reduce((acc, p) => acc + p.value, 0) || 1;

  const getColor = (c?: string) => {
    switch (c) {
      case "emerald":
        return "#10b981";
      case "amber":
        return "#f59e0b";
      case "rose":
        return "#f43f5e";
      case "blue":
        return "#3b82f6";
      case "violet":
        return "#8b5cf6";
      default:
        return "#e5000f";
    }
  };

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-4 space-y-3 my-4 shadow-xs",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-medium text-foreground">
          {title}
        </span>
        {sla && (
          <span className="font-mono text-xs text-muted-foreground">{sla}</span>
        )}
      </div>

      <div className="flex h-7 rounded border border-border overflow-hidden bg-muted/30">
        {percentiles.map((p, idx) => {
          const widthPct = Math.max((p.value / totalVal) * 100, 8);
          const color = getColor(p.color);

          return (
            <div
              key={idx}
              className="h-full border-r border-border/50 last:border-r-0 flex items-center justify-center font-mono text-xs font-medium"
              style={{
                width: `${widthPct}%`,
                backgroundColor: `color-mix(in srgb, ${color} 20%, transparent)`,
                color: color,
              }}
              title={`${p.label}: ${p.display}`}
            >
              {p.label}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {percentiles.map((p, idx) => {
          const color = getColor(p.color);
          return (
            <div
              key={idx}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-border bg-muted/20 font-mono text-xs font-medium"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-muted-foreground">{p.label}:</span>
              <span className="font-bold text-foreground">{p.display}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
