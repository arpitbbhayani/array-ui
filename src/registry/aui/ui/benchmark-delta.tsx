"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

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

export function BenchmarkDelta({
  benchmarks,
  className,
  ...props
}: BenchmarkDeltaProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-4 space-y-4 my-4 shadow-xs",
        className
      )}
      {...props}
    >
      {benchmarks.map((item, idx) => {
        const maxVal = Math.max(item.baselineValue, item.candidateValue, 1);
        const baselinePct = Math.min((item.baselineValue / maxVal) * 100, 100);
        const candidatePct = Math.min((item.candidateValue / maxVal) * 100, 100);

        const isPositive =
          item.better === "lower"
            ? item.candidateValue < item.baselineValue
            : item.candidateValue > item.baselineValue;

        return (
          <div key={idx} className="space-y-2 pb-3 border-b border-border last:border-b-0 last:pb-0">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold text-foreground">
                {item.name}
              </span>
              <span
                className={cn(
                  "font-mono text-xs font-bold px-1.5 py-0.5 rounded",
                  isPositive
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                )}
              >
                {item.delta}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-muted-foreground w-16 flex-shrink-0">
                  {item.baselineLabel ?? "Baseline"}
                </span>
                <div className="flex-1 h-3 rounded bg-muted overflow-hidden border border-border/50">
                  <div
                    className="h-full bg-muted-foreground/40 rounded transition-all duration-300"
                    style={{ width: `${baselinePct}%` }}
                  />
                </div>
                <span className="font-mono text-xs text-muted-foreground w-20 text-right flex-shrink-0">
                  {item.baselineDisplay}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] font-semibold text-foreground w-16 flex-shrink-0">
                  {item.candidateLabel ?? "Candidate"}
                </span>
                <div className="flex-1 h-3 rounded bg-muted overflow-hidden border border-border/50">
                  <div
                    className="h-full bg-primary rounded transition-all duration-300"
                    style={{ width: `${candidatePct}%` }}
                  />
                </div>
                <span className="font-mono text-xs font-bold text-primary w-20 text-right flex-shrink-0">
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
