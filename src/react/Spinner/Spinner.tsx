import React from "react";

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "md" | "lg";
}

export const Spinner: React.FC<SpinnerProps> = ({ size = "md", className = "", ...props }) => (
  <span
    role="status"
    aria-label="Loading"
    className={`aui-spinner ${size !== "md" ? `aui-spinner-${size}` : ""} ${className}`}
    {...props}
  />
);
