"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ExplorableStep {
  title: string;
  description: string;
  visual?: React.ReactNode;
}

export interface StepScrubberProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: ExplorableStep[];
  initialStep?: number;
  autoplayInterval?: number;
  onStepChange?: (step: number) => void;
}

export function StepScrubber({
  steps,
  initialStep = 0,
  autoplayInterval = 3000,
  onStepChange,
  className,
  ...props
}: StepScrubberProps) {
  const [currentStep, setCurrentStep] = React.useState(initialStep);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const totalSteps = steps.length;
  const activeStep = steps[currentStep] || steps[0];

  const goToStep = (s: number) => {
    const bounded = Math.max(0, Math.min(s, totalSteps - 1));
    setCurrentStep(bounded);
    onStepChange?.(bounded);
  };

  React.useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          const next = prev + 1;
          onStepChange?.(next);
          return next;
        });
      }, autoplayInterval);
    }
    return () => clearInterval(timer);
  }, [isPlaying, totalSteps, autoplayInterval, onStepChange]);

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card text-card-foreground overflow-hidden my-4 shadow-xs",
        className
      )}
      {...props}
    >
      {activeStep?.visual && <div className="p-4">{activeStep.visual}</div>}

      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-muted/30 border-t border-border">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center rounded border border-border bg-card hover:bg-muted text-foreground transition-colors cursor-pointer text-xs"
            onClick={() => {
              setIsPlaying(false);
              goToStep(0);
            }}
            title="Reset"
          >
            ↺
          </button>
          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center rounded border border-border bg-card hover:bg-muted text-foreground transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-xs"
            disabled={currentStep === 0}
            onClick={() => {
              setIsPlaying(false);
              goToStep(currentStep - 1);
            }}
            title="Previous"
          >
            ◀
          </button>
          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center rounded bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity cursor-pointer text-xs"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? "❚❚" : "▶"}
          </button>
          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center rounded border border-border bg-card hover:bg-muted text-foreground transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-xs"
            disabled={currentStep === totalSteps - 1}
            onClick={() => {
              setIsPlaying(false);
              goToStep(currentStep + 1);
            }}
            title="Next"
          >
            ▶
          </button>
        </div>

        <div className="flex-1 min-w-[140px] flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={totalSteps - 1}
            value={currentStep}
            className="flex-1 accent-primary cursor-pointer"
            onChange={(e) => {
              setIsPlaying(false);
              goToStep(parseInt(e.target.value, 10));
            }}
          />
          <span className="font-mono text-xs font-medium text-muted-foreground whitespace-nowrap">
            {currentStep + 1} / {totalSteps}
          </span>
        </div>
      </div>

      {activeStep && (
        <div className="p-4 border-t border-border bg-card">
          <h4 className="font-heading font-semibold text-sm text-foreground mb-1">
            {activeStep.title}
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {activeStep.description}
          </p>
        </div>
      )}
    </div>
  );
}
