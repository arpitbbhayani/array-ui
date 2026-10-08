"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

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

export function ParamTable({ items, className, ...props }: ParamTableProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card overflow-x-auto my-4 shadow-xs",
        className
      )}
      {...props}
    >
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-muted/40 font-mono text-xs uppercase text-muted-foreground border-b border-border">
          <tr>
            <th className="px-4 py-2.5">Option</th>
            <th className="px-4 py-2.5">Type</th>
            <th className="px-4 py-2.5">Default</th>
            <th className="px-4 py-2.5">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((item, idx) => (
            <tr key={idx} className="hover:bg-muted/30">
              <td className="px-4 py-3 align-top">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={cn(
                      "font-mono text-xs font-medium px-1.5 py-0.5 rounded bg-muted text-foreground",
                      item.deprecated && "line-through opacity-60"
                    )}
                  >
                    {item.name}
                  </span>
                  {item.required ? (
                    <span className="font-mono text-[10px] uppercase font-medium text-primary bg-primary/10 px-1 rounded">
                      req
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1 rounded">
                      opt
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 align-top font-mono text-xs text-blue-500 dark:text-blue-400">
                {item.type}
              </td>
              <td className="px-4 py-3 align-top font-mono text-xs text-muted-foreground">
                {item.default ?? "—"}
              </td>
              <td className="px-4 py-3 align-top text-xs text-muted-foreground leading-relaxed">
                {item.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
