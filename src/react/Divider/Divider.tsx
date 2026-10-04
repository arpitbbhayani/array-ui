import React from "react";
import { cn } from "../../utils/cn";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  orientation?: "horizontal" | "vertical";
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ label, orientation = "horizontal", className, ...props }, ref) => {
    if (orientation === "vertical") {
      return (
        <div
          ref={ref}
          role="separator"
          aria-orientation="vertical"
          className={cn("aui-divider-vertical", className)}
          {...props}
        />
      );
    }

    if (label) {
      return (
        <div
          ref={ref}
          role="separator"
          aria-orientation="horizontal"
          className={cn("aui-divider-labeled", className)}
          {...props}
        >
          {label}
        </div>
      );
    }

    return (
      <hr
        ref={ref as unknown as React.Ref<HTMLHRElement>}
        className={cn("aui-divider", className)}
        {...(props as React.HTMLAttributes<HTMLHRElement>)}
      />
    );
  }
);

Divider.displayName = "Divider";

/**
 * Separator alias for shadcn/ui convention
 */
export const Separator = Divider;
