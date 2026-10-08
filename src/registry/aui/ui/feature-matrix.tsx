"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface FeatureMatrixColumn {
  key: string;
  label: string;
}

export interface FeatureMatrixRow {
  category?: string;
  name?: string;
  values?: Record<string, boolean | "partial" | string | React.ReactNode>;
}

export interface FeatureMatrixProps extends React.HTMLAttributes<HTMLDivElement> {
  columns: FeatureMatrixColumn[];
  rows: FeatureMatrixRow[];
}

export function FeatureMatrix({
  columns,
  rows,
  className,
  ...props
}: FeatureMatrixProps) {
  const renderCell = (val: boolean | "partial" | string | React.ReactNode) => {
    if (val === true) {
      return <span className="text-emerald-500 font-bold text-base">✓</span>;
    }
    if (val === false) {
      return <span className="text-muted-foreground/40 font-semibold text-sm">✕</span>;
    }
    if (val === "partial") {
      return (
        <span className="font-mono text-[10px] font-medium text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">
          Partial
        </span>
      );
    }
    return <span>{val}</span>;
  };

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card overflow-x-auto my-4 shadow-xs",
        className
      )}
      {...props}
    >
      <table className="w-full text-center text-sm border-collapse">
        <thead className="bg-muted/40 font-heading font-semibold text-xs border-b border-border">
          <tr>
            <th className="px-4 py-3 text-left">Feature</th>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 border-l border-border">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, idx) => {
            if (row.category) {
              return (
                <tr key={idx} className="bg-muted/20">
                  <td
                    colSpan={columns.length + 1}
                    className="px-4 py-2 text-left font-mono text-xs uppercase font-medium text-muted-foreground tracking-wider"
                  >
                    {row.category}
                  </td>
                </tr>
              );
            }

            return (
              <tr key={idx} className="hover:bg-muted/30">
                <td className="px-4 py-2.5 text-left font-medium text-foreground text-xs">
                  {row.name}
                </td>
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-2.5 border-l border-border text-xs">
                    {renderCell(row.values ? row.values[col.key] : false)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
