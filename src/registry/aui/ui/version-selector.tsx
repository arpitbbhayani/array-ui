"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface VersionOption {
  label: string;
  value: string;
  badge?: string;
}

export interface VersionSelectorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  label?: string;
  versions: VersionOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (val: string) => void;
  name?: string;
  disabled?: boolean;
}

export function VersionSelector({
  label = "Version:",
  versions,
  value: controlledValue,
  defaultValue,
  onChange,
  name,
  disabled = false,
  className,
  ...props
}: VersionSelectorProps) {
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string>(
    defaultValue ?? versions[0]?.value ?? ""
  );
  const selectedValue = isControlled ? controlledValue : uncontrolledValue;
  const [isOpen, setIsOpen] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState(0);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  const safeVersions = React.useMemo(() => versions || [], [versions]);
  const selectedOption = React.useMemo(
    () => safeVersions.find((v) => v.value === selectedValue) || safeVersions[0],
    [safeVersions, selectedValue]
  );

  React.useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen || !listRef.current) return;
    const items = listRef.current.querySelectorAll<HTMLLIElement>("li");
    const activeItem = items[highlightedIndex];
    if (activeItem) {
      activeItem.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, isOpen]);

  React.useEffect(() => {
    if (isOpen) {
      const idx = safeVersions.findIndex((v) => v.value === selectedValue);
      setHighlightedIndex(idx >= 0 ? idx : 0);
    }
  }, [isOpen, safeVersions, selectedValue]);

  const handleSelect = (option: VersionOption) => {
    if (!isControlled) {
      setUncontrolledValue(option.value);
    }
    onChange?.(option.value);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

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
      setHighlightedIndex((prev) => (prev < safeVersions.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (safeVersions[highlightedIndex]) {
        handleSelect(safeVersions[highlightedIndex]);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn("inline-flex items-center gap-2 relative", className)}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {label && (
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground select-none">
          {label}
        </span>
      )}
      <div className="relative inline-block">
        {name && <input type="hidden" name={name} value={selectedValue} />}
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1.5 font-mono text-xs font-semibold px-2.5 py-1.5 rounded border border-border bg-card text-foreground cursor-pointer transition-colors hover:bg-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/40 select-none",
            isOpen && "border-primary ring-2 ring-primary/40",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span>{selectedOption ? selectedOption.label : "Select..."}</span>
          {selectedOption?.badge && (
            <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-1 py-0.5 rounded border border-border bg-muted text-muted-foreground leading-none">
              {selectedOption.badge}
            </span>
          )}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("shrink-0 text-muted-foreground transition-transform duration-150", isOpen && "rotate-180 text-foreground")}
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {isOpen && (
          <div
            className="absolute top-[calc(100%+4px)] left-0 min-w-full w-max z-50 bg-card border border-border rounded-md shadow-lg py-1 animate-in fade-in-0 zoom-in-95"
            role="dialog"
          >
            <ul
              ref={listRef}
              className="list-none m-0 p-0 max-h-60 overflow-y-auto"
              role="listbox"
              tabIndex={-1}
            >
              {safeVersions.map((ver, idx) => {
                const isSelected = ver.value === selectedValue;
                const isHighlighted = idx === highlightedIndex;

                return (
                  <li
                    key={ver.value}
                    className={cn(
                      "flex items-center justify-between gap-3.5 px-2.5 py-1.5 font-mono text-xs cursor-pointer transition-colors text-foreground",
                      (isHighlighted || isSelected) && "bg-muted/70 text-foreground",
                      isSelected && "font-semibold"
                    )}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(ver)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                  >
                    <span>{ver.label}</span>
                    <div className="inline-flex items-center gap-1.5">
                      {ver.badge && (
                        <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-1 py-0.5 rounded border border-border bg-muted text-muted-foreground leading-none">
                          {ver.badge}
                        </span>
                      )}
                      {isSelected && (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-primary shrink-0"
                          aria-hidden="true"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
