"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface DateRange {
  from?: Date;
  to?: Date;
}

export interface DatePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  className?: string;
}

export interface DateRangePickerProps {
  value?: DateRange;
  onChange: (range: DateRange) => void;
  presets?: Array<{ label: string; range: DateRange }>;
  placeholder?: string;
  className?: string;
}

function formatDate(d?: Date) {
  if (!d) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [viewDate, setViewDate] = React.useState(() => value ? new Date(value) : new Date());
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <button
        type="button"
        className={cn(
          "inline-flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 py-1 font-mono text-xs shadow-xs hover:bg-muted",
          isOpen && "ring-1 ring-ring"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>📅</span>
        <span className={value ? "text-foreground font-semibold" : "text-muted-foreground"}>
          {value ? formatDate(value) : placeholder}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 left-0 z-50 rounded-md border border-border bg-popover p-3 shadow-md animate-in fade-in-0">
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              className="h-6 w-6 rounded border border-border flex items-center justify-center text-xs"
              onClick={() => setViewDate(new Date(year, month - 1, 1))}
            >
              ‹
            </button>
            <span className="font-heading text-xs font-semibold">
              {MONTH_NAMES[month]} {year}
            </span>
            <button
              type="button"
              className="h-6 w-6 rounded border border-border flex items-center justify-center text-xs"
              onClick={() => setViewDate(new Date(year, month + 1, 1))}
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <span key={d} className="text-muted-foreground text-[10px] py-1">{d}</span>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => (
              <span key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected = value && value.getFullYear() === year && value.getMonth() === month && value.getDate() === day;
              return (
                <button
                  key={day}
                  type="button"
                  className={cn(
                    "h-7 w-7 rounded-xs text-xs flex items-center justify-center hover:bg-accent",
                    isSelected && "bg-primary text-white font-bold"
                  )}
                  onClick={() => {
                    onChange(new Date(year, month, day));
                    setIsOpen(false);
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function DateRangePicker({
  value,
  onChange,
  presets,
  placeholder = "Select date range...",
  className,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectingFrom, setSelectingFrom] = React.useState<Date | undefined>(value?.from);
  const [viewDate, setViewDate] = React.useState(() => value?.from ? new Date(value.from) : new Date());
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const handleDayClick = (day: number) => {
    const clicked = new Date(year, month, day);
    if (!selectingFrom || (value?.from && value?.to)) {
      setSelectingFrom(clicked);
      onChange({ from: clicked, to: undefined });
    } else {
      if (clicked < selectingFrom) {
        onChange({ from: clicked, to: selectingFrom });
      } else {
        onChange({ from: selectingFrom, to: clicked });
      }
      setSelectingFrom(undefined);
      setIsOpen(false);
    }
  };

  const displayText = value?.from && value?.to
    ? `${formatDate(value.from)} → ${formatDate(value.to)}`
    : value?.from
    ? `${formatDate(value.from)} → ...`
    : placeholder;

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <button
        type="button"
        className={cn(
          "inline-flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 py-1 font-mono text-xs shadow-xs hover:bg-muted",
          isOpen && "ring-1 ring-ring"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>📅</span>
        <span className={value?.from ? "text-foreground font-semibold" : "text-muted-foreground"}>
          {displayText}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 left-0 z-50 rounded-md border border-border bg-popover p-3 shadow-md animate-in fade-in-0 flex gap-3">
          <div className="flex flex-col gap-1 border-r border-border pr-3">
            {[
              { label: "Today", get: () => ({ from: new Date(), to: new Date() }) },
              { label: "Last 7d", get: () => { const to = new Date(); const from = new Date(); from.setDate(to.getDate() - 7); return { from, to }; } },
              { label: "Last 30d", get: () => { const to = new Date(); const from = new Date(); from.setDate(to.getDate() - 30); return { from, to }; } },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                className="text-left font-mono text-xs px-2 py-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                onClick={() => {
                  onChange(p.get());
                  setIsOpen(false);
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                className="h-6 w-6 rounded border border-border flex items-center justify-center text-xs"
                onClick={() => setViewDate(new Date(year, month - 1, 1))}
              >
                ‹
              </button>
              <span className="font-heading text-xs font-semibold">
                {MONTH_NAMES[month]} {year}
              </span>
              <button
                type="button"
                className="h-6 w-6 rounded border border-border flex items-center justify-center text-xs"
                onClick={() => setViewDate(new Date(year, month + 1, 1))}
              >
                ›
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <span key={d} className="text-muted-foreground text-[10px] py-1">{d}</span>
              ))}
              {Array.from({ length: firstDay }).map((_, i) => (
                <span key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const thisDate = new Date(year, month, day);
                const isFrom = value?.from && formatDate(thisDate) === formatDate(value.from);
                const isTo = value?.to && formatDate(thisDate) === formatDate(value.to);
                const inRange = value?.from && value?.to && thisDate > value.from && thisDate < value.to;

                return (
                  <button
                    key={day}
                    type="button"
                    className={cn(
                      "h-7 w-7 rounded-xs text-xs flex items-center justify-center hover:bg-accent",
                      (isFrom || isTo) && "bg-primary text-white font-bold",
                      inRange && "bg-primary/10 text-primary"
                    )}
                    onClick={() => handleDayClick(day)}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
