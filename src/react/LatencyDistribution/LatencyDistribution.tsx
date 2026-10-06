"use client";

import React from "react";
import { cn } from "../../utils/cn";

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

export const LatencyDistribution = React.forwardRef<HTMLDivElement, LatencyDistributionProps>(
  ({ title = "Latency Distribution", sla, percentiles, className, ...props }, ref) => {
    const totalVal = percentiles.reduce((acc, p) => acc + p.value, 0);

    const getBracketColor = (c?: string) => {
      switch (c) {
        case "emerald":
          return "var(--aui-success)";
        case "amber":
          return "var(--aui-warning)";
        case "rose":
          return "var(--aui-danger)";
        case "blue":
          return "var(--aui-info)";
        case "violet":
          return "var(--aui-c-violet)";
        default:
          return "var(--aui-primary)";
      }
    };

    return (
      <div ref={ref} className={cn("aui-latency-dist", className)} {...props}>
        <div className="aui-latency-dist-header">
          <span className="aui-latency-dist-title">{title}</span>
          {sla && <span className="aui-latency-dist-sla">{sla}</span>}
        </div>

        <div className="aui-latency-bar-container">
          {percentiles.map((p, idx) => {
            const widthPct = Math.max((p.value / totalVal) * 100, 8);
            const color = getBracketColor(p.color);

            return (
              <div
                key={idx}
                className="aui-latency-bar-segment"
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

        <div className="aui-latency-pills">
          {percentiles.map((p, idx) => {
            const color = getBracketColor(p.color);
            return (
              <div key={idx} className="aui-latency-pill">
                <span
                  className="aui-latency-pill-dot"
                  style={{ backgroundColor: color }}
                />
                <span className="aui-latency-pill-name">{p.label}:</span>
                <span className="aui-latency-pill-val">{p.display}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

LatencyDistribution.displayName = "LatencyDistribution";
