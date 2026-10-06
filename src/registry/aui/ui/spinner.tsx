import * as React from "react";
import { cn } from "@/lib/utils";

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "md" | "lg";
}

const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ size = "md", className, ...props }, ref) => {
    const sizeClasses = {
      sm: "h-3.5 w-3.5 border-2",
      md: "h-5 w-5 border-2",
      lg: "h-7 w-7 border-3",
    };

    return (
      <span
        ref={ref}
        role="status"
        aria-label="Loading"
        className={cn(
          "inline-block rounded-full border-border border-t-primary animate-spin",
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);
Spinner.displayName = "Spinner";

export { Spinner };
