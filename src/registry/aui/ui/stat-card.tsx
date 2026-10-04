import * as React from "react";
import { cn } from "@/lib/utils";

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  value: React.ReactNode;
  label: React.ReactNode;
  description?: React.ReactNode;
  trend?: React.ReactNode;
}

export function StatCard({
  value,
  label,
  description,
  trend,
  className,
  ...props
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between my-3",
        className
      )}
      {...props}
    >
      <div>
        <div className="font-heading text-3xl md:text-4xl font-extrabold text-foreground tracking-tight tabular-nums">
          {value}
        </div>
        <div className="font-sans text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-1">
          {label}
        </div>
      </div>
      {(description || trend) && (
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          {description && <div>{description}</div>}
          {trend && <div className="font-mono text-emerald-500 font-semibold">{trend}</div>}
        </div>
      )}
    </div>
  );
}
