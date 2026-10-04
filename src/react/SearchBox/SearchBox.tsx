"use client";

import React, { useState, useEffect, useRef } from "react";
import { SearchIcon } from "../Icons";

export interface SearchResultItem {
  title: string;
  url: string;
  description?: string;
  tag?: string;
}

export interface SearchBoxProps {
  placeholder?: string;
  endpoint?: string;
  shortcut?: string;
  minChars?: number;
  value?: string;
  onChange?: (val: string) => void;
  onSearch?: (query: string) => void;
  results?: SearchResultItem[];
  loading?: boolean;
  className?: string;
  onSelectResult?: (item: SearchResultItem) => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = "Search writings, notes, and topics...",
  endpoint,
  shortcut = "⌘K",
  minChars = 2,
  value: controlledValue,
  onChange,
  onSearch,
  results: controlledResults,
  loading: controlledLoading,
  className = "",
  onSelectResult,
}) => {
  const [internalValue, setInternalValue] = useState("");
  const [internalResults, setInternalResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const query = controlledValue !== undefined ? controlledValue : internalValue;
  const results = controlledResults !== undefined ? controlledResults : internalResults;
  const loading = controlledLoading !== undefined ? controlledLoading : isLoading;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (controlledValue === undefined) setInternalValue(val);
    if (onChange) onChange(val);

    if (val.trim().length >= minChars) {
      setIsOpen(true);
      if (onSearch) {
        onSearch(val.trim());
      } else if (endpoint) {
        setIsLoading(true);
        fetch(endpoint + encodeURIComponent(val.trim()))
          .then((res) => res.json())
          .then((data) => {
            const list = Array.isArray(data) ? data : data.resources || data.results || [];
            setInternalResults(list);
          })
          .catch((err) => console.error("Search error:", err))
          .finally(() => setIsLoading(false));
      }
    } else {
      setIsOpen(false);
      setInternalResults([]);
    }
  };

  return (
    <div ref={containerRef} className={`aui-searchbox ${className}`}>
      <div className="aui-searchbox-field">
        <span className="aui-searchbox-icon" aria-hidden="true">
          <SearchIcon size={16} />
        </span>
        <input
          type="search"
          className="aui-searchbox-input"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (query.trim().length >= minChars) setIsOpen(true);
          }}
          spellCheck={false}
          autoComplete="off"
        />
        <div className="aui-searchbox-actions">
          {shortcut && <span className="aui-searchbox-kbd">{shortcut}</span>}
        </div>
      </div>

      {isOpen && (
        <ul className="aui-searchbox-results" role="listbox">
          {loading ? (
            <li className="aui-searchbox-empty">Searching...</li>
          ) : results.length > 0 ? (
            results.map((item, idx) => (
              <li key={idx} className="aui-searchbox-item">
                <a
                  href={item.url}
                  className="aui-searchbox-result-link"
                  onClick={() => {
                    setIsOpen(false);
                    if (onSelectResult) onSelectResult(item);
                  }}
                >
                  <div className="aui-searchbox-result-title">{item.title}</div>
                  {item.description && (
                    <div className="aui-searchbox-result-desc">{item.description}</div>
                  )}
                </a>
              </li>
            ))
          ) : (
            <li className="aui-searchbox-empty">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
};
