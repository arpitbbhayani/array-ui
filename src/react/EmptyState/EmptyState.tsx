import React from "react";
import { cn } from "../../utils/cn";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, children, className, ...props }, ref) => (
    <div ref={ref} className={cn("aui-empty", className)} {...props}>
      {icon && <span className="aui-empty-icon">{icon}</span>}
      <h4 className="aui-empty-title">{title}</h4>
      {description && <p className="aui-empty-desc">{description}</p>}
      {children}
    </div>
  )
);

EmptyState.displayName = "EmptyState";
