"use client";

import React, { useState, useRef, useEffect, useId, useMemo } from "react";
import { cn } from "../../utils/cn";
import { CheckIcon, ChevronDownIcon } from "../Icons";

export interface SelectOption<T = string> {
  value: T;
  label: string;
  description?: string;
  badge?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SelectProps<T = string> {
  options?: SelectOption<T>[];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  name?: string;
  className?: string;
  id?: string;
  children?: React.ReactNode;
}

export function Select<T = string>({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder = "Select an option...",
  label,
  error,
  helperText,
  disabled = false,
  name,
  className,
  id,
  children,
}: SelectProps<T>) {
  const generatedId = useId();
  const selectId = id || (label ? `aui-select-${generatedId}` : undefined);

  // If children (native options) are provided and no options array:
  // Render native select for backwards compatibility, styled with .aui-select
  if (!options && children) {
    const nativeSelect = (
      <select
        id={selectId}
        name={name}
        defaultValue={defaultValue as any}
        value={controlledValue as any}
        onChange={(e) => onChange?.(e.target.value as any)}
        disabled={disabled}
        className={cn("aui-select", error && "is-error", className)}
      >
        {children}
      </select>
    );

    if (!label && !error && !helperText) {
      return nativeSelect;
    }

    return (
      <div className="aui-form-group">
        {label && (
          <label htmlFor={selectId} className="aui-label">
            {label}
          </label>
        )}
        {nativeSelect}
        {helperText && !error && <p className="aui-helper-text">{helperText}</p>}
        {error && <p className="aui-error-text">{error}</p>}
      </div>
    );
  }

  // Custom Dropdown Single Select Mode
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<T | undefined>(defaultValue);
  const selectedValue = isControlled ? controlledValue : uncontrolledValue;
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const safeOptions = useMemo(() => options || [], [options]);

  const selectedOption = useMemo(
    () => safeOptions.find((opt) => opt.value === selectedValue),
    [safeOptions, selectedValue]
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
    const items = listRef.current.querySelectorAll<HTMLLIElement>(".aui-select-item");
    const activeItem = items[highlightedIndex];
    if (activeItem) {
      activeItem.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, isOpen]);

  // Set initial highlight to selected option when opened
  useEffect(() => {
    if (isOpen) {
      const idx = safeOptions.findIndex((opt) => opt.value === selectedValue);
      setHighlightedIndex(idx >= 0 ? idx : 0);
    }
  }, [isOpen, safeOptions, selectedValue]);

  const handleSelect = (option: SelectOption<T>) => {
    if (option.disabled) return;
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
      setHighlightedIndex((prev) => (prev < safeOptions.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (safeOptions[highlightedIndex]) {
        handleSelect(safeOptions[highlightedIndex]);
      }
    }
  };

  const selectTrigger = (
    <div
      ref={containerRef}
      className={cn("aui-select-wrapper", className)}
      onKeyDown={handleKeyDown}
    >
      {name && (
        <input
          type="hidden"
          name={name}
          value={selectedValue !== undefined ? String(selectedValue) : ""}
        />
      )}
      <button
        type="button"
        id={selectId}
        className={cn(
          "aui-select-trigger",
          isOpen && "is-open",
          disabled && "is-disabled",
          error && "is-error"
        )}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="aui-select-trigger-label">
          {selectedOption ? (
            <span className="aui-select-selected-content">
              {selectedOption.icon && (
                <span className="aui-select-opt-icon">{selectedOption.icon}</span>
              )}
              <span className="aui-select-text">{selectedOption.label}</span>
              {selectedOption.badge && (
                <span className="aui-select-opt-badge">{selectedOption.badge}</span>
              )}
            </span>
          ) : (
            <span className="aui-select-placeholder">{placeholder}</span>
          )}
        </span>
        <ChevronDownIcon
          size={14}
          className={cn("aui-select-chevron", isOpen && "is-rotated")}
        />
      </button>

      {isOpen && (
        <div className="aui-select-popover" role="dialog">
          <ul
            ref={listRef}
            className="aui-select-list"
            role="listbox"
            tabIndex={-1}
          >
            {safeOptions.length === 0 ? (
              <li className="aui-select-empty">No options available</li>
            ) : (
              safeOptions.map((opt, idx) => {
                const isSelected = opt.value === selectedValue;
                const isHighlighted = idx === highlightedIndex;

                return (
                  <li
                    key={String(opt.value)}
                    className={cn(
                      "aui-select-item",
                      isSelected && "is-selected",
                      isHighlighted && "is-highlighted",
                      opt.disabled && "is-disabled"
                    )}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                  >
                    <div className="aui-select-item-main">
                      {opt.icon && (
                        <span className="aui-select-opt-icon">{opt.icon}</span>
                      )}
                      <div className="aui-select-opt-info">
                        <span className="aui-select-opt-label">{opt.label}</span>
                        {opt.description && (
                          <span className="aui-select-opt-desc">{opt.description}</span>
                        )}
                      </div>
                    </div>
                    <div className="aui-select-item-meta">
                      {opt.badge && (
                        <span className="aui-select-opt-badge">{opt.badge}</span>
                      )}
                      {isSelected && (
                        <CheckIcon size={14} className="aui-select-check" />
                      )}
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );

  if (!label && !error && !helperText) {
    return selectTrigger;
  }

  return (
    <div className="aui-form-group">
      {label && (
        <label htmlFor={selectId} className="aui-label">
          {label}
        </label>
      )}
      {selectTrigger}
      {helperText && !error && <p className="aui-helper-text">{helperText}</p>}
      {error && <p className="aui-error-text">{error}</p>}
    </div>
  );
}

Select.displayName = "Select";
