"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

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

export function VersionSelector({
  label = "Version:",
  versions,
  value,
  defaultValue,
  onChange,
  className,
  ...props
}: VersionSelectorProps) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)} {...props}>
      {label && (
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      )}
      <select
        className="font-mono text-xs font-semibold px-2.5 py-1.5 rounded border border-border bg-card text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors"
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
