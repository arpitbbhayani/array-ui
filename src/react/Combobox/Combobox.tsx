"use client";

import React, { useState, useRef, useEffect, useId, useMemo } from "react";
import { cn } from "../../utils/cn";
import { SearchIcon, CheckIcon, ChevronDownIcon } from "../Icons";

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
  id?: string;
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
  id,
}: ComboboxProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const generatedId = useId();
  const comboboxId = id || `aui-combobox-${generatedId}`;

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  );

  const filteredOptions = useMemo(() => {
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

  // Click outside listener
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

  // Focus search input on open
  useEffect(() => {
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

  // Keep highlighted item in view
  useEffect(() => {
    if (!isOpen || !listRef.current) return;
    const items = listRef.current.querySelectorAll<HTMLLIElement>(".aui-combobox-item");
    const activeItem = items[highlightedIndex];
    if (activeItem) {
      activeItem.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, isOpen]);

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

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    setSearch(nextVal);
    setHighlightedIndex(0);
    onSearchChange?.(nextVal);
  };

  return (
    <div
      ref={containerRef}
      className={cn("aui-combobox", className)}
      id={comboboxId}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        className={cn(
          "aui-combobox-trigger",
          isOpen && "is-open",
          disabled && "is-disabled"
        )}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="aui-combobox-trigger-label">
          {selectedOption ? (
            <span className="aui-combobox-selected-content">
              {selectedOption.icon && (
                <span className="aui-combobox-opt-icon">
                  {selectedOption.icon}
                </span>
              )}
              <span className="aui-combobox-text">{selectedOption.label}</span>
              {selectedOption.badge && (
                <span className="aui-combobox-opt-badge">
                  {selectedOption.badge}
                </span>
              )}
            </span>
          ) : (
            <span className="aui-combobox-placeholder">{placeholder}</span>
          )}
        </span>
        <ChevronDownIcon
          size={14}
          className={cn("aui-combobox-chevron", isOpen && "is-rotated")}
        />
      </button>

      {isOpen && (
        <div className="aui-combobox-popover" role="dialog">
          <div className="aui-combobox-search-box">
            <SearchIcon size={14} className="aui-combobox-search-icon" />
            <input
              ref={inputRef}
              type="text"
              className="aui-combobox-search-input"
              placeholder={searchPlaceholder}
              value={search}
              onChange={handleSearchInput}
            />
          </div>

          <ul
            ref={listRef}
            className="aui-combobox-list"
            role="listbox"
            tabIndex={-1}
          >
            {loading ? (
              <li className="aui-combobox-loading">
                <span className="aui-combobox-spinner" />
                <span>Loading...</span>
              </li>
            ) : filteredOptions.length === 0 ? (
              <li className="aui-combobox-empty">{emptyText}</li>
            ) : (
              filteredOptions.map((opt, idx) => {
                const isSelected = opt.value === value;
                const isHighlighted = idx === highlightedIndex;

                return (
                  <li
                    key={String(opt.value)}
                    className={cn(
                      "aui-combobox-item",
                      isSelected && "is-selected",
                      isHighlighted && "is-highlighted",
                      opt.disabled && "is-disabled"
                    )}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                  >
                    {renderOption ? (
                      renderOption(opt)
                    ) : (
                      <>
                        {opt.icon && (
                          <span className="aui-combobox-opt-icon">
                            {opt.icon}
                          </span>
                        )}
                        <div className="aui-combobox-opt-info">
                          <span className="aui-combobox-opt-label">
                            {opt.label}
                          </span>
                          {opt.description && (
                            <span className="aui-combobox-opt-desc">
                              {opt.description}
                            </span>
                          )}
                        </div>
                        {opt.badge && (
                          <span className="aui-combobox-opt-badge">
                            {opt.badge}
                          </span>
                        )}
                        {isSelected && (
                          <CheckIcon
                            size={14}
                            className="aui-combobox-check"
                          />
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
