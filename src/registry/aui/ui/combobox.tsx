"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ComboboxOption<T = string> {
  value: T;
  label: string;
  description?: string;
  badge?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface ComboboxProps<T = string> {
  options: ComboboxOption<T>[];
  value?: T;
  onChange: (value: T) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  loading?: boolean;
  disabled?: boolean;
  onSearchChange?: (query: string) => void;
  renderOption?: (option: ComboboxOption<T>) => React.ReactNode;
  className?: string;
}

export function Combobox<T = string>({
  options = [],
  value,
  onChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyText = "No options found",
  loading = false,
  disabled = false,
  onSearchChange,
  renderOption,
  className,
}: ComboboxProps<T>) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [highlightedIndex, setHighlightedIndex] = React.useState(0);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const selectedOption = React.useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  );

  const filteredOptions = React.useMemo(() => {
    if (onSearchChange) return options;
    if (!search.trim()) return options;
    const q = search.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        (opt.description && opt.description.toLowerCase().includes(q)) ||
        (opt.badge && opt.badge.toLowerCase().includes(q))
    );
  }, [options, search, onSearchChange]);

  React.useEffect(() => {
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

  React.useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(0);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setSearch("");
    }
  }, [isOpen]);

  const handleSelect = (option: ComboboxOption<T>) => {
    if (option.disabled) return;
    onChange(option.value);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredOptions[highlightedIndex]) {
        handleSelect(filteredOptions[highlightedIndex]);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full", className)}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-left",
          isOpen && "ring-1 ring-ring border-primary"
        )}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        disabled={disabled}
      >
        <span className="truncate">
          {selectedOption ? (
            <span className="inline-flex items-center gap-2">
              {selectedOption.icon}
              <span className="font-medium text-foreground">{selectedOption.label}</span>
              {selectedOption.badge && (
                <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                  {selectedOption.badge}
                </span>
              )}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </span>
        <svg
          className={cn("h-4 w-4 shrink-0 opacity-50 transition-transform", isOpen && "rotate-180")}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 rounded-md border border-border bg-popover text-popover-foreground shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-95">
          <div className="flex items-center px-3 border-b border-border bg-muted/30">
            <svg
              className="mr-2 h-4 w-4 shrink-0 opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              className="flex h-9 w-full bg-transparent py-2 text-sm outline-hidden placeholder:text-muted-foreground"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setHighlightedIndex(0);
                onSearchChange?.(e.target.value);
              }}
            />
          </div>

          <ul className="max-h-[280px] overflow-y-auto p-1 text-sm">
            {loading ? (
              <li className="py-6 text-center text-xs text-muted-foreground">Loading...</li>
            ) : filteredOptions.length === 0 ? (
              <li className="py-6 text-center text-xs text-muted-foreground">{emptyText}</li>
            ) : (
              filteredOptions.map((opt, idx) => {
                const isSelected = opt.value === value;
                const isHighlighted = idx === highlightedIndex;

                return (
                  <li
                    key={String(opt.value)}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors",
                      isHighlighted && "bg-accent text-accent-foreground",
                      isSelected && "font-semibold",
                      opt.disabled && "pointer-events-none opacity-50"
                    )}
                    onClick={() => handleSelect(opt)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                  >
                    {renderOption ? (
                      renderOption(opt)
                    ) : (
                      <>
                        {opt.icon && <span className="mr-2 shrink-0">{opt.icon}</span>}
                        <div className="flex flex-col flex-1">
                          <span>{opt.label}</span>
                          {opt.description && (
                            <span className="text-xs text-muted-foreground font-normal">
                              {opt.description}
                            </span>
                          )}
                        </div>
                        {opt.badge && (
                          <span className="ml-2 font-mono text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                            {opt.badge}
                          </span>
                        )}
                        {isSelected && (
                          <span className="ml-auto text-primary">✓</span>
                        )}
                      </>
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
