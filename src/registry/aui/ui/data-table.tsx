"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  header: React.ReactNode;
  accessor?: keyof T;
  render?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: string | number;
}

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
  searchPlaceholder = "Search...",
  selectable = false,
  selectedKeys: controlledSelectedKeys,
  onSelectedKeysChange,
  renderBulkActions,
  pageSize = 10,
  dense = false,
  emptyText = "No records found",
  className,
}: DataTableProps<T>) {
  const [internalSelectedKeys, setInternalSelectedKeys] = React.useState<any[]>([]);
  const [search, setSearch] = React.useState("");
  const [sortKey, setSortKey] = React.useState<keyof T | null>(null);
  const [sortDir, setSortDir] = React.useState<"asc" | "desc" | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);

  const selectedKeys = controlledSelectedKeys !== undefined ? controlledSelectedKeys : internalSelectedKeys;

  const setSelectedKeys = (keys: any[]) => {
    if (onSelectedKeysChange) onSelectedKeysChange(keys);
    else setInternalSelectedKeys(keys);
  };

  const filteredData = React.useMemo(() => {
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

  const sortedData = React.useMemo(() => {
    if (!sortKey || !sortDir) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;
      let comp = 0;
      if (typeof valA === "number" && typeof valB === "number") comp = valA - valB;
      else comp = String(valA).localeCompare(String(valB), undefined, { numeric: true });
      return sortDir === "asc" ? comp : -comp;
    });
  }, [filteredData, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const page = Math.min(currentPage, totalPages);
  const paginatedData = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  const allPageKeys = React.useMemo(() => paginatedData.map((row) => row[keyField]), [paginatedData, keyField]);
  const isAllPageSelected = allPageKeys.length > 0 && allPageKeys.every((k) => selectedKeys.includes(k));

  const toggleSelectAll = () => {
    if (isAllPageSelected) {
      setSelectedKeys(selectedKeys.filter((k) => !allPageKeys.includes(k)));
    } else {
      setSelectedKeys(Array.from(new Set([...selectedKeys, ...allPageKeys])));
    }
  };

  const toggleSelectRow = (key: any) => {
    if (selectedKeys.includes(key)) {
      setSelectedKeys(selectedKeys.filter((k) => k !== key));
    } else {
      setSelectedKeys([...selectedKeys, key]);
    }
  };

  const selectedRows = React.useMemo(() => data.filter((r) => selectedKeys.includes(r[keyField])), [data, selectedKeys, keyField]);

  return (
    <div className={cn("space-y-3 w-full", className)}>
      <div className="flex items-center justify-between gap-4">
        {searchable && (
          <input
            type="text"
            className="flex h-9 w-64 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-hidden focus:ring-1 focus:ring-ring"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        )}

        {selectable && selectedKeys.length > 0 && (
          <div className="flex items-center gap-3 px-3 py-1 bg-muted rounded-md text-xs font-mono">
            <span className="text-primary font-bold">{selectedKeys.length} selected</span>
            {renderBulkActions && renderBulkActions(selectedRows)}
          </div>
        )}
      </div>

      <div className="rounded-lg border border-border bg-card shadow-xs overflow-auto">
        <table className="w-full text-sm border-collapse text-left">
          <thead className="border-b border-border bg-muted/40 font-mono text-xs text-muted-foreground uppercase">
            <tr>
              {selectable && (
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllPageSelected}
                    onChange={toggleSelectAll}
                    className="h-3.5 w-3.5 accent-primary"
                  />
                </th>
              )}
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  style={{ width: col.width, textAlign: col.align || "left" }}
                  className={cn("p-3 font-semibold", col.sortable && "cursor-pointer select-none hover:text-foreground")}
                  onClick={() => {
                    if (!col.sortable || !col.accessor) return;
                    if (sortKey === col.accessor) {
                      if (sortDir === "asc") setSortDir("desc");
                      else if (sortDir === "desc") { setSortDir(null); setSortKey(null); }
                      else setSortDir("asc");
                    } else {
                      setSortKey(col.accessor);
                      setSortDir("asc");
                    }
                  }}
                >
                  {col.header}
                  {col.sortable && col.accessor === sortKey && (
                    <span className="ml-1 text-primary">{sortDir === "asc" ? "▲" : "▼"}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="p-8 text-center text-xs text-muted-foreground">
                  {emptyText}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rIdx) => {
                const rowKey = row[keyField] ?? rIdx;
                const isSelected = selectedKeys.includes(rowKey);
                return (
                  <tr key={String(rowKey)} className={cn("border-b border-border/60 hover:bg-muted/30 transition-colors", isSelected && "bg-muted/40")}>
                    {selectable && (
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(rowKey)}
                          className="h-3.5 w-3.5 accent-primary"
                        />
                      </td>
                    )}
                    {columns.map((col, cIdx) => (
                      <td key={cIdx} style={{ textAlign: col.align || "left" }} className={cn("p-3 text-foreground", dense && "py-2")}>
                        {col.render ? col.render(row, rIdx) : col.accessor ? row[col.accessor] : null}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
          <span>Page {page} of {totalPages} ({sortedData.length} records)</span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 rounded border border-input bg-background hover:bg-muted disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 rounded border border-input bg-background hover:bg-muted disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
