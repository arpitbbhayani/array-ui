"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { cn } from "../../utils/cn";
import { ChevronDownIcon, CheckIcon } from "../Icons";

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

export const VersionSelector = React.forwardRef<HTMLDivElement, VersionSelectorProps>(
  (
    {
      label = "Version:",
      versions,
      value: controlledValue,
      defaultValue,
      onChange,
      name,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState<string>(
      defaultValue ?? versions[0]?.value ?? ""
    );
    const selectedValue = isControlled ? controlledValue : uncontrolledValue;
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);

    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    const safeVersions = useMemo(() => versions || [], [versions]);
    const selectedOption = useMemo(
      () => safeVersions.find((v) => v.value === selectedValue) || safeVersions[0],
      [safeVersions, selectedValue]
    );

    // Outside click listener
    useEffect(() => {
      if (!isOpen) return;
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    // Keep highlighted item in view
    useEffect(() => {
      if (!isOpen || !listRef.current) return;
      const items = listRef.current.querySelectorAll<HTMLLIElement>(".aui-version-item");
      const activeItem = items[highlightedIndex];
      if (activeItem) {
        activeItem.scrollIntoView({ block: "nearest" });
      }
    }, [highlightedIndex, isOpen]);

    // Set initial highlight to selected option when opened
    useEffect(() => {
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
        ref={(node) => {
          (containerRef as any).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as any).current = node;
        }}
        className={cn("aui-version-selector", className)}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {label && <span className="aui-version-label">{label}</span>}
        <div className="aui-version-wrapper">
          {name && <input type="hidden" name={name} value={selectedValue} />}
          <button
            type="button"
            className={cn(
              "aui-version-trigger",
              isOpen && "is-open",
              disabled && "is-disabled"
            )}
            onClick={() => !disabled && setIsOpen((prev) => !prev)}
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <span className="aui-version-trigger-label">
              {selectedOption ? selectedOption.label : "Select..."}
            </span>
            {selectedOption?.badge && (
              <span className="aui-version-badge">{selectedOption.badge}</span>
            )}
            <ChevronDownIcon
              size={12}
              className={cn("aui-version-chevron", isOpen && "is-rotated")}
            />
          </button>

          {isOpen && (
            <div className="aui-version-popover" role="dialog">
              <ul
                ref={listRef}
                className="aui-version-list"
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
                        "aui-version-item",
                        isSelected && "is-selected",
                        isHighlighted && "is-highlighted"
                      )}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(ver)}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                    >
                      <span className="aui-version-item-label">{ver.label}</span>
                      <div className="aui-version-item-meta">
                        {ver.badge && (
                          <span className="aui-version-badge">{ver.badge}</span>
                        )}
                        {isSelected && (
                          <CheckIcon size={12} className="aui-version-check" />
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
);

VersionSelector.displayName = "VersionSelector";
