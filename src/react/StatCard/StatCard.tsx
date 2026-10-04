import React from "react";

export interface StatCardProps {
  value: React.ReactNode;
  label: React.ReactNode;
  description?: React.ReactNode;
  trend?: React.ReactNode;
  accent?: "red" | "blue" | "violet" | "green" | "amber" | "pink" | "cyan";
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  description,
  trend,
  accent,
  className = "",
}) => {
  return (
    <div className={`aui-stat-card ${accent ? `aui-accent-${accent}` : ""} ${className}`}>
      <div className="aui-stat-value">{value}</div>
      <div className="aui-stat-label">{label}</div>
      {description && <div className="aui-stat-desc">{description}</div>}
      {trend && <div style={{ marginTop: "0.5rem", fontSize: "0.82rem" }}>{trend}</div>}
    </div>
  );
};
