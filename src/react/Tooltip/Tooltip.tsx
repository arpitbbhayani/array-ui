import React from "react";
import { cn } from "../../utils/cn";

export interface TooltipProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "content"> {
  content?: React.ReactNode;
  placement?: "top" | "bottom";
  children: React.ReactNode;
}

export const Tooltip = React.forwardRef<HTMLSpanElement, TooltipProps>(
  ({ content, placement = "top", children, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "aui-tooltip",
          placement === "bottom" && "aui-tooltip-bottom",
          className
        )}
        {...props}
      >
        {children}
        {content && (
          <span role="tooltip" className="aui-tooltip-content">
            {content}
          </span>
        )}
      </span>
    );
  }
);
Tooltip.displayName = "Tooltip";

export const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <>{children}</>;

export const TooltipTrigger = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span ref={ref} className={cn("aui-tooltip-trigger", className)} {...props} />
));
TooltipTrigger.displayName = "TooltipTrigger";

export const TooltipContent = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="tooltip"
    className={cn("aui-tooltip-content", className)}
    {...props}
  />
));
TooltipContent.displayName = "TooltipContent";
