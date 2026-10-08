"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

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

export function ConceptWalkthrough({
  steps,
  activeStep: controlledStep,
  onStepChange,
  className,
  ...props
}: ConceptWalkthroughProps) {
  const [internalStep, setInternalStep] = React.useState(0);
  const stepIdx = controlledStep !== undefined ? controlledStep : internalStep;

  const setStep = (newStep: number) => {
    const clamped = Math.max(0, Math.min(steps.length - 1, newStep));
    if (controlledStep === undefined) {
      setInternalStep(clamped);
    }
    onStepChange?.(clamped);
  };

  React.useEffect(() => {
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
    <div
      className={cn(
        "flex flex-col border border-border rounded-lg bg-card overflow-hidden shadow-xs my-6",
        className
      )}
      {...props}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[420px]">
        <div className="p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border bg-card">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs uppercase font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                {activeStepData.badge || `Stage ${stepIdx + 1}`}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                Use ← → keys to navigate
              </span>
            </div>

            <h3 className="font-heading text-xl font-bold text-foreground mb-3 leading-tight">
              {activeStepData.title}
            </h3>
            <div className="text-sm text-foreground leading-relaxed mb-4">
              {activeStepData.content}
            </div>

            {activeStepData.takeaway && (
              <div className="p-3 bg-muted/40 border-l-2 border-primary rounded-r text-xs text-foreground mb-5">
                <strong>Key Maxim:</strong> {activeStepData.takeaway}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="font-mono text-xs text-muted-foreground font-medium">
              Step {stepIdx + 1} of {steps.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center justify-center w-7 h-7 rounded border border-border bg-background text-foreground disabled:opacity-40"
                onClick={() => setStep(stepIdx - 1)}
                disabled={stepIdx === 0}
                aria-label="Previous step"
              >
                ◀
              </button>
              <div className="flex gap-1.5">
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
                className="inline-flex items-center justify-center w-7 h-7 rounded bg-primary text-primary-foreground font-bold disabled:opacity-40"
                onClick={() => setStep(stepIdx + 1)}
                disabled={stepIdx >= steps.length - 1}
                aria-label="Next step"
              >
                ▶
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 bg-background flex items-center justify-center overflow-hidden">
          {activeStepData.visual}
        </div>
      </div>
    </div>
  );
}
