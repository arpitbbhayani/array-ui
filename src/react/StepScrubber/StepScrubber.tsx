"use client";

import React, { useState, useEffect } from "react";
import {
  PlayIcon,
  PauseIcon,
  SkipBackIcon,
  SkipForwardIcon,
  RotateCcwIcon,
} from "../Icons";
import { cn } from "../../utils/cn";

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

export const StepScrubber = React.forwardRef<HTMLDivElement, StepScrubberProps>(
  (
    {
      steps,
      initialStep = 0,
      autoplayInterval = 3000,
      onStepChange,
      className,
      ...props
    },
    ref
  ) => {
    const [currentStep, setCurrentStep] = useState(initialStep);
    const [isPlaying, setIsPlaying] = useState(false);

    const totalSteps = steps.length;
    const activeStep = steps[currentStep] || steps[0];

    const goToStep = (s: number) => {
      const bounded = Math.max(0, Math.min(s, totalSteps - 1));
      setCurrentStep(bounded);
      onStepChange?.(bounded);
    };

    useEffect(() => {
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
      <div ref={ref} className={cn("aui-step-scrubber", className)} {...props}>
        {activeStep?.visual && (
          <div className="aui-canvas-body">{activeStep.visual}</div>
        )}

        <div className="aui-scrubber-controls">
          <div className="aui-scrubber-btn-group">
            <button
              type="button"
              className="aui-scrubber-btn"
              onClick={() => {
                setIsPlaying(false);
                goToStep(0);
              }}
              title="Reset to step 1"
            >
              <RotateCcwIcon size={14} />
            </button>
            <button
              type="button"
              className="aui-scrubber-btn"
              disabled={currentStep === 0}
              onClick={() => {
                setIsPlaying(false);
                goToStep(currentStep - 1);
              }}
              title="Previous step"
            >
              <SkipBackIcon size={14} />
            </button>
            <button
              type="button"
              className="aui-scrubber-btn aui-scrubber-btn-primary"
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? "Pause simulation" : "Play simulation"}
            >
              {isPlaying ? <PauseIcon size={14} /> : <PlayIcon size={14} />}
            </button>
            <button
              type="button"
              className="aui-scrubber-btn"
              disabled={currentStep === totalSteps - 1}
              onClick={() => {
                setIsPlaying(false);
                goToStep(currentStep + 1);
              }}
              title="Next step"
            >
              <SkipForwardIcon size={14} />
            </button>
          </div>

          <div className="aui-scrubber-timeline">
            <input
              type="range"
              min={0}
              max={totalSteps - 1}
              value={currentStep}
              className="aui-scrubber-slider"
              onChange={(e) => {
                setIsPlaying(false);
                goToStep(parseInt(e.target.value, 10));
              }}
            />
            <span className="aui-scrubber-counter">
              {currentStep + 1} / {totalSteps}
            </span>
          </div>
        </div>

        {activeStep && (
          <div className="aui-scrubber-step-info">
            <h4 className="aui-scrubber-step-title">{activeStep.title}</h4>
            <p className="aui-scrubber-step-desc">{activeStep.description}</p>
          </div>
        )}
      </div>
    );
  }
);

StepScrubber.displayName = "StepScrubber";
