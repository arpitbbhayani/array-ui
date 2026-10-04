import React from "react";
import { cn } from "../../utils/cn";

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  value: React.ReactNode;
  label: React.ReactNode;
  description?: React.ReactNode;
  trend?: React.ReactNode;
  accent?: "red" | "blue" | "violet" | "green" | "amber" | "pink" | "cyan";
}

export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      value,
      label,
      description,
      trend,
      accent,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "aui-stat-card",
          accent && `aui-accent-${accent}`,
          className
        )}
        {...props}
      >
        <div className="aui-stat-value">{value}</div>
        <div className="aui-stat-label">{label}</div>
        {description && <div className="aui-stat-desc">{description}</div>}
        {trend && (
          <div style={{ marginTop: "0.5rem", fontSize: "0.82rem" }}>
            {trend}
          </div>
        )}
      </div>
    );
  }
);

StatCard.displayName = "StatCard";
