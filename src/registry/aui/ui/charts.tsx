"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

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

export interface SparklineProps {
  data: number[];
  color?: "primary" | "emerald" | "amber" | "rose" | "cyan";
  height?: number;
  width?: number;
  className?: string;
}

const COLOR_MAP: Record<string, { stroke: string; fill: string }> = {
  primary: { stroke: "var(--primary, #e5000f)", fill: "rgba(229, 0, 15, 0.12)" },
  emerald: { stroke: "#10b981", fill: "rgba(16, 185, 129, 0.12)" },
  amber: { stroke: "#d97706", fill: "rgba(217, 119, 6, 0.12)" },
  rose: { stroke: "#dc2626", fill: "rgba(220, 38, 38, 0.12)" },
  cyan: { stroke: "#0891b2", fill: "rgba(8, 145, 178, 0.12)" },
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
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);

  if (!data || data.length === 0) {
    return (
      <div
        className={cn("flex items-center justify-center border border-dashed border-border rounded-lg text-xs text-muted-foreground", className)}
        style={{ height }}
      >
        No telemetry data
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
  maxVal = Math.ceil(maxVal * 1.1);

  const getX = (idx: number) => {
    if (data.length <= 1) return padLeft + chartW / 2;
    return padLeft + (idx / (data.length - 1)) * chartW;
  };

  const getY = (val: number) => {
    return padTop + chartH - (val / maxVal) * chartH;
  };

  const gridSteps = 4;
  const yTicks = Array.from({ length: gridSteps + 1 }, (_, i) => {
    const val = (maxVal / gridSteps) * (gridSteps - i);
    return { val, y: padTop + (i / gridSteps) * chartH };
  });

  return (
    <div className={cn("flex flex-col w-full", className)}>
      {showLegend && (
        <div className="flex items-center gap-4 mb-2 font-mono text-xs">
          {categories.map((cat, i) => {
            const colorKey = colors[i % colors.length] || "primary";
            const c = COLOR_MAP[colorKey] || COLOR_MAP.primary;
            return (
              <div key={cat} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.stroke }} />
                <span className="text-muted-foreground">{cat}</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="relative w-full" style={{ height }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible"
          onMouseMove={(e) => {
            if (!svgRef.current) return;
            const rect = svgRef.current.getBoundingClientRect();
            const relX = ((e.clientX - rect.left) / rect.width) * width;
            let closest = 0;
            let minDiff = Infinity;
            for (let i = 0; i < data.length; i++) {
              const diff = Math.abs(getX(i) - relX);
              if (diff < minDiff) {
                minDiff = diff;
                closest = i;
              }
            }
            setHoverIndex(closest);
          }}
          onMouseLeave={() => setHoverIndex(null)}
        >
          {showGrid &&
            yTicks.map((tick, i) => (
              <g key={i}>
                <line
                  x1={padLeft}
                  y1={tick.y}
                  x2={width - padRight}
                  y2={tick.y}
                  stroke="currentColor"
                  className="text-border"
                  strokeDasharray="3 3"
                />
                <text
                  x={padLeft - 8}
                  y={tick.y + 4}
                  textAnchor="end"
                  className="font-mono text-[9px] fill-muted-foreground"
                >
                  {valueFormatter(Math.round(tick.val))}
                </text>
              </g>
            ))}

          {categories.map((cat, i) => {
            const colorKey = colors[i % colors.length] || "primary";
            const c = COLOR_MAP[colorKey] || COLOR_MAP.primary;
            const points = data.map((d, idx) => ({
              x: getX(idx),
              y: getY(Number(d[cat]) || 0),
            }));

            if (points.length === 0) return null;

            const lineD = points.reduce(
              (acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
              ""
            );
            const areaD = `${lineD} L ${points[points.length - 1].x} ${padTop + chartH} L ${points[0].x} ${padTop + chartH} Z`;

            return (
              <g key={cat}>
                <defs>
                  <linearGradient id={`reg-grad-${cat}-${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={c.stroke} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={c.stroke} stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d={areaD} fill={`url(#reg-grad-${cat}-${i})`} />
                <path d={lineD} fill="none" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" />
              </g>
            );
          })}

          {data.length > 0 && (
            <>
              <text x={getX(0)} y={height - 8} textAnchor="start" className="font-mono text-[9px] fill-muted-foreground">
                {String(data[0][index] || "")}
              </text>
              <text x={getX(data.length - 1)} y={height - 8} textAnchor="end" className="font-mono text-[9px] fill-muted-foreground">
                {String(data[data.length - 1][index] || "")}
              </text>
            </>
          )}

          {hoverIndex !== null && data[hoverIndex] && (
            <g>
              <line
                x1={getX(hoverIndex)}
                y1={padTop}
                x2={getX(hoverIndex)}
                y2={padTop + chartH}
                stroke="currentColor"
                className="text-border"
                strokeDasharray="2 2"
              />
            </g>
          )}
        </svg>

        {hoverIndex !== null && data[hoverIndex] && (
          <div
            className="absolute top-2 z-20 pointer-events-none rounded-md border border-border bg-popover p-2 text-xs shadow-md"
            style={{
              left: `${(getX(hoverIndex) / width) * 100}%`,
              transform: hoverIndex > data.length / 2 ? "translate(-105%, 10%)" : "translate(10%, 10%)",
            }}
          >
            <div className="font-mono font-semibold text-muted-foreground border-b border-border pb-1 mb-1">
              {String(data[hoverIndex][index] || "")}
            </div>
            {categories.map((cat, i) => {
              const colorKey = colors[i % colors.length] || "primary";
              const c = COLOR_MAP[colorKey] || COLOR_MAP.primary;
              return (
                <div key={cat} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c.stroke }} />
                  <span className="text-foreground">{cat}:</span>
                  <span className="font-mono font-bold text-foreground">
                    {valueFormatter(Number(data[hoverIndex][cat]) || 0)}
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
  if (!data || data.length === 0) {
    return (
      <div
        className={cn("flex items-center justify-center border border-dashed border-border rounded-lg text-xs text-muted-foreground", className)}
        style={{ height }}
      >
        No telemetry data
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

  const getY = (val: number) => padTop + chartH - (val / maxVal) * chartH;

  return (
    <div className={cn("flex flex-col w-full", className)}>
      {showLegend && (
        <div className="flex items-center gap-4 mb-2 font-mono text-xs">
          {categories.map((cat, i) => {
            const colorKey = colors[i % colors.length] || "primary";
            const c = COLOR_MAP[colorKey] || COLOR_MAP.primary;
            return (
              <div key={cat} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.stroke }} />
                <span className="text-muted-foreground">{cat}</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="relative w-full" style={{ height }}>
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-full overflow-visible">
          {data.map((row, groupIdx) => {
            const groupX = padLeft + groupIdx * groupWidth + (groupWidth * barPadding) / 2;
            return (
              <g key={groupIdx}>
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
                      fill={c.stroke}
                      rx="1"
                    />
                  );
                })}
                <text x={groupX + availableBarWidth / 2} y={height - 8} textAnchor="middle" className="font-mono text-[9px] fill-muted-foreground">
                  {String(row[index] || "")}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export function Sparkline({
  data = [],
  color = "primary",
  height = 32,
  width = 96,
  className,
}: SparklineProps) {
  if (!data || data.length < 2) return null;

  const strokeColor = COLOR_MAP[color]?.stroke || COLOR_MAP.primary.stroke;
  const padding = 2;
  const drawW = width - padding * 2;
  const drawH = height - padding * 2;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((val, idx) => ({
    x: padding + (idx / (data.length - 1)) * drawW,
    y: padding + drawH - ((val - min) / range) * drawH,
  }));

  const lineD = points.reduce((acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`), "");
  const lastPt = points[points.length - 1];

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={cn("overflow-visible inline-block", className)}>
      <path d={lineD} fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastPt.x} cy={lastPt.y} r="2.5" fill={strokeColor} />
    </svg>
  );
}
