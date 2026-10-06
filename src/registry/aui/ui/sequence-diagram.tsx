"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SequenceStepItem {
  from: string;
  to: string;
  label: string;
  type?: "request" | "response" | "commit" | "error";
  note?: string;
  dashed?: boolean;
}

export interface SequenceDiagramProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  actors: string[];
  steps: SequenceStepItem[];
  interactiveScrubber?: boolean;
  initialStep?: number;
}

export function SequenceDiagram({
  title = "Sequence Protocol",
  actors,
  steps,
  interactiveScrubber = true,
  initialStep = 0,
  className,
  ...props
}: SequenceDiagramProps) {
  const [currentStep, setCurrentStep] = React.useState(
    interactiveScrubber ? initialStep : steps.length - 1
  );
  const [isPlaying, setIsPlaying] = React.useState(false);

  React.useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentStep((p) => Math.max(0, p - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStep((p) => Math.min(steps.length - 1, p + 1));
  };

  const handlePlayPause = () => {
    if (currentStep >= steps.length - 1 && !isPlaying) {
      setCurrentStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((p) => !p);
    }
  };

  const actorCount = actors.length;
  const getActorIndex = (actorName: string) => {
    const idx = actors.indexOf(actorName);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div
      className={cn(
        "flex flex-col border border-border rounded-lg bg-card overflow-hidden shadow-xs my-6",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between p-3.5 bg-background border-b border-border flex-wrap gap-2">
        <span className="font-heading font-bold text-base text-foreground">{title}</span>
        {interactiveScrubber && (
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-muted-foreground px-2 py-0.5 rounded border border-border bg-card">
              Step {currentStep + 1} of {steps.length}
            </span>
            <button
              type="button"
              className="inline-flex items-center justify-center w-7 h-7 rounded border border-border bg-card text-foreground disabled:opacity-40"
              onClick={handlePrev}
              disabled={currentStep === 0}
              aria-label="Previous step"
            >
              ◀
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center w-7 h-7 rounded bg-primary text-primary-foreground font-bold"
              onClick={handlePlayPause}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? "❚❚" : "▶"}
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center w-7 h-7 rounded border border-border bg-card text-foreground disabled:opacity-40"
              onClick={handleNext}
              disabled={currentStep >= steps.length - 1}
              aria-label="Next step"
            >
              ▶
            </button>
          </div>
        )}
      </div>

      <div className="p-6 overflow-x-auto bg-background min-w-full">
        <div className="flex justify-around min-w-[540px] mb-6">
          {actors.map((actor, idx) => (
            <div
              key={idx}
              className="px-4 py-2 bg-card border border-border rounded-md font-mono text-sm font-bold text-foreground text-center min-w-[120px] shadow-xs"
            >
              {actor}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-5 min-w-[540px] relative">
          {steps.map((step, idx) => {
            const fromIdx = getActorIndex(step.from);
            const toIdx = getActorIndex(step.to);
            const minIdx = Math.min(fromIdx, toIdx);
            const maxIdx = Math.max(fromIdx, toIdx);
            const goingRight = fromIdx < toIdx;

            const leftPercent = ((minIdx + 0.5) / actorCount) * 100;
            const widthPercent = ((maxIdx - minIdx) / actorCount) * 100;

            const isDimmed = interactiveScrubber && idx > currentStep;
            const isActive = interactiveScrubber && idx === currentStep;

            return (
              <React.Fragment key={idx}>
                <div
                  className={cn(
                    "flex items-center relative py-1 transition-opacity duration-300",
                    isDimmed && "opacity-30",
                    isActive && "opacity-100"
                  )}
                >
                  <div
                    className={cn(
                      "relative h-0.5 bg-border flex items-center justify-center",
                      step.dashed && "border-b border-dashed border-border bg-transparent",
                      isActive && "bg-primary"
                    )}
                    style={{
                      marginLeft: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  >
                    <span
                      className={cn(
                        "absolute -top-2.5 text-xs",
                        isActive ? "text-primary font-bold" : "text-muted-foreground",
                        goingRight ? "-right-1" : "-left-1"
                      )}
                    >
                      {goingRight ? "►" : "◄"}
                    </span>
                    <span
                      className={cn(
                        "bg-card border border-border rounded px-2.5 py-0.5 font-mono text-xs font-semibold text-foreground whitespace-nowrap z-10 shadow-xs",
                        isActive && "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                </div>

                {step.note && (
                  <div
                    className={cn(
                      "mx-auto max-w-lg p-2.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-xs text-foreground text-center",
                      isDimmed && "opacity-30",
                      isActive && "opacity-100 ring-1 ring-amber-500"
                    )}
                  >
                    💡 {step.note}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
