"use client";

import React from "react";
import { CheckIcon } from "../Icons";
import { cn } from "../../utils/cn";

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

export const DocStepper = React.forwardRef<HTMLDivElement, DocStepperProps>(
  ({ steps, activeStep, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("aui-doc-stepper", className)} {...props}>
        {steps.map((step, idx) => {
          // If activeStep is explicitly provided, compute status relative to it
          let resolvedStatus = step.status || "pending";
          if (typeof activeStep === "number") {
            if (idx < activeStep) resolvedStatus = "completed";
            else if (idx === activeStep) resolvedStatus = "active";
            else resolvedStatus = "pending";
          }

          const isCompleted = resolvedStatus === "completed";
          const isActive = resolvedStatus === "active";

          return (
            <div
              key={idx}
              className={cn(
                "aui-doc-step",
                isCompleted && "is-completed",
                isActive && "is-active"
              )}
            >
              <div className="aui-doc-step-rail">
                <div className="aui-doc-step-indicator">
                  {isCompleted ? (
                    <CheckIcon size={13} strokeWidth={3} />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                <div className="aui-doc-step-line" />
              </div>

              <div className="aui-doc-step-content">
                <div className="aui-doc-step-header">
                  <h4 className="aui-doc-step-title">{step.title}</h4>
                  {step.description && (
                    <p className="aui-doc-step-desc">{step.description}</p>
                  )}
                </div>
                {step.content && (
                  <div className="aui-doc-step-body">{step.content}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);

DocStepper.displayName = "DocStepper";
