"use client";

import React from "react";
import { cn } from "../../utils/cn";

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

export const TradeoffMatrix = React.forwardRef<HTMLDivElement, TradeoffMatrixProps>(
  (
    {
      title = "Architectural Trade-Off Analysis",
      description = "Evaluating system trade-offs across critical engineering dimensions.",
      dimensions,
      options,
      recommendation,
      className,
      ...props
    },
    ref
  ) => {
    const renderScore = (score: string) => {
      const lower = score.toLowerCase();
      if (lower === "high" || lower === "great" || lower === "low latency" || lower === "low cost") {
        return <span className="aui-tradeoff-score-pill aui-tradeoff-score-high">● {score}</span>;
      }
      if (lower === "med" || lower === "medium" || lower === "fair" || lower === "moderate") {
        return <span className="aui-tradeoff-score-pill aui-tradeoff-score-med">▲ {score}</span>;
      }
      if (lower === "low" || lower === "poor" || lower === "high complexity" || lower === "high cost") {
        return <span className="aui-tradeoff-score-pill aui-tradeoff-score-low">▼ {score}</span>;
      }
      return <span className="font-mono text-xs font-semibold">{score}</span>;
    };

    return (
      <div ref={ref} className={cn("aui-tradeoff-matrix", className)} {...props}>
        <div className="aui-tradeoff-header">
          <h3 className="aui-tradeoff-title">{title}</h3>
          {description && <p className="aui-tradeoff-desc">{description}</p>}
        </div>

        <div className="aui-tradeoff-table-wrapper">
          <table className="aui-tradeoff-table">
            <thead>
              <tr>
                <th>Candidate Option</th>
                {dimensions.map((dim) => (
                  <th key={dim}>{dim}</th>
                ))}
                <th>Key Advantages & Trade-Offs</th>
              </tr>
            </thead>
            <tbody>
              {options.map((opt, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="flex flex-col gap-1">
                      <span className="aui-tradeoff-opt-name">{opt.name}</span>
                      {opt.badge && (
                        <span className="font-mono text-xs text-muted-foreground">
                          {opt.badge}
                        </span>
                      )}
                    </div>
                  </td>
                  {dimensions.map((dim) => (
                    <td key={dim}>{renderScore(opt.scores[dim] || "—")}</td>
                  ))}
                  <td>
                    <div className="flex flex-col gap-1.5 min-w-[200px]">
                      {opt.pros && opt.pros.length > 0 && (
                        <div className="text-xs text-emerald-600 dark:text-emerald-400">
                          <strong>+ </strong> {opt.pros.join(", ")}
                        </div>
                      )}
                      {opt.cons && opt.cons.length > 0 && (
                        <div className="text-xs text-rose-600 dark:text-rose-400">
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
          <div className="aui-tradeoff-verdict">
            <span className="font-bold">Architectural Recommendation:</span>
            <span>{recommendation}</span>
          </div>
        )}
      </div>
    );
  }
);

TradeoffMatrix.displayName = "TradeoffMatrix";
