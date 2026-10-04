import React from "react";
import { cn } from "../../utils/cn";

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "md" | "lg";
}

export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ size = "md", className, ...props }, ref) => (
    <span
      ref={ref}
      role="status"
      aria-label="Loading"
      className={cn(
        "aui-spinner",
        size !== "md" && `aui-spinner-${size}`,
        className
      )}
      {...props}
    />
  )
);

Spinner.displayName = "Spinner";
