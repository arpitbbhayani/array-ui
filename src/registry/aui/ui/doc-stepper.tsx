"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface DocStepItem {
  title: string;
  description?: string;
  status?: "completed" | "active" | "pending";
  content?: React.ReactNode;
}

export interface DocStepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: DocStepItem[];
  activeStep?: number;
}

export function DocStepper({
  steps,
  activeStep,
  className,
  ...props
}: DocStepperProps) {
  return (
    <div className={cn("space-y-6 my-6", className)} {...props}>
      {steps.map((step, idx) => {
        let resolvedStatus = step.status || "pending";
        if (typeof activeStep === "number") {
          if (idx < activeStep) resolvedStatus = "completed";
          else if (idx === activeStep) resolvedStatus = "active";
          else resolvedStatus = "pending";
        }

        const isCompleted = resolvedStatus === "completed";
        const isActive = resolvedStatus === "active";

        return (
          <div key={idx} className="flex gap-4 relative">
            {idx < steps.length - 1 && (
              <div className="absolute left-[13px] top-[26px] bottom-[-24px] w-px bg-border" />
            )}

            <div className="flex flex-col items-center flex-shrink-0 z-10">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold border transition-colors",
                  isCompleted && "bg-card border-emerald-500 text-emerald-500",
                  isActive && "bg-primary border-primary text-primary-foreground shadow-xs ring-4 ring-primary/20",
                  !isCompleted && !isActive && "bg-card border-border text-muted-foreground"
                )}
              >
                {isCompleted ? "✓" : idx + 1}
              </div>
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
              <h4 className="font-heading font-semibold text-foreground text-base leading-snug">
                {step.title}
              </h4>
              {step.description && (
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {step.description}
                </p>
              )}
              {step.content && <div className="mt-3">{step.content}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
