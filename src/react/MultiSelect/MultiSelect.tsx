"use client";

import React, { useState, useRef, useEffect, useId, useMemo } from "react";
import { Badge } from "../Badge/Badge";
import { SearchIcon, CheckIcon, CloseIcon, ChevronDownIcon } from "../Icons";
import { cn } from "../../utils/cn";

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
  id?: string;
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
  id,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const generatedId = useId();
  const inputId = id || (label ? `multiselect-${label.toLowerCase().replace(/\s+/g, "-")}` : `multiselect-${generatedId}`);

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

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearch("");
    }
  }, [isOpen]);

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        (opt.description && opt.description.toLowerCase().includes(q)) ||
        (opt.group && opt.group.toLowerCase().includes(q))
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

  const handleSelectAll = () => {
    const allFilteredVals = filteredOptions.map((o) => o.value);
    const combined = Array.from(new Set([...selected, ...allFilteredVals]));
    onChange(combined);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const visibleSelected = selected.slice(0, maxDisplayedBadges);
  const remainingCount = selected.length - maxDisplayedBadges;

  return (
    <div className={cn("aui-multiselect-container", className)} ref={containerRef}>
      {label && (
        <label htmlFor={inputId} className="aui-label">
          {label}
        </label>
      )}

      <div
        id={inputId}
        className={cn(
          "aui-multiselect-trigger",
          isOpen && "is-open",
          error && "is-error"
        )}
        onClick={() => setIsOpen((prev) => !prev)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          } else if (e.key === "Escape" && isOpen) {
            e.preventDefault();
            setIsOpen(false);
          }
        }}
      >
        <div className="aui-multiselect-pills">
          {selected.length === 0 ? (
            <span className="aui-multiselect-placeholder">{placeholder}</span>
          ) : (
            <>
              {visibleSelected.map((val) => {
                const opt = options.find((o) => o.value === val);
                const itemLabel = opt ? opt.label : val;
                return (
                  <Badge
                    key={val}
                    variant="outline"
                    className="aui-multiselect-badge"
                  >
                    <span>{itemLabel}</span>
                    <button
                      type="button"
                      className="aui-multiselect-badge-remove"
                      onClick={(e) => removeBadge(e, val)}
                      aria-label={`Remove ${itemLabel}`}
                    >
                      <CloseIcon size={12} />
                    </button>
                  </Badge>
                );
              })}
              {remainingCount > 0 && (
                <Badge variant="outline" className="aui-multiselect-badge-more">
                  +{remainingCount} more
                </Badge>
              )}
            </>
          )}
        </div>

        <ChevronDownIcon
          size={14}
          className={cn("aui-multiselect-chevron", isOpen && "is-rotated")}
        />
      </div>

      {isOpen && (
        <div className="aui-multiselect-dropdown">
          <div className="aui-multiselect-search-box">
            <SearchIcon size={14} className="aui-multiselect-search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              className="aui-multiselect-search-input"
              placeholder="Filter options..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="aui-multiselect-actions-bar">
            <button
              type="button"
              className="aui-multiselect-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleSelectAll();
              }}
            >
              Select All
            </button>
            <button
              type="button"
              className="aui-multiselect-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleClearAll();
              }}
            >
              Clear All
            </button>
          </div>

          <ul className="aui-multiselect-list" role="listbox">
            {filteredOptions.length === 0 ? (
              <li className="aui-multiselect-empty">No options found</li>
            ) : (
              filteredOptions.map((opt) => {
                const isChecked = selected.includes(opt.value);
                return (
                  <li
                    key={opt.value}
                    className={cn(
                      "aui-multiselect-item",
                      isChecked && "is-checked"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOption(opt.value);
                    }}
                    role="option"
                    aria-selected={isChecked}
                  >
                    <div
                      className={cn(
                        "aui-multiselect-checkbox",
                        isChecked && "is-checked"
                      )}
                    >
                      {isChecked && <CheckIcon size={12} />}
                    </div>
                    <div className="aui-multiselect-item-content">
                      <span className="aui-multiselect-item-label">
                        {opt.label}
                      </span>
                      {opt.description && (
                        <span className="aui-multiselect-item-desc">
                          {opt.description}
                        </span>
                      )}
                    </div>
                    {opt.group && (
                      <span className="aui-multiselect-item-group">
                        {opt.group}
                      </span>
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}

      {error && <p className="aui-form-error">{error}</p>}
    </div>
  );
}

export const TagInput = MultiSelect;
