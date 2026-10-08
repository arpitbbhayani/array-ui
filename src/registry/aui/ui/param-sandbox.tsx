"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SandboxInput {
  id: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  defaultValue?: number;
}

export interface SandboxOutput {
  label: string;
  compute?: ((vals: Record<string, number>) => string | number) | null;
  value?: string | number;
}

export interface ParamSandboxProps extends React.HTMLAttributes<HTMLDivElement> {
  formula: string;
  inputs: SandboxInput[];
  outputs: SandboxOutput[];
}

export function ParamSandbox({
  formula,
  inputs = [],
  outputs = [],
  className,
  ...props
}: ParamSandboxProps) {
  const initialVals: Record<string, number> = {};
  (inputs || []).forEach((inp) => {
    initialVals[inp.id] = inp.defaultValue ?? inp.min;
  });

  const [values, setValues] = React.useState<Record<string, number>>(initialVals);

  const handleChange = (id: string, val: number) => {
    setValues((prev) => ({ ...prev, [id]: val }));
  };

  const getOutputValue = (out: SandboxOutput) => {
    if (typeof out.compute === "function") {
      try {
        return out.compute(values);
      } catch {
        return "—";
      }
    }
    const nodes = values["nodes"] ?? Object.values(values)[0] ?? 5;
    if (out.label.toLowerCase().includes("quorum")) {
      return Math.floor(nodes / 2) + 1;
    }
    if (out.label.toLowerCase().includes("failure") || out.label.toLowerCase().includes("tolerable")) {
      return Math.floor((nodes - 1) / 2);
    }
    if (out.value !== undefined) {
      return out.value;
    }
    return "—";
  };

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card overflow-hidden my-4 shadow-xs",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-border bg-muted/30">
        <span className="font-mono text-xs uppercase font-medium text-muted-foreground">
          Formula:
        </span>
        <code className="font-mono text-xs font-medium text-foreground">
          {formula}
        </code>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5">
        <div className="space-y-4">
          {(inputs || []).map((inp) => (
            <div key={inp.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-medium text-foreground">
                  {inp.label}
                </span>
                <span className="font-mono font-medium text-primary">
                  {values[inp.id] ?? inp.defaultValue ?? inp.min} {inp.unit ?? ""}
                </span>
              </div>
              <input
                type="range"
                min={inp.min}
                max={inp.max}
                step={inp.step ?? 1}
                value={values[inp.id] ?? inp.defaultValue ?? inp.min}
                className="w-full accent-primary cursor-pointer"
                onChange={(e) =>
                  handleChange(inp.id, parseFloat(e.target.value))
                }
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-center gap-3">
          {(outputs || []).map((out, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3.5 rounded-md border border-border bg-muted/20"
            >
              <span className="font-mono text-xs text-muted-foreground">
                {out.label}
              </span>
              <span className="font-mono text-base font-medium text-foreground">
                {getOutputValue(out)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
