"use client";

import React from "react";
import { cn } from "../../utils/cn";

export interface VersionOption {
  label: string;
  value: string;
  badge?: string;
}

export interface VersionSelectorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  label?: string;
  versions: VersionOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (val: string) => void;
}

export const VersionSelector = React.forwardRef<HTMLDivElement, VersionSelectorProps>(
  ({ label = "Version:", versions, value, defaultValue, onChange, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("aui-version-selector", className)} {...props}>
        {label && <span className="aui-version-label">{label}</span>}
        <select
          className="aui-version-select"
          value={value}
          defaultValue={defaultValue ?? versions[0]?.value}
          onChange={(e) => onChange?.(e.target.value)}
        >
          {versions.map((ver) => (
            <option key={ver.value} value={ver.value}>
              {ver.label} {ver.badge ? `(${ver.badge})` : ""}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

VersionSelector.displayName = "VersionSelector";
