"use client";

import React, { useState, useRef, useEffect } from "react";
import { CalendarIcon, ChevronDownIcon } from "../Icons";
import { cn } from "../../utils/cn";

export interface DatePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function formatDate(d: Date | undefined): string {
  if (!d || isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date...",
  className,
  disabled = false,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => value ? new Date(value) : new Date());

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setViewDate(new Date(value));
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

  const handleSelectDay = (dayNum: number) => {
    const selected = new Date(year, month, dayNum);
    onChange(selected);
    setIsOpen(false);
  };

  const isSelected = (dayNum: number) => {
    if (!value) return false;
    return (
      value.getFullYear() === year &&
      value.getMonth() === month &&
      value.getDate() === dayNum
    );
  };

  const isToday = (dayNum: number) => {
    const today = new Date();
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === dayNum
    );
  };

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
          {value ? (
            <span className="aui-datepicker-mono-date">
              {formatDate(value)}
            </span>
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
        <div className="aui-datepicker-dropdown" role="dialog">
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
                const selected = isSelected(dayNum);
                const today = isToday(dayNum);

                return (
                  <button
                    key={dayNum}
                    type="button"
                    className={cn(
                      "aui-datepicker-day",
                      selected && "is-selected",
                      today && "is-today"
                    )}
                    onClick={() => handleSelectDay(dayNum)}
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
