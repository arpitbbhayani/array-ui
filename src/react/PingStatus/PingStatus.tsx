import React from "react";
import { cn } from "../../utils/cn";

export type PingVariant = "success" | "warning" | "danger" | "error" | "info" | "neutral";
export type PingSize = "sm" | "md" | "lg";

export interface PingStatusProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: PingVariant;
  size?: PingSize;
  label?: React.ReactNode;
  pulse?: boolean;
}

export const PingStatus = React.forwardRef<HTMLDivElement, PingStatusProps>(
  (
    {
      variant = "success",
      size = "md",
      label,
      pulse = true,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("aui-ping-wrapper", className)}
        {...props}
      >
        <span
          className={cn(
            "aui-ping",
            `aui-ping-${variant}`,
            `aui-ping-${size}`
          )}
        >
          {pulse && <span className="aui-ping-ring" />}
          <span className="aui-ping-dot" />
        </span>
        {label && <span>{label}</span>}
      </div>
    );
  }
);

PingStatus.displayName = "PingStatus";
