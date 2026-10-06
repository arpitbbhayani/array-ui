"use client";

import React from "react";
import { cn } from "../../utils/cn";

export interface ParamItem {
  name: string;
  type: string;
  required?: boolean;
  default?: string;
  description: React.ReactNode;
  deprecated?: boolean;
}

export interface ParamTableProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ParamItem[];
}

export const ParamTable = React.forwardRef<HTMLDivElement, ParamTableProps>(
  ({ items, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("aui-param-table-wrapper", className)} {...props}>
        <table className="aui-param-table">
          <thead>
            <tr>
              <th>Option</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                <td>
                  <div className="aui-row-xs aui-flex-wrap">
                    <span
                      className={cn(
                        "aui-param-name",
                        item.deprecated && "line-through opacity-60"
                      )}
                    >
                      {item.name}
                    </span>
                    {item.required ? (
                      <span className="aui-param-badge-req">req</span>
                    ) : (
                      <span className="aui-param-badge-opt">opt</span>
                    )}
                  </div>
                </td>
                <td>
                  <span className="aui-param-type">{item.type}</span>
                </td>
                <td>
                  <span className="aui-param-default">
                    {item.default ?? "—"}
                  </span>
                </td>
                <td>{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);

ParamTable.displayName = "ParamTable";
