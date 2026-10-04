import React from "react";

export interface StatCardProps {
  value: React.ReactNode;
  label: React.ReactNode;
  description?: React.ReactNode;
  trend?: React.ReactNode;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  description,
  trend,
  className = "",
}) => {
  return (
    <div className={`aui-stat-card ${className}`}>
      <div className="aui-stat-value">{value}</div>
      <div className="aui-stat-label">{label}</div>
      {description && <div className="aui-stat-desc">{description}</div>}
      {trend && <div style={{ marginTop: "0.5rem", fontSize: "0.82rem" }}>{trend}</div>}
    </div>
  );
};
