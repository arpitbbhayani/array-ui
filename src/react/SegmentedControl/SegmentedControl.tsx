"use client";

import React, { useState } from "react";

export interface SegmentedOption {
  value: string;
  label: React.ReactNode;
}

export interface SegmentedControlProps {
  options: SegmentedOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  defaultValue,
  onChange,
  className = "",
}) => {
  const [internal, setInternal] = useState(defaultValue ?? options[0]?.value);
  const current = value ?? internal;

  return (
    <div className={`aui-segmented ${className}`} role="group">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`aui-segmented-item ${opt.value === current ? "is-active" : ""}`}
          aria-pressed={opt.value === current}
          onClick={() => {
            setInternal(opt.value);
            onChange?.(opt.value);
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};
