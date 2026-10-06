"use client";

import React, { useState, useMemo } from "react";
import { SearchIcon } from "../Icons";
import { Button } from "../Button/Button";
import { cn } from "../../utils/cn";

export interface DataTableColumn<T> {
  header: React.ReactNode;
  accessor?: keyof T;
  render?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: string | number;
}

export type DataTableSortDirection = "asc" | "desc";

export interface DataTableProps<T = any> {
  data: T[];
  columns: DataTableColumn<T>[];
  keyField?: keyof T;
  searchable?: boolean;
  searchPlaceholder?: string;
  selectable?: boolean;
  selectedKeys?: any[];
  onSelectedKeysChange?: (keys: any[]) => void;
  renderBulkActions?: (selectedRows: T[]) => React.ReactNode;
  pageSize?: number;
  dense?: boolean;
  emptyText?: string;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data = [],
  columns = [],
  keyField = "id" as keyof T,
  searchable = true,
  searchPlaceholder = "Search records...",
  selectable = false,
  selectedKeys: controlledSelectedKeys,
  onSelectedKeysChange,
  renderBulkActions,
  pageSize = 10,
  dense = false,
  emptyText = "No records found",
  className,
}: DataTableProps<T>) {
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<DataTableSortDirection | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const selectedKeys =
    controlledSelectedKeys !== undefined
      ? controlledSelectedKeys
      : internalSelectedKeys;

  const setSelectedKeys = (keys: any[]) => {
    if (onSelectedKeysChange) {
      onSelectedKeysChange(keys);
    } else {
      setInternalSelectedKeys(keys);
    }
  };

  // Filter
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        if (!col.accessor) return false;
        const val = row[col.accessor];
        return val !== null && val !== undefined && String(val).toLowerCase().includes(q);
      })
    );
  }, [data, search, columns]);

  // Sort
  const sortedData = useMemo(() => {
    if (!sortKey || !sortDir) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      let comp = 0;
      if (typeof valA === "number" && typeof valB === "number") {
        comp = valA - valB;
      } else {
        comp = String(valA).localeCompare(String(valB), undefined, { numeric: true });
      }
      return sortDir === "asc" ? comp : -comp;
    });
  }, [filteredData, sortKey, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const page = Math.min(currentPage, totalPages);
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  // Selection
  const allPageKeys = useMemo(
    () => paginatedData.map((row) => row[keyField]),
    [paginatedData, keyField]
  );

  const isAllPageSelected =
    allPageKeys.length > 0 &&
    allPageKeys.every((k) => selectedKeys.includes(k));

  const toggleSelectAll = () => {
    if (isAllPageSelected) {
      setSelectedKeys(selectedKeys.filter((k) => !allPageKeys.includes(k)));
    } else {
      const union = Array.from(new Set([...selectedKeys, ...allPageKeys]));
      setSelectedKeys(union);
    }
  };

  const toggleSelectRow = (key: any) => {
    if (selectedKeys.includes(key)) {
      setSelectedKeys(selectedKeys.filter((k) => k !== key));
    } else {
      setSelectedKeys([...selectedKeys, key]);
    }
  };

  const selectedRows = useMemo(
    () => data.filter((r) => selectedKeys.includes(r[keyField])),
    [data, selectedKeys, keyField]
  );

  const handleHeaderSort = (col: DataTableColumn<T>) => {
    if (!col.sortable || !col.accessor) return;
    if (sortKey === col.accessor) {
      if (sortDir === "asc") setSortDir("desc");
      else if (sortDir === "desc") {
        setSortDir(null);
        setSortKey(null);
      } else setSortDir("asc");
    } else {
      setSortKey(col.accessor);
      setSortDir("asc");
    }
  };

  return (
    <div className={cn("aui-datatable", className)}>
      {/* Toolbar */}
      <div className="aui-datatable-toolbar">
        {searchable && (
          <div className="aui-datatable-search">
            <SearchIcon size={14} className="aui-datatable-search-icon" />
            <input
              type="text"
              className="aui-datatable-search-input"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        )}

        {selectable && selectedKeys.length > 0 && (
          <div className="aui-datatable-selected-bar">
            <span className="aui-datatable-selected-count">
              {selectedKeys.length} selected
            </span>
            {renderBulkActions && (
              <div className="aui-datatable-bulk-actions">
                {renderBulkActions(selectedRows)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="aui-table-wrapper">
        <table className={cn("aui-table", dense && "aui-table-dense")}>
          <thead>
            <tr>
              {selectable && (
                <th style={{ width: 40, textAlign: "center" }}>
                  <input
                    type="checkbox"
                    className="aui-checkbox"
                    checked={isAllPageSelected}
                    onChange={toggleSelectAll}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((col, idx) => {
                const isSortable = !!col.sortable && !!col.accessor;
                const isSorted = isSortable && sortKey === col.accessor && sortDir !== null;
                const align = col.align || "left";

                return (
                  <th
                    key={idx}
                    className={isSortable ? "aui-table-th-sortable" : undefined}
                    style={{ textAlign: align, width: col.width }}
                    onClick={isSortable ? () => handleHeaderSort(col) : undefined}
                    role={isSortable ? "button" : undefined}
                    tabIndex={isSortable ? 0 : undefined}
                  >
                    <span>{col.header}</span>
                    {isSortable && (
                      <span
                        className={cn(
                          "aui-table-sort-icon",
                          isSorted && "is-active"
                        )}
                        aria-hidden="true"
                      >
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {isSorted && sortDir === "asc" ? (
                            <path d="M12 19V5M5 12l7-7 7 7" />
                          ) : isSorted && sortDir === "desc" ? (
                            <path d="M12 5v14M19 12l-7 7-7-7" />
                          ) : (
                            <path d="M7 15l5 5 5-5M7 9l5-5 5 5" />
                          )}
                        </svg>
                      </span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="aui-datatable-empty-cell"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rIdx) => {
                const rowKey = row[keyField] ?? rIdx;
                const isRowSelected = selectedKeys.includes(rowKey);

                return (
                  <tr
                    key={String(rowKey)}
                    className={cn(isRowSelected && "is-row-selected")}
                  >
                    {selectable && (
                      <td style={{ textAlign: "center" }}>
                        <input
                          type="checkbox"
                          className="aui-checkbox"
                          checked={isRowSelected}
                          onChange={() => toggleSelectRow(rowKey)}
                          aria-label={`Select row ${rowKey}`}
                        />
                      </td>
                    )}
                    {columns.map((col, cIdx) => (
                      <td key={cIdx} style={{ textAlign: col.align || "left" }}>
                        {col.render
                          ? col.render(row, rIdx)
                          : col.accessor
                          ? row[col.accessor]
                          : null}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="aui-datatable-pagination">
          <span className="aui-datatable-page-info">
            Page {page} of {totalPages} ({sortedData.length} total)
          </span>
          <div className="aui-datatable-page-buttons">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
