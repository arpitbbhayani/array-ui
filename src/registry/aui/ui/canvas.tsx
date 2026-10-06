"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface CanvasProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "plain" | "grid" | "ruled";
  frame?: boolean;
  title?: string;
  badge?: React.ReactNode;
  footer?: React.ReactNode;
}

export function Canvas({
  variant = "grid",
  frame = true,
  title,
  badge,
  footer,
  children,
  className,
  ...props
}: CanvasProps) {
  return (
    <div
      className={cn(
        "relative rounded-lg border border-border bg-card text-card-foreground overflow-hidden shadow-xs",
        variant === "grid" && "bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:20px_20px]",
        variant === "ruled" && "bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:24px_24px]",
        className
      )}
      {...props}
    >
      {(title || badge) && (
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30 font-mono text-xs">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>{title}</span>
          </div>
          {badge && <div>{badge}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
      {footer && (
        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/20 font-mono text-xs text-muted-foreground">
          {footer}
        </div>
      )}
    </div>
  );
}
