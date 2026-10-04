import React from "react";

export type AlertVariant = "info" | "success" | "warning" | "error";

export interface AlertProps {
  variant?: AlertVariant;
  title?: React.ReactNode;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = "info",
  title,
  children,
  icon,
  className = "",
}) => {
  return (
    <div className={`aui-alert aui-alert-${variant} ${className}`} role="alert">
      {icon && <span style={{ flexShrink: 0, marginTop: "2px" }}>{icon}</span>}
      <div style={{ flex: 1 }}>
        {title && <div className="aui-alert-title">{title}</div>}
        <div>{children}</div>
      </div>
    </div>
  );
};
