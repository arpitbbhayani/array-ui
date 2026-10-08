"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface MemorySegment {
  name: string;
  bytes: number;
  offset?: string;
  type?: string;
  value?: string;
  description?: string;
  color?: "crimson" | "emerald" | "amber" | "blue" | "violet" | "neutral";
}

export interface MemoryLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  totalBytes?: number | string;
  segments: MemorySegment[];
}

export function MemoryLayout({
  title = "Memory Layout",
  totalBytes,
  segments,
  className,
  ...props
}: MemoryLayoutProps) {
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);

  const totalCalculated =
    totalBytes ??
    segments.reduce((acc, s) => acc + (typeof s.bytes === "number" ? s.bytes : 0), 0);

  const activeSeg = segments[selectedIndex] ?? segments[0];

  const getColorClass = (c?: string) => {
    switch (c) {
      case "crimson":
        return "bg-primary/10 text-primary border-primary/20";
      case "emerald":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "amber":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "blue":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "violet":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      default:
        return "bg-muted text-foreground border-border";
    }
  };

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card text-card-foreground overflow-hidden my-4 shadow-xs",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30 font-mono text-xs">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>{title}</span>
        </div>
        <div className="text-muted-foreground">Total: {totalCalculated} bytes</div>
      </div>

      <div className="p-4 bg-muted/10 border-b border-border overflow-x-auto">
        <div className="flex min-h-[52px] min-w-[580px] w-full border border-border rounded-md overflow-hidden bg-card">
          {segments.map((seg, idx) => {
            const flexGrow = Math.max(seg.bytes, 1);
            const isSelected = selectedIndex === idx;

            return (
              <div
                key={idx}
                className={cn(
                  "flex flex-col justify-center items-center p-2 border-r border-border cursor-pointer transition-all min-w-0 max-w-full overflow-hidden last:border-r-0 select-none",
                  getColorClass(seg.color),
                  isSelected && "ring-2 ring-primary ring-inset z-10 font-bold"
                )}
                style={{ flex: `${flexGrow} 1 0%` }}
                onClick={() => setSelectedIndex(idx)}
                title={`${seg.name} (${seg.bytes} bytes, ${seg.offset ?? ""})`}
              >
                <span className="font-mono text-sm font-medium truncate w-full text-center block">
                  {seg.name}
                </span>
                <span className="font-mono text-xs opacity-85 truncate w-full text-center block">
                  {seg.offset ?? `${seg.bytes}B`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {activeSeg && (
        <div className="p-4 bg-card text-sm">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span className="font-mono text-xs uppercase font-medium text-muted-foreground block mb-1">
                Field
              </span>
              <span className="font-mono font-medium text-foreground">
                {activeSeg.name}
              </span>
            </div>
            <div>
              <span className="font-mono text-xs uppercase font-medium text-muted-foreground block mb-1">
                Offset
              </span>
              <span className="font-mono font-medium text-foreground">
                {activeSeg.offset ?? "—"}
              </span>
            </div>
            <div>
              <span className="font-mono text-xs uppercase font-medium text-muted-foreground block mb-1">
                Size
              </span>
              <span className="font-mono font-medium text-foreground">
                {activeSeg.bytes} bytes ({activeSeg.bytes * 8} bits)
              </span>
            </div>
            {activeSeg.type && (
              <div>
                <span className="font-mono text-xs uppercase font-medium text-muted-foreground block mb-1">
                  Type
                </span>
                <span className="font-mono font-medium text-blue-500">
                  {activeSeg.type}
                </span>
              </div>
            )}
          </div>
          {activeSeg.description && (
            <div className="mt-3 pt-3 border-t border-border">
              <span className="font-mono text-xs uppercase font-medium text-muted-foreground block mb-1">
                Description
              </span>
              <p className="text-muted-foreground">{activeSeg.description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
