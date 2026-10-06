"use client";

import React from "react";
import { cn } from "../../utils/cn";

export interface CanvasProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "plain" | "grid" | "ruled";
  frame?: boolean;
  title?: string;
  badge?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Canvas = React.forwardRef<HTMLDivElement, CanvasProps>(
  ({ variant = "grid", frame = true, title, badge, footer, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "aui-canvas",
          variant === "grid" && "aui-canvas-grid",
          variant === "ruled" && "aui-canvas-ruled",
          frame && "aui-canvas-frame",
          className
        )}
        {...props}
      >
        {(title || badge) && (
          <div className="aui-canvas-header">
            <div className="aui-canvas-title">
              <span className="aui-canvas-title-dot" />
              <span>{title}</span>
            </div>
            {badge && <div className="aui-canvas-badge">{badge}</div>}
          </div>
        )}
        <div className="aui-canvas-body">{children}</div>
        {footer && <div className="aui-canvas-footer">{footer}</div>}
      </div>
    );
  }
);

Canvas.displayName = "Canvas";
