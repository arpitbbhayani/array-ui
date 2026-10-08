"use client";

import React from "react";
import { cn } from "../../utils/cn";

export interface AnalogyMappingPoint {
  analogy: string;
  concept: string;
}

export interface AnalogyCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  analogyTitle: string;
  analogyBadge?: string;
  analogyDescription: string;
  conceptTitle: string;
  conceptBadge?: string;
  conceptDescription: string;
  mappingPoints?: AnalogyMappingPoint[];
}

export const AnalogyCard = React.forwardRef<HTMLDivElement, AnalogyCardProps>(
  (
    {
      title = "Mental Model & Concept Analogy",
      analogyTitle,
      analogyBadge = "Everyday Analogy",
      analogyDescription,
      conceptTitle,
      conceptBadge = "System Mechanics",
      conceptDescription,
      mappingPoints = [],
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn("aui-analogy-card", className)} {...props}>
        <div className="aui-analogy-header">
          <span className="aui-analogy-title">{title}</span>
        </div>

        <div className="aui-analogy-grid">
          <div className="aui-analogy-col aui-analogy-col-real">
            <div className="aui-analogy-col-header">
              <span className="aui-analogy-col-badge aui-analogy-badge-real">
                {analogyBadge}
              </span>
              <h4 className="aui-analogy-col-title">{analogyTitle}</h4>
            </div>
            <p className="aui-analogy-col-desc">{analogyDescription}</p>

            {mappingPoints.length > 0 && (
              <div className="aui-analogy-points">
                <span className="font-mono text-xs uppercase font-medium text-muted-foreground mb-1">
                  Metaphor Component:
                </span>
                {mappingPoints.map((pt, idx) => (
                  <div key={idx} className="aui-analogy-point-item">
                    <span className="aui-analogy-point-bullet">↳</span>
                    <span>{pt.analogy}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="aui-analogy-col aui-analogy-col-tech">
            <div className="aui-analogy-col-header">
              <span className="aui-analogy-col-badge aui-analogy-badge-tech">
                {conceptBadge}
              </span>
              <h4 className="aui-analogy-col-title">{conceptTitle}</h4>
            </div>
            <p className="aui-analogy-col-desc">{conceptDescription}</p>

            {mappingPoints.length > 0 && (
              <div className="aui-analogy-points">
                <span className="font-mono text-xs uppercase font-medium text-muted-foreground mb-1">
                  Corresponds In Software To:
                </span>
                {mappingPoints.map((pt, idx) => (
                  <div key={idx} className="aui-analogy-point-item">
                    <span className="aui-analogy-point-bullet">↳</span>
                    <span className="font-mono text-xs font-medium text-foreground">
                      {pt.concept}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

AnalogyCard.displayName = "AnalogyCard";
