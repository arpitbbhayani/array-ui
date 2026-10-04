import * as React from "react";
import { cn } from "@/lib/utils";

export type PingVariant = "success" | "warning" | "danger" | "info" | "neutral";
export type PingSize = "sm" | "md" | "lg";

export interface PingStatusProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: PingVariant;
  size?: PingSize;
  label?: React.ReactNode;
  pulse?: boolean;
}

const variantStyles: Record<PingVariant, { dot: string; ring: string }> = {
  success: { dot: "bg-emerald-500", ring: "bg-emerald-400" },
  warning: { dot: "bg-amber-500", ring: "bg-amber-400" },
  danger: { dot: "bg-red-500", ring: "bg-red-400" },
  info: { dot: "bg-blue-500", ring: "bg-blue-400" },
  neutral: { dot: "bg-zinc-400", ring: "bg-zinc-300" },
};

const sizeStyles: Record<PingSize, { dot: string; wrapper: string }> = {
  sm: { dot: "w-1.5 h-1.5", wrapper: "w-2.5 h-2.5" },
  md: { dot: "w-2 h-2", wrapper: "w-3 h-3" },
  lg: { dot: "w-2.5 h-2.5", wrapper: "w-4 h-4" },
};

export function PingStatus({
  variant = "success",
  size = "md",
  label,
  pulse = true,
  className,
  ...props
}: PingStatusProps) {
  const v = variantStyles[variant];
  const s = sizeStyles[size];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 text-xs font-mono font-medium text-muted-foreground",
        className
      )}
      {...props}
    >
      <span className={cn("relative flex items-center justify-center", s.wrapper)}>
        {pulse && (
          <span
            className={cn(
              "absolute inset-0 rounded-full opacity-75 motion-safe:animate-ping",
              v.ring
            )}
          />
        )}
        <span className={cn("relative rounded-full", v.dot, s.dot)} />
      </span>
      {label && <span>{label}</span>}
    </div>
  );
}
