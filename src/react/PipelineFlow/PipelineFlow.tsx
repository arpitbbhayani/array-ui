"use client";

import React from "react";
import { cn } from "../../utils/cn";

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

export const PipelineFlow = React.forwardRef<HTMLDivElement, PipelineFlowProps>(
  ({ stages, animated = true, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("aui-pipeline-flow", className)} {...props}>
        {stages.map((stage, idx) => (
          <React.Fragment key={idx}>
            <div
              className={cn(
                "aui-pipeline-stage",
                stage.active && "is-active"
              )}
            >
              <div className="aui-pipeline-stage-top">
                <span className="aui-pipeline-stage-title">{stage.title}</span>
                {stage.badge && (
                  <span className="aui-pipeline-stage-badge">{stage.badge}</span>
                )}
              </div>
              {stage.description && (
                <p className="aui-pipeline-stage-desc">{stage.description}</p>
              )}
              {stage.metric && (
                <div className="aui-pipeline-stage-metric">{stage.metric}</div>
              )}
            </div>

            {idx < stages.length - 1 && (
              <div className="aui-pipeline-connector">
                <div className="aui-pipeline-connector-line">
                  {animated && <div className="aui-pipeline-pulse" />}
                  <span className="aui-pipeline-arrow">►</span>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }
);

PipelineFlow.displayName = "PipelineFlow";
