import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "success" | "info" | "warning";
}

const SIZE_MAP = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

const VARIANT_BAR = {
  primary: "bg-primary",
  success: "bg-emerald-500",
  info: "bg-sky-500",
  warning: "bg-amber-500",
};

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value = 0,
      max = 100,
      label,
      showValue = false,
      size = "md",
      variant = "primary",
      className,
      ...props
    },
    ref
  ) => {
    const pct = Math.min(100, Math.max(0, (value / (max || 1)) * 100));

    return (
      <div ref={ref} className={cn("w-full space-y-1.5 my-2", className)} {...props}>
        {(label || showValue) && (
          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
            {label && <span>{label}</span>}
            {showValue && <span className="tabular-nums font-semibold">{Math.round(pct)}%</span>}
          </div>
        )}
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-full bg-secondary border border-border/50",
            SIZE_MAP[size]
          )}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label}
        >
          <div
            className={cn(
              "h-full transition-all duration-300 ease-out",
              VARIANT_BAR[variant]
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = "Progress";
