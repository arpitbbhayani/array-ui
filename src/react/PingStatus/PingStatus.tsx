import React from "react";

export type PingVariant = "success" | "warning" | "danger" | "error" | "info" | "neutral";
export type PingSize = "sm" | "md" | "lg";

export interface PingStatusProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: PingVariant;
  size?: PingSize;
  label?: React.ReactNode;
  pulse?: boolean;
}

export const PingStatus: React.FC<PingStatusProps> = ({
  variant = "success",
  size = "md",
  label,
  pulse = true,
  className = "",
  ...props
}) => {
  const variantClass = `aui-ping-${variant}`;
  const sizeClass = `aui-ping-${size}`;

  return (
    <div className={`aui-ping-wrapper ${className}`} {...props}>
      <span className={`aui-ping ${variantClass} ${sizeClass}`}>
        {pulse && <span className="aui-ping-ring" />}
        <span className="aui-ping-dot" />
      </span>
      {label && <span>{label}</span>}
    </div>
  );
};
