"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

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
}: SliderProps) {
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  return (
    <div className={cn("flex flex-col gap-2 w-full", disabled && "opacity-50 pointer-events-none", className)}>
      <div className="flex items-center justify-between text-xs font-medium">
        {label && <span className="text-foreground">{label}</span>}
        <span className="font-mono text-primary font-medium">{valueFormatter(value)}</span>
      </div>

      <div className="relative flex items-center select-none touch-none w-full h-5">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
        />
      </div>
    </div>
  );
}
