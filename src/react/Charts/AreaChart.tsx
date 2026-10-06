"use client";

import React, { useState, useRef } from "react";
import { cn } from "../../utils/cn";

export interface DataPoint {
  date: string;
  [key: string]: string | number;
}

export interface AreaChartProps {
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

const COLOR_MAP: Record<string, { stroke: string; fill: string }> = {
  primary: { stroke: "var(--aui-primary, #e5000f)", fill: "rgba(229, 0, 15, 0.12)" },
  emerald: { stroke: "var(--aui-c-green, #10b981)", fill: "rgba(16, 185, 129, 0.12)" },
  amber: { stroke: "var(--aui-c-amber, #d97706)", fill: "rgba(217, 119, 6, 0.12)" },
  rose: { stroke: "var(--aui-c-red, #dc2626)", fill: "rgba(220, 38, 38, 0.12)" },
  cyan: { stroke: "var(--aui-c-cyan, #0891b2)", fill: "rgba(8, 145, 178, 0.12)" },
};

export function AreaChart({
  data = [],
  categories = [],
  index,
  colors = ["primary", "emerald", "amber"],
  valueFormatter = (val) => String(val),
  height = 240,
  showGrid = true,
  showLegend = true,
  className,
}: AreaChartProps) {
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

  // Padding
  const padLeft = 48;
  const padRight = 16;
  const padTop = 16;
  const padBottom = 28;
  const width = 600; // coordinate space width

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  // Find min and max
  let maxVal = 0;
  for (const row of data) {
    for (const cat of categories) {
      const val = Number(row[cat]) || 0;
      if (val > maxVal) maxVal = val;
    }
  }
  if (maxVal === 0) maxVal = 10;
  // Round maxVal up to pleasant multiple
  maxVal = Math.ceil(maxVal * 1.1);

  const getX = (idx: number) => {
    if (data.length <= 1) return padLeft + chartW / 2;
    return padLeft + (idx / (data.length - 1)) * chartW;
  };

  const getY = (val: number) => {
    return padTop + chartH - (val / maxVal) * chartH;
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const relX = (mouseX / rect.width) * width;

    // Find nearest data point
    let closestIdx = 0;
    let minDiff = Infinity;
    for (let i = 0; i < data.length; i++) {
      const diff = Math.abs(getX(i) - relX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = i;
      }
    }
    setHoverIndex(closestIdx);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  // Generate grid lines
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
                  style={{ backgroundColor: c.stroke }}
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
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Y-axis Gridlines and Labels */}
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

          {/* Area & Line paths */}
          {categories.map((cat, i) => {
            const colorKey = colors[i % colors.length] || "primary";
            const c = COLOR_MAP[colorKey] || COLOR_MAP.primary;

            // Generate points
            const points = data.map((d, idx) => ({
              x: getX(idx),
              y: getY(Number(d[cat]) || 0),
            }));

            if (points.length === 0) return null;

            const lineD = points.reduce(
              (acc, pt, idx) =>
                idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`,
              ""
            );

            const areaD = `${lineD} L ${points[points.length - 1].x} ${
              padTop + chartH
            } L ${points[0].x} ${padTop + chartH} Z`;

            return (
              <g key={cat}>
                <defs>
                  <linearGradient
                    id={`area-grad-${cat}-${i}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={c.stroke} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={c.stroke} stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d={areaD}
                  fill={`url(#area-grad-${cat}-${i})`}
                  className="aui-chart-area-path"
                />
                <path
                  d={lineD}
                  fill="none"
                  stroke={c.stroke}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="aui-chart-line-path"
                />
              </g>
            );
          })}

          {/* X-axis labels */}
          {data.length > 0 && (
            <>
              <text
                x={getX(0)}
                y={height - 8}
                textAnchor="start"
                className="aui-chart-axis-label"
              >
                {String(data[0][index] || "")}
              </text>
              {data.length > 2 && (
                <text
                  x={getX(Math.floor(data.length / 2))}
                  y={height - 8}
                  textAnchor="middle"
                  className="aui-chart-axis-label"
                >
                  {String(data[Math.floor(data.length / 2)][index] || "")}
                </text>
              )}
              <text
                x={getX(data.length - 1)}
                y={height - 8}
                textAnchor="end"
                className="aui-chart-axis-label"
              >
                {String(data[data.length - 1][index] || "")}
              </text>
            </>
          )}

          {/* Hover crosshair & dots */}
          {hoverIndex !== null && data[hoverIndex] && (
            <g>
              <line
                x1={getX(hoverIndex)}
                y1={padTop}
                x2={getX(hoverIndex)}
                y2={padTop + chartH}
                className="aui-chart-crosshair"
              />
              {categories.map((cat, i) => {
                const colorKey = colors[i % colors.length] || "primary";
                const c = COLOR_MAP[colorKey] || COLOR_MAP.primary;
                const ptX = getX(hoverIndex);
                const ptY = getY(Number(data[hoverIndex][cat]) || 0);
                return (
                  <circle
                    key={cat}
                    cx={ptX}
                    cy={ptY}
                    r="4"
                    fill={c.stroke}
                    stroke="var(--aui-bg-primary)"
                    strokeWidth="2"
                  />
                );
              })}
            </g>
          )}
        </svg>

        {/* Hover Tooltip card */}
        {hoverIndex !== null && data[hoverIndex] && (
          <div
            className="aui-chart-tooltip"
            style={{
              left: `${(getX(hoverIndex) / width) * 100}%`,
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
                    style={{ backgroundColor: c.stroke }}
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
