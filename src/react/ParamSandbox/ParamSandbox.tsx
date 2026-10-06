"use client";

import React, { useState } from "react";
import { cn } from "../../utils/cn";

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
  compute: (vals: Record<string, number>) => string | number;
}

export interface ParamSandboxProps extends React.HTMLAttributes<HTMLDivElement> {
  formula: string;
  inputs: SandboxInput[];
  outputs: SandboxOutput[];
}

export const ParamSandbox = React.forwardRef<HTMLDivElement, ParamSandboxProps>(
  ({ formula, inputs, outputs, className, ...props }, ref) => {
    const initialVals: Record<string, number> = {};
    inputs.forEach((inp) => {
      initialVals[inp.id] = inp.defaultValue ?? inp.min;
    });

    const [values, setValues] = useState<Record<string, number>>(initialVals);

    const handleChange = (id: string, val: number) => {
      setValues((prev) => ({ ...prev, [id]: val }));
    };

    return (
      <div ref={ref} className={cn("aui-param-sandbox", className)} {...props}>
        <div className="aui-sandbox-formula-bar">
          <span className="aui-sandbox-formula-badge">Formula:</span>
          <code className="aui-sandbox-formula-code">{formula}</code>
        </div>

        <div className="aui-sandbox-grid">
          <div className="aui-sandbox-inputs">
            {inputs.map((inp) => (
              <div key={inp.id} className="aui-sandbox-input-item">
                <div className="aui-sandbox-input-header">
                  <span className="aui-sandbox-input-label">{inp.label}</span>
                  <span className="aui-sandbox-input-val">
                    {values[inp.id]} {inp.unit ?? ""}
                  </span>
                </div>
                <input
                  type="range"
                  min={inp.min}
                  max={inp.max}
                  step={inp.step ?? 1}
                  value={values[inp.id]}
                  className="aui-sandbox-slider"
                  onChange={(e) =>
                    handleChange(inp.id, parseFloat(e.target.value))
                  }
                />
              </div>
            ))}
          </div>

          <div className="aui-sandbox-outputs">
            {outputs.map((out, idx) => (
              <div key={idx} className="aui-sandbox-output-card">
                <span className="aui-sandbox-output-label">{out.label}</span>
                <span className="aui-sandbox-output-val font-mono">
                  {out.compute(values)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

ParamSandbox.displayName = "ParamSandbox";
