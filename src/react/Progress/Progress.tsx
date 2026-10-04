import React from "react";
import { cn } from "../../utils/cn";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "success" | "info" | "warning";
}

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
    const pct = Math.min(100, Math.max(0, (value / max) * 100));

    return (
      <div ref={ref} className={className} {...props}>
        {(label || showValue) && (
          <div className="aui-progress-head">
            <span>{label}</span>
            {showValue && <span>{Math.round(pct)}%</span>}
          </div>
        )}
        <div
          className={cn(
            "aui-progress",
            `aui-progress-${variant}`,
            size !== "md" && `aui-progress-${size}`
          )}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label}
        >
          <div className="aui-progress-bar" style={{ width: `${pct}%` }} />
        </div>
      </div>
    );
  }
);

Progress.displayName = "Progress";
