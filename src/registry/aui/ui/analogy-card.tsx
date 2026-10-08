"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

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

export function AnalogyCard({
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
}: AnalogyCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col border border-border rounded-lg bg-card overflow-hidden shadow-xs my-6",
        className
      )}
      {...props}
    >
      <div className="p-3.5 bg-background border-b border-border flex items-center justify-between">
        <span className="font-heading font-bold text-base text-foreground">{title}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="p-5 flex flex-col border-b md:border-b-0 md:border-r border-border bg-card">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs uppercase font-medium px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
              {analogyBadge}
            </span>
            <h4 className="font-heading font-bold text-base text-foreground m-0">
              {analogyTitle}
            </h4>
          </div>
          <p className="text-sm text-foreground leading-relaxed mb-4">
            {analogyDescription}
          </p>

          {mappingPoints.length > 0 && (
            <div className="flex flex-col gap-2 mt-auto pt-3 border-t border-border">
              <span className="font-mono text-xs uppercase font-medium text-muted-foreground">
                Metaphor Component:
              </span>
              {mappingPoints.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="text-primary font-bold">↳</span>
                  <span>{pt.analogy}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col bg-background">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs uppercase font-medium px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
              {conceptBadge}
            </span>
            <h4 className="font-heading font-bold text-base text-foreground m-0">
              {conceptTitle}
            </h4>
          </div>
          <p className="text-sm text-foreground leading-relaxed mb-4">
            {conceptDescription}
          </p>

          {mappingPoints.length > 0 && (
            <div className="flex flex-col gap-2 mt-auto pt-3 border-t border-border">
              <span className="font-mono text-xs uppercase font-medium text-muted-foreground">
                Corresponds In Software To:
              </span>
              {mappingPoints.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="text-primary font-bold">↳</span>
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
