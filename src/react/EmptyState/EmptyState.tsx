import React from "react";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  children,
  className = "",
}) => (
  <div className={`aui-empty ${className}`}>
    {icon && <span className="aui-empty-icon">{icon}</span>}
    <h4 className="aui-empty-title">{title}</h4>
    {description && <p className="aui-empty-desc">{description}</p>}
    {children}
  </div>
);
