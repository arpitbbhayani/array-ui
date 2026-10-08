"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface PipelineStageItem {
  title: string;
  badge?: string;
  description?: string;
  metric?: string;
  active?: boolean;
}

export interface PipelineFlowProps extends React.HTMLAttributes<HTMLDivElement> {
  stages: PipelineStageItem[];
  animated?: boolean;
}

export function PipelineFlow({
  stages,
  animated = true,
  className,
  ...props
}: PipelineFlowProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 p-4 overflow-x-auto w-full rounded-lg border border-border bg-card",
        className
      )}
      {...props}
    >
      {stages.map((stage, idx) => (
        <React.Fragment key={idx}>
          <div
            className={cn(
              "flex flex-col p-3.5 rounded-md border border-border bg-card shadow-xs min-w-[170px] max-w-[240px] flex-shrink-0 transition-colors",
              stage.active && "border-primary ring-1 ring-primary"
            )}
          >
            <div className="flex items-center justify-between gap-1.5 mb-1.5">
              <span className="font-mono text-sm font-medium text-foreground">
                {stage.title}
              </span>
              {stage.badge && (
                <span className="font-mono text-xs font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                  {stage.badge}
                </span>
              )}
            </div>
            {stage.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2 leading-snug">
                {stage.description}
              </p>
            )}
            {stage.metric && (
              <div className="font-mono text-sm font-medium text-emerald-500 mt-auto">
                {stage.metric}
              </div>
            )}
          </div>

          {idx < stages.length - 1 && (
            <div className="flex flex-col items-center justify-center relative w-10 flex-shrink-0">
              <div className="w-full h-0.5 bg-border relative">
                {animated && (
                  <div className="absolute -top-[3px] w-2 h-2 rounded-full bg-primary animate-pulse" />
                )}
                <span className="absolute -right-1 -top-2 text-xs text-muted-foreground">
                  ►
                </span>
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
