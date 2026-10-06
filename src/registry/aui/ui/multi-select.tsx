"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
  value: string;
  label: string;
  group?: string;
  description?: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  maxDisplayedBadges?: number;
  className?: string;
}

export function MultiSelect({
  options = [],
  selected = [],
  onChange,
  placeholder = "Select options...",
  label,
  error,
  maxDisplayedBadges = 3,
  className,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

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

  const filteredOptions = React.useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        (opt.description && opt.description.toLowerCase().includes(q))
    );
  }, [options, search]);

  const toggleOption = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter((item) => item !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  const removeBadge = (e: React.MouseEvent, val: string) => {
    e.stopPropagation();
    onChange(selected.filter((item) => item !== val));
  };

  const visibleSelected = selected.slice(0, maxDisplayedBadges);
  const remainingCount = selected.length - maxDisplayedBadges;

  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)} ref={containerRef}>
      {label && <label className="text-xs font-medium text-foreground">{label}</label>}

      <div
        className={cn(
          "relative min-h-[38px] w-full flex items-center justify-between rounded-md border border-input bg-background p-1.5 text-sm shadow-xs cursor-pointer transition-colors",
          isOpen && "ring-1 ring-ring border-primary",
          error && "border-destructive"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1 flex-1 items-center">
          {selected.length === 0 ? (
            <span className="text-muted-foreground px-1">{placeholder}</span>
          ) : (
            <>
              {visibleSelected.map((val) => {
                const opt = options.find((o) => o.value === val);
                const itemLabel = opt ? opt.label : val;
                return (
                  <span
                    key={val}
                    className="inline-flex items-center gap-1 font-mono text-xs px-2 py-0.5 rounded border border-border bg-muted text-foreground"
                  >
                    <span>{itemLabel}</span>
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground leading-none"
                      onClick={(e) => removeBadge(e, val)}
                    >
                      ×
                    </button>
                  </span>
                );
              })}
              {remainingCount > 0 && (
                <span className="font-mono text-xs px-1.5 py-0.5 rounded border border-border text-muted-foreground">
                  +{remainingCount}
                </span>
              )}
            </>
          )}
        </div>

        <span className="text-muted-foreground px-1">▾</span>
      </div>

      {isOpen && (
        <div className="relative">
          <div className="absolute top-1 left-0 right-0 z-50 rounded-md border border-border bg-popover text-popover-foreground shadow-lg overflow-hidden animate-in fade-in-0">
            <div className="p-2 border-b border-border bg-muted/30">
              <input
                ref={inputRef}
                type="text"
                className="w-full bg-transparent text-sm outline-hidden placeholder:text-muted-foreground"
                placeholder="Filter tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <div className="flex justify-end gap-2 p-1 border-b border-border bg-muted/10 font-mono text-xs">
              <button
                type="button"
                className="px-2 py-0.5 text-muted-foreground hover:text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(Array.from(new Set([...selected, ...filteredOptions.map((o) => o.value)])));
                }}
              >
                Select All
              </button>
              <button
                type="button"
                className="px-2 py-0.5 text-muted-foreground hover:text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange([]);
                }}
              >
                Clear All
              </button>
            </div>

            <ul className="max-h-[220px] overflow-y-auto p-1 text-sm">
              {filteredOptions.length === 0 ? (
                <li className="p-4 text-center text-xs text-muted-foreground">No options found</li>
              ) : (
                filteredOptions.map((opt) => {
                  const isChecked = selected.includes(opt.value);
                  return (
                    <li
                      key={opt.value}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-accent",
                        isChecked && "font-medium"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleOption(opt.value);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="h-3.5 w-3.5 accent-primary"
                      />
                      <span className="flex-1">{opt.label}</span>
                      {opt.group && (
                        <span className="font-mono text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          {opt.group}
                        </span>
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export const TagInput = MultiSelect;
