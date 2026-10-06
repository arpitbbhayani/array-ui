"use client";

import React, { useState, useRef, useEffect } from "react";
import { CalendarIcon, ChevronDownIcon } from "../Icons";
import { formatDate } from "./DatePicker";
import { cn } from "../../utils/cn";

export interface DateRange {
  from?: Date;
  to?: Date;
}

export interface DateRangePickerProps {
  value?: DateRange;
  onChange: (range: DateRange) => void;
  presets?: Array<{ label: string; range: DateRange }>;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function isSameDay(d1?: Date, d2?: Date): boolean {
  if (!d1 || !d2) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function isDayInRange(d: Date, from?: Date, to?: Date): boolean {
  if (!from || !to) return false;
  const time = d.getTime();
  const startTime = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime();
  const endTime = new Date(to.getFullYear(), to.getMonth(), to.getDate()).getTime();
  return time > startTime && time < endTime;
}

const DEFAULT_PRESETS: Array<{ label: string; range: () => DateRange }> = [
  {
    label: "Today",
    range: () => {
      const now = new Date();
      return { from: now, to: now };
    },
  },
  {
    label: "Last 7d",
    range: () => {
      const to = new Date();
      const from = new Date();
      from.setDate(to.getDate() - 7);
      return { from, to };
    },
  },
  {
    label: "Last 30d",
    range: () => {
      const to = new Date();
      const from = new Date();
      from.setDate(to.getDate() - 30);
      return { from, to };
    },
  },
  {
    label: "Month to Date",
    range: () => {
      const to = new Date();
      const from = new Date(to.getFullYear(), to.getMonth(), 1);
      return { from, to };
    },
  },
];

export function DateRangePicker({
  value,
  onChange,
  presets,
  placeholder = "Select date range...",
  className,
  disabled = false,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() =>
    value?.from ? new Date(value.from) : new Date()
  );
  const [selectingFrom, setSelectingFrom] = useState<Date | undefined>(
    value?.from
  );

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value?.from) {
      setViewDate(new Date(value.from));
      setSelectingFrom(value.from);
    }
  }, [value]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const handleDayClick = (dayNum: number) => {
    const clickedDate = new Date(year, month, dayNum);

    if (!selectingFrom || (value?.from && value?.to)) {
      // First click
      setSelectingFrom(clickedDate);
      onChange({ from: clickedDate, to: undefined });
    } else {
      // Second click
      if (clickedDate.getTime() < selectingFrom.getTime()) {
        onChange({ from: clickedDate, to: selectingFrom });
      } else {
        onChange({ from: selectingFrom, to: clickedDate });
      }
      setSelectingFrom(undefined);
      setIsOpen(false);
    }
  };

  const handleApplyPreset = (range: DateRange) => {
    onChange(range);
    if (range.from) setViewDate(new Date(range.from));
    setSelectingFrom(undefined);
    setIsOpen(false);
  };

  const displayText =
    value?.from && value?.to
      ? `${formatDate(value.from)} → ${formatDate(value.to)}`
      : value?.from
      ? `${formatDate(value.from)} → ...`
      : placeholder;

  return (
    <div
      ref={containerRef}
      className={cn("aui-datepicker-container", className)}
    >
      <button
        type="button"
        className={cn(
          "aui-datepicker-trigger",
          isOpen && "is-open",
          disabled && "is-disabled"
        )}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        disabled={disabled}
      >
        <CalendarIcon size={15} className="aui-datepicker-icon" />
        <span className="aui-datepicker-trigger-text">
          {value?.from ? (
            <span className="aui-datepicker-mono-date">{displayText}</span>
          ) : (
            <span className="aui-datepicker-placeholder">{placeholder}</span>
          )}
        </span>
        <ChevronDownIcon
          size={14}
          className={cn("aui-datepicker-chevron", isOpen && "is-rotated")}
        />
      </button>

      {isOpen && (
        <div className="aui-datepicker-dropdown aui-datepicker-range-dropdown" role="dialog">
          <div className="aui-datepicker-presets">
            {(presets || DEFAULT_PRESETS.map((p) => ({ label: p.label, range: p.range() }))).map((preset) => (
              <button
                key={preset.label}
                type="button"
                className="aui-datepicker-preset-btn"
                onClick={() => handleApplyPreset(preset.range)}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="aui-datepicker-calendar">
            <div className="aui-datepicker-header">
              <button
                type="button"
                className="aui-datepicker-nav-btn"
                onClick={prevMonth}
                aria-label="Previous month"
              >
                ‹
              </button>
              <span className="aui-datepicker-month-title">
                {MONTH_NAMES[month]} {year}
              </span>
              <button
                type="button"
                className="aui-datepicker-nav-btn"
                onClick={nextMonth}
                aria-label="Next month"
              >
                ›
              </button>
            </div>

            <div className="aui-datepicker-weekdays">
              {DAY_NAMES.map((d) => (
                <span key={d} className="aui-datepicker-weekday">
                  {d}
                </span>
              ))}
            </div>

            <div className="aui-datepicker-grid">
              {/* Previous month padding days */}
              {Array.from({ length: firstDayIndex }, (_, i) => {
                const prevDay = daysInPrevMonth - firstDayIndex + i + 1;
                return (
                  <span
                    key={`prev-${i}`}
                    className="aui-datepicker-day is-outside"
                  >
                    {prevDay}
                  </span>
                );
              })}

              {/* Current month days */}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const dayNum = i + 1;
                const thisDate = new Date(year, month, dayNum);

                const isFrom = isSameDay(thisDate, value?.from || selectingFrom);
                const isTo = isSameDay(thisDate, value?.to);
                const inRange = isDayInRange(thisDate, value?.from || selectingFrom, value?.to);

                return (
                  <button
                    key={dayNum}
                    type="button"
                    className={cn(
                      "aui-datepicker-day",
                      (isFrom || isTo) && "is-selected",
                      inRange && "in-range"
                    )}
                    onClick={() => handleDayClick(dayNum)}
                  >
                    {dayNum}
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
