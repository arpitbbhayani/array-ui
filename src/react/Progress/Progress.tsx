import React from "react";

export interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "success" | "info" | "warning";
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  label,
  showValue = false,
  size = "md",
  variant = "primary",
  className = "",
}) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="aui-progress-head">
          <span>{label}</span>
          {showValue && <span>{Math.round(pct)}%</span>}
        </div>
      )}
      <div
        className={`aui-progress aui-progress-${variant} ${size !== "md" ? `aui-progress-${size}` : ""}`}
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
};
