import * as React from "react";
import { cn } from "@/lib/utils";

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
          "relative inline-flex group cursor-help",
          className
        )}
        {...props}
      >
        {children}
        {content && (
          <span
            role="tooltip"
            className={cn(
              "pointer-events-none absolute z-50 whitespace-nowrap rounded border border-border bg-[#18181c] text-[#ececf1] px-2 py-0.5 text-xs font-mono opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 shadow-md left-1/2 -translate-x-1/2",
              placement === "bottom" ? "top-full mt-1.5" : "bottom-full mb-1.5"
            )}
          >
            {content}
          </span>
        )}
      </span>
    );
  }
);
Tooltip.displayName = "Tooltip";
