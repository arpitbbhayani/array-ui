import * as React from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  children,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-border bg-card/50 my-4",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-muted-foreground mb-3">
          {icon}
        </div>
      )}
      <h4 className="font-heading font-semibold text-lg text-foreground mb-1">
        {title}
      </h4>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-4">
          {description}
        </p>
      )}
      {children}
    </div>
  );
}
