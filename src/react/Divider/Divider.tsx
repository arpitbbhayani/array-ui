import React from "react";

export interface DividerProps {
  label?: string;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ label, className = "" }) =>
  label ? (
    <div role="separator" className={`aui-divider-labeled ${className}`}>
      {label}
    </div>
  ) : (
    <hr className={`aui-divider ${className}`} />
  );
