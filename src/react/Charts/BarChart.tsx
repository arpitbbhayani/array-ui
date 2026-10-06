"use client";

import React, { useState, useRef } from "react";
import { cn } from "../../utils/cn";
import { DataPoint } from "./AreaChart";

export interface BarChartProps {
  data: DataPoint[];
  categories: string[];
  index: string;
  colors?: ("primary" | "emerald" | "amber" | "rose" | "cyan")[];
  valueFormatter?: (value: number) => string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  className?: string;
}

const COLOR_MAP: Record<string, { fill: string }> = {
  primary: { fill: "var(--aui-primary, #e5000f)" },
  emerald: { fill: "var(--aui-c-green, #10b981)" },
  amber: { fill: "var(--aui-c-amber, #d97706)" },
  rose: { fill: "var(--aui-c-red, #dc2626)" },
  cyan: { fill: "var(--aui-c-cyan, #0891b2)" },
};

export function BarChart({
  data = [],
  categories = [],
  index,
  colors = ["primary", "emerald", "amber"],
  valueFormatter = (val) => String(val),
  height = 240,
  showGrid = true,
  showLegend = true,
  className,
}: BarChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  if (!data || data.length === 0) {
    return (
      <div
        className={cn("aui-chart-container aui-chart-empty", className)}
        style={{ height }}
      >
        <span className="aui-text-muted">No telemetry data</span>
      </div>
    );
  }

  const padLeft = 48;
  const padRight = 16;
  const padTop = 16;
  const padBottom = 28;
  const width = 600;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  let maxVal = 0;
  for (const row of data) {
    for (const cat of categories) {
      const val = Number(row[cat]) || 0;
      if (val > maxVal) maxVal = val;
    }
  }
  if (maxVal === 0) maxVal = 10;
  maxVal = Math.ceil(maxVal * 1.15);

  const groupWidth = chartW / data.length;
  const barPadding = 0.2;
  const availableBarWidth = groupWidth * (1 - barPadding);
  const barWidth = Math.max(2, availableBarWidth / categories.length);

  const getY = (val: number) => {
    return padTop + chartH - (val / maxVal) * chartH;
  };

  const gridSteps = 4;
  const yTicks = Array.from({ length: gridSteps + 1 }, (_, i) => {
    const val = (maxVal / gridSteps) * (gridSteps - i);
    return { val, y: padTop + (i / gridSteps) * chartH };
  });

  return (
    <div className={cn("aui-chart-container", className)}>
      {showLegend && (
        <div className="aui-chart-legend">
          {categories.map((cat, i) => {
            const colorKey = colors[i % colors.length] || "primary";
            const c = COLOR_MAP[colorKey] || COLOR_MAP.primary;
            return (
              <div key={cat} className="aui-chart-legend-item">
                <span
                  className="aui-chart-legend-dot"
                  style={{ backgroundColor: c.fill }}
                />
                <span className="aui-chart-legend-label">{cat}</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="aui-chart-svg-wrapper" style={{ height }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="aui-chart-svg"
          onMouseLeave={() => setHoverIndex(null)}
        >
          {/* Gridlines */}
          {showGrid &&
            yTicks.map((tick, i) => (
              <g key={i}>
                <line
                  x1={padLeft}
                  y1={tick.y}
                  x2={width - padRight}
                  y2={tick.y}
                  className="aui-chart-gridline"
                />
                <text
                  x={padLeft - 8}
                  y={tick.y + 4}
                  textAnchor="end"
                  className="aui-chart-axis-label"
                >
                  {valueFormatter(Math.round(tick.val))}
                </text>
              </g>
            ))}

          {/* Bar Groups */}
          {data.map((row, groupIdx) => {
            const groupX = padLeft + groupIdx * groupWidth + (groupWidth * barPadding) / 2;
            const isHovered = hoverIndex === groupIdx;

            return (
              <g
                key={groupIdx}
                onMouseEnter={() => setHoverIndex(groupIdx)}
                className="aui-chart-bar-group"
              >
                {/* Background hover bar highlight */}
                {isHovered && (
                  <rect
                    x={padLeft + groupIdx * groupWidth}
                    y={padTop}
                    width={groupWidth}
                    height={chartH}
                    fill="var(--aui-clickable-hover, rgba(255,255,255,0.05))"
                    rx="3"
                  />
                )}

                {categories.map((cat, catIdx) => {
                  const colorKey = colors[catIdx % colors.length] || "primary";
                  const c = COLOR_MAP[colorKey] || COLOR_MAP.primary;
                  const val = Number(row[cat]) || 0;
                  const barX = groupX + catIdx * barWidth;
                  const barY = getY(val);
                  const barH = padTop + chartH - barY;

                  return (
                    <rect
                      key={cat}
                      x={barX}
                      y={barY}
                      width={Math.max(1, barWidth - 1)}
                      height={Math.max(0, barH)}
                      fill={c.fill}
                      rx="1"
                      className="aui-chart-bar"
                    />
                  );
                })}

                {/* X-axis label */}
                <text
                  x={groupX + availableBarWidth / 2}
                  y={height - 8}
                  textAnchor="middle"
                  className="aui-chart-axis-label"
                >
                  {String(row[index] || "")}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip card */}
        {hoverIndex !== null && data[hoverIndex] && (
          <div
            className="aui-chart-tooltip"
            style={{
              left: `${
                ((padLeft + hoverIndex * groupWidth + groupWidth / 2) / width) *
                100
              }%`,
              transform:
                hoverIndex > data.length / 2
                  ? "translate(-105%, 10%)"
                  : "translate(10%, 10%)",
            }}
          >
            <div className="aui-chart-tooltip-title">
              {String(data[hoverIndex][index] || "")}
            </div>
            {categories.map((cat, i) => {
              const colorKey = colors[i % colors.length] || "primary";
              const c = COLOR_MAP[colorKey] || COLOR_MAP.primary;
              const val = Number(data[hoverIndex][cat]) || 0;
              return (
                <div key={cat} className="aui-chart-tooltip-row">
                  <span
                    className="aui-chart-tooltip-dot"
                    style={{ backgroundColor: c.fill }}
                  />
                  <span className="aui-chart-tooltip-name">{cat}</span>
                  <span className="aui-chart-tooltip-val">
                    {valueFormatter(val)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
