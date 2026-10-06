"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TradeoffOptionItem {
  name: string;
  badge?: string;
  scores: Record<string, "high" | "med" | "low" | string>;
  pros?: string[];
  cons?: string[];
  verdict?: string;
}

export interface TradeoffMatrixProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  dimensions: string[];
  options: TradeoffOptionItem[];
  recommendation?: string;
}

export function TradeoffMatrix({
  title = "Architectural Trade-Off Analysis",
  description = "Evaluating system trade-offs across critical engineering dimensions.",
  dimensions,
  options,
  recommendation,
  className,
  ...props
}: TradeoffMatrixProps) {
  const renderScore = (score: string) => {
    const lower = score.toLowerCase();
    if (lower === "high" || lower === "great" || lower === "low latency" || lower === "low cost") {
      return (
        <span className="inline-flex items-center gap-1 font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
          ● {score}
        </span>
      );
    }
    if (lower === "med" || lower === "medium" || lower === "fair" || lower === "moderate") {
      return (
        <span className="inline-flex items-center gap-1 font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-500">
          ▲ {score}
        </span>
      );
    }
    if (lower === "low" || lower === "poor" || lower === "high complexity" || lower === "high cost") {
      return (
        <span className="inline-flex items-center gap-1 font-mono text-xs font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-500">
          ▼ {score}
        </span>
      );
    }
    return <span className="font-mono text-xs font-semibold">{score}</span>;
  };

  return (
    <div
      className={cn(
        "flex flex-col border border-border rounded-lg bg-card overflow-hidden shadow-xs my-6",
        className
      )}
      {...props}
    >
      <div className="p-4 bg-background border-b border-border">
        <h3 className="font-heading text-lg font-bold text-foreground mb-1">{title}</h3>
        {description && <p className="text-sm text-muted-foreground m-0">{description}</p>}
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              <th className="p-3.5 font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Candidate Option
              </th>
              {dimensions.map((dim) => (
                <th
                  key={dim}
                  className="p-3.5 font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground"
                >
                  {dim}
                </th>
              ))}
              <th className="p-3.5 font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Key Advantages & Trade-Offs
              </th>
            </tr>
          </thead>
          <tbody>
            {options.map((opt, idx) => (
              <tr key={idx} className="border-b border-border last:border-b-0 hover:bg-muted/10">
                <td className="p-3.5 align-middle">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-heading font-bold text-sm text-foreground">{opt.name}</span>
                    {opt.badge && (
                      <span className="font-mono text-xs text-muted-foreground">
                        {opt.badge}
                      </span>
                    )}
                  </div>
                </td>
                {dimensions.map((dim) => (
                  <td key={dim} className="p-3.5 align-middle">
                    {renderScore(opt.scores[dim] || "—")}
                  </td>
                ))}
                <td className="p-3.5 align-middle">
                  <div className="flex flex-col gap-1 min-w-[200px]">
                    {opt.pros && opt.pros.length > 0 && (
                      <div className="text-xs text-emerald-500 font-medium">
                        <strong>+ </strong> {opt.pros.join(", ")}
                      </div>
                    )}
                    {opt.cons && opt.cons.length > 0 && (
                      <div className="text-xs text-rose-500 font-medium">
                        <strong>− </strong> {opt.cons.join(", ")}
                      </div>
                    )}
                    {opt.verdict && (
                      <div className="font-mono text-xs text-muted-foreground mt-0.5">
                        Verdict: {opt.verdict}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {recommendation && (
        <div className="p-3.5 bg-primary/5 border-t border-primary/20 flex items-center gap-2 text-xs text-primary font-medium">
          <span className="font-bold">Architectural Recommendation:</span>
          <span>{recommendation}</span>
        </div>
      )}
    </div>
  );
}
