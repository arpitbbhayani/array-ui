"use client";

import React from "react";
import { cn } from "../../utils/cn";

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

export const FeatureMatrix = React.forwardRef<HTMLDivElement, FeatureMatrixProps>(
  ({ columns, rows, className, ...props }, ref) => {
    const renderCell = (val: boolean | "partial" | string | React.ReactNode) => {
      if (val === true) {
        return <span className="aui-feature-check">✓</span>;
      }
      if (val === false) {
        return <span className="aui-feature-cross">✕</span>;
      }
      if (val === "partial") {
        return <span className="aui-feature-partial">Partial</span>;
      }
      return <span>{val}</span>;
    };

    return (
      <div ref={ref} className={cn("aui-feature-matrix-wrapper", className)} {...props}>
        <table className="aui-feature-matrix">
          <thead>
            <tr>
              <th>Feature</th>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              if (row.category) {
                return (
                  <tr key={idx} className="is-category-row">
                    <td colSpan={columns.length + 1}>{row.category}</td>
                  </tr>
                );
              }

              return (
                <tr key={idx}>
                  <td>{row.name}</td>
                  {columns.map((col) => (
                    <td key={col.key}>
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
);

FeatureMatrix.displayName = "FeatureMatrix";
