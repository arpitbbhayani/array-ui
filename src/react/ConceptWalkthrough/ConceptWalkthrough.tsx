"use client";

import React, { useState, useEffect } from "react";
import { cn } from "../../utils/cn";

export interface ConceptWalkthroughStep {
  title: string;
  badge?: string;
  content: React.ReactNode;
  takeaway?: string;
  visual: React.ReactNode;
}

export interface ConceptWalkthroughProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: ConceptWalkthroughStep[];
  activeStep?: number;
  onStepChange?: (stepIndex: number) => void;
}

export const ConceptWalkthrough = React.forwardRef<HTMLDivElement, ConceptWalkthroughProps>(
  ({ steps, activeStep: controlledStep, onStepChange, className, ...props }, ref) => {
    const [internalStep, setInternalStep] = useState(0);
    const stepIdx = controlledStep !== undefined ? controlledStep : internalStep;

    const setStep = (newStep: number) => {
      const clamped = Math.max(0, Math.min(steps.length - 1, newStep));
      if (controlledStep === undefined) {
        setInternalStep(clamped);
      }
      onStepChange?.(clamped);
    };

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "ArrowRight") {
          setStep(stepIdx + 1);
        } else if (e.key === "ArrowLeft") {
          setStep(stepIdx - 1);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [stepIdx, steps.length]);

    const activeStepData = steps[stepIdx] || steps[0];

    return (
      <div ref={ref} className={cn("aui-concept-walkthrough", className)} {...props}>
        <div className="aui-concept-grid">
          <div className="aui-concept-narrative">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="aui-concept-step-badge">
                  {activeStepData.badge || `Stage ${stepIdx + 1}`}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  Use ← → keys to navigate
                </span>
              </div>

              <h3 className="aui-concept-step-title">{activeStepData.title}</h3>
              <div className="aui-concept-step-content">{activeStepData.content}</div>

              {activeStepData.takeaway && (
                <div className="aui-concept-takeaways">
                  <strong>Key Maxim:</strong> {activeStepData.takeaway}
                </div>
              )}
            </div>

            <div className="aui-concept-nav">
              <span className="aui-concept-nav-counter">
                Step {stepIdx + 1} of {steps.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="aui-scrubber-btn"
                  onClick={() => setStep(stepIdx - 1)}
                  disabled={stepIdx === 0}
                  aria-label="Previous concept step"
                >
                  ◀
                </button>
                <div className="flex gap-1">
                  {steps.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={cn(
                        "w-2.5 h-2.5 rounded-full border border-border transition-colors",
                        i === stepIdx ? "bg-primary border-primary" : "bg-muted"
                      )}
                      onClick={() => setStep(i)}
                      aria-label={`Jump to step ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className="aui-scrubber-btn aui-scrubber-btn-primary"
                  onClick={() => setStep(stepIdx + 1)}
                  disabled={stepIdx >= steps.length - 1}
                  aria-label="Next concept step"
                >
                  ▶
                </button>
              </div>
            </div>
          </div>

          <div className="aui-concept-visual-stage">{activeStepData.visual}</div>
        </div>
      </div>
    );
  }
);

ConceptWalkthrough.displayName = "ConceptWalkthrough";
