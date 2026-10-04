import React from "react";

export interface TooltipProps {
  content: React.ReactNode;
  placement?: "top" | "bottom";
  children: React.ReactNode;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  placement = "top",
  children,
  className = "",
}) => (
  <span className={`aui-tooltip ${placement === "bottom" ? "aui-tooltip-bottom" : ""} ${className}`}>
    {children}
    <span role="tooltip" className="aui-tooltip-content">
      {content}
    </span>
  </span>
);
