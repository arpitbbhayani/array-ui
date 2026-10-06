"use client";

import React, { useRef, useId } from "react";
import { cn } from "../../utils/cn";

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  valueFormatter?: (value: number) => string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  valueFormatter = (val) => String(val),
  disabled = false,
  className,
  id,
}: SliderProps) {
  const generatedId = useId();
  const sliderId = id || (label ? `slider-${label.toLowerCase().replace(/\s+/g, "-")}` : `slider-${generatedId}`);
  const trackRef = useRef<HTMLDivElement>(null);

  const percentage = Math.max(
    0,
    Math.min(100, ((value - min) / (max - min)) * 100)
  );

  const updateFromPosition = (clientX: number) => {
    if (disabled || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const rawPos = (clientX - rect.left) / rect.width;
    const clampedPos = Math.max(0, Math.min(1, rawPos));
    const rawVal = min + clampedPos * (max - min);
    const steppedVal = Math.round(rawVal / step) * step;
    const finalVal = Math.max(min, Math.min(max, Number(steppedVal.toFixed(6))));
    onChange(finalVal);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateFromPosition(e.clientX);

    const onPointerMove = (moveEvent: PointerEvent) => {
      updateFromPosition(moveEvent.clientX);
    };

    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    let nextVal = value;

    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      nextVal = Math.min(max, value + step);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      nextVal = Math.max(min, value - step);
    } else if (e.key === "Home") {
      e.preventDefault();
      nextVal = min;
    } else if (e.key === "End") {
      e.preventDefault();
      nextVal = max;
    } else if (e.key === "PageUp") {
      e.preventDefault();
      nextVal = Math.min(max, value + step * 10);
    } else if (e.key === "PageDown") {
      e.preventDefault();
      nextVal = Math.max(min, value - step * 10);
    }

    if (nextVal !== value) {
      onChange(nextVal);
    }
  };

  return (
    <div className={cn("aui-slider-wrapper", disabled && "is-disabled", className)}>
      <div className="aui-slider-header">
        {label && (
          <label htmlFor={sliderId} className="aui-slider-label">
            {label}
          </label>
        )}
        <span className="aui-slider-readout">
          {valueFormatter(value)}
        </span>
      </div>

      <div
        ref={trackRef}
        id={sliderId}
        className="aui-slider-track"
        onPointerDown={handlePointerDown}
      >
        <div
          className="aui-slider-fill"
          style={{ width: `${percentage}%` }}
        />
        <div
          className="aui-slider-thumb"
          style={{ left: `${percentage}%` }}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={valueFormatter(value)}
          aria-label={label || "Slider"}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}
