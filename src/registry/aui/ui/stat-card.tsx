import * as React from "react";
import { cn } from "@/lib/utils";

export type StatCardAccent =
  | "red"
  | "rose"
  | "green"
  | "emerald"
  | "blue"
  | "amber"
  | "violet"
  | "pink"
  | "cyan";

const ACCENT_STYLES: Record<StatCardAccent, string> = {
  green: "text-emerald-600 dark:text-emerald-400",
  emerald: "text-emerald-600 dark:text-emerald-400",
  red: "text-rose-600 dark:text-rose-400",
  rose: "text-rose-600 dark:text-rose-400",
  amber: "text-amber-600 dark:text-amber-400",
  blue: "text-sky-600 dark:text-sky-400",
  violet: "text-purple-600 dark:text-purple-400",
  pink: "text-pink-600 dark:text-pink-400",
  cyan: "text-cyan-600 dark:text-cyan-400",
};

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  value: React.ReactNode;
  label: React.ReactNode;
  description?: React.ReactNode;
  trend?: React.ReactNode;
  accent?: StatCardAccent;
}

export function StatCard({
  value,
  label,
  description,
  trend,
  accent,
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
        <div
          className={cn(
            "font-heading text-3xl md:text-4xl font-extrabold text-foreground tracking-tight tabular-nums",
            accent && ACCENT_STYLES[accent]
          )}
        >
          {value}
        </div>
        <div className="font-sans text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-1">
          {label}
        </div>
      </div>
      {(description || trend) && (
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          {description && <div>{description}</div>}
          {trend && <div className="font-mono text-emerald-500 font-medium">{trend}</div>}
        </div>
      )}
    </div>
  );
}
