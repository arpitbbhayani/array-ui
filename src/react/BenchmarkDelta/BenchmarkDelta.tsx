"use client";

import React from "react";
import { cn } from "../../utils/cn";

export interface BenchmarkItem {
  name: string;
  baselineLabel?: string;
  baselineValue: number;
  baselineDisplay: string;
  candidateLabel?: string;
  candidateValue: number;
  candidateDisplay: string;
  delta: string;
  better?: "higher" | "lower";
}

export interface BenchmarkDeltaProps extends React.HTMLAttributes<HTMLDivElement> {
  benchmarks: BenchmarkItem[];
}

export const BenchmarkDelta = React.forwardRef<HTMLDivElement, BenchmarkDeltaProps>(
  ({ benchmarks, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("aui-benchmark-delta", className)} {...props}>
        {benchmarks.map((item, idx) => {
          const maxVal = Math.max(item.baselineValue, item.candidateValue, 1);
          const baselinePct = Math.min((item.baselineValue / maxVal) * 100, 100);
          const candidatePct = Math.min((item.candidateValue / maxVal) * 100, 100);

          const isPositive = item.better === "lower"
            ? item.candidateValue < item.baselineValue
            : item.candidateValue > item.baselineValue;

          return (
            <div key={idx} className="aui-benchmark-row">
              <div className="aui-benchmark-row-header">
                <span className="aui-benchmark-metric-name">{item.name}</span>
                <span
                  className={cn(
                    "aui-benchmark-delta-badge",
                    isPositive ? "is-positive" : "is-negative"
                  )}
                >
                  {item.delta}
                </span>
              </div>

              <div className="aui-benchmark-bars">
                <div className="aui-benchmark-bar-track">
                  <span className="aui-benchmark-bar-label">
                    {item.baselineLabel ?? "Baseline"}
                  </span>
                  <div className="aui-benchmark-bar-fill-wrapper">
                    <div
                      className="aui-benchmark-bar-fill is-baseline"
                      style={{ width: `${baselinePct}%` }}
                    />
                  </div>
                  <span className="aui-benchmark-bar-value">
                    {item.baselineDisplay}
                  </span>
                </div>

                <div className="aui-benchmark-bar-track">
                  <span className="aui-benchmark-bar-label font-semibold">
                    {item.candidateLabel ?? "Optimized"}
                  </span>
                  <div className="aui-benchmark-bar-fill-wrapper">
                    <div
                      className="aui-benchmark-bar-fill is-candidate"
                      style={{ width: `${candidatePct}%` }}
                    />
                  </div>
                  <span className="aui-benchmark-bar-value text-primary font-bold">
                    {item.candidateDisplay}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);

BenchmarkDelta.displayName = "BenchmarkDelta";
