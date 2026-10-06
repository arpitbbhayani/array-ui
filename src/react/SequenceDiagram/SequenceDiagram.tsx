"use client";

import React, { useState, useEffect } from "react";
import { cn } from "../../utils/cn";

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

export const SequenceDiagram = React.forwardRef<HTMLDivElement, SequenceDiagramProps>(
  (
    {
      title = "Sequence Protocol",
      actors,
      steps,
      interactiveScrubber = true,
      initialStep = 0,
      className,
      ...props
    },
    ref
  ) => {
    const [currentStep, setCurrentStep] = useState(
      interactiveScrubber ? initialStep : steps.length - 1
    );
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
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
      <div ref={ref} className={cn("aui-seq-diagram", className)} {...props}>
        <div className="aui-seq-header">
          <span className="aui-seq-title">{title}</span>
          {interactiveScrubber && (
            <div className="aui-seq-controls">
              <span className="aui-seq-step-pill">
                Step {currentStep + 1} of {steps.length}
              </span>
              <button
                type="button"
                className="aui-scrubber-btn"
                onClick={handlePrev}
                disabled={currentStep === 0}
                aria-label="Previous step"
              >
                ◀
              </button>
              <button
                type="button"
                className="aui-scrubber-btn aui-scrubber-btn-primary"
                onClick={handlePlayPause}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? "❚❚" : "▶"}
              </button>
              <button
                type="button"
                className="aui-scrubber-btn"
                onClick={handleNext}
                disabled={currentStep >= steps.length - 1}
                aria-label="Next step"
              >
                ▶
              </button>
            </div>
          )}
        </div>

        <div className="aui-seq-stage">
          <div className="aui-seq-actors-row">
            {actors.map((actor, idx) => (
              <div key={idx} className="aui-seq-actor">
                {actor}
              </div>
            ))}
          </div>

          <div className="aui-seq-messages">
            {steps.map((step, idx) => {
              const fromIdx = getActorIndex(step.from);
              const toIdx = getActorIndex(step.to);
              const minIdx = Math.min(fromIdx, toIdx);
              const maxIdx = Math.max(fromIdx, toIdx);
              const goingRight = fromIdx < toIdx;

              // Compute percentage coordinates across columns
              const leftPercent = ((minIdx + 0.5) / actorCount) * 100;
              const widthPercent = ((maxIdx - minIdx) / actorCount) * 100;

              const isDimmed = interactiveScrubber && idx > currentStep;
              const isActive = interactiveScrubber && idx === currentStep;

              return (
                <React.Fragment key={idx}>
                  <div
                    className={cn(
                      "aui-seq-msg-item",
                      isDimmed && "is-dimmed",
                      isActive && "is-active"
                    )}
                  >
                    <div
                      className={cn("aui-seq-msg-line", step.dashed && "is-dashed")}
                      style={{
                        marginLeft: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    >
                      <span
                        className={cn(
                          "aui-seq-msg-arrow",
                          goingRight ? "arrow-right" : "arrow-left"
                        )}
                      >
                        {goingRight ? "►" : "◄"}
                      </span>
                      <span className="aui-seq-msg-pill">{step.label}</span>
                    </div>
                  </div>

                  {step.note && (
                    <div
                      className={cn(
                        "aui-seq-note",
                        isDimmed && "is-dimmed",
                        isActive && "is-active"
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
);

SequenceDiagram.displayName = "SequenceDiagram";
