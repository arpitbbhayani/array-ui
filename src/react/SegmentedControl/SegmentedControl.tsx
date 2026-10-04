"use client";

import React, { useState } from "react";
import { cn } from "../../utils/cn";

export interface SegmentedOption {
  value: string;
  label: React.ReactNode;
}

export interface SegmentedControlProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: SegmentedOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export const SegmentedControl = React.forwardRef<HTMLDivElement, SegmentedControlProps>(
  (
    {
      options,
      value,
      defaultValue,
      onChange,
      className,
      ...props
    },
    ref
  ) => {
    const [internal, setInternal] = useState(defaultValue ?? options[0]?.value);
    const current = value ?? internal;

    return (
      <div
        ref={ref}
        className={cn("aui-segmented", className)}
        role="group"
        {...props}
      >
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={cn(
              "aui-segmented-item",
              opt.value === current && "is-active"
            )}
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
  }
);

SegmentedControl.displayName = "SegmentedControl";
