import React, { useState, useMemo } from "react";

export interface Column<T> {
  header: React.ReactNode;
  accessor?: keyof T;
  render?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  align?: "left" | "center" | "right";
}

export type SortDirection = "asc" | "desc";

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  dense?: boolean;
  sortColumn?: keyof T;
  sortDirection?: SortDirection;
  onSort?: (column: Column<T>, direction: SortDirection | null) => void;
  className?: string;
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  dense = false,
  sortColumn: controlledSortColumn,
  sortDirection: controlledSortDirection,
  onSort,
  className = "",
}: TableProps<T>) {
  const [internalSortKey, setInternalSortKey] = useState<keyof T | null>(null);
  const [internalSortDir, setInternalSortDir] = useState<SortDirection | null>(null);

  const activeSortKey = controlledSortColumn !== undefined ? controlledSortColumn : internalSortKey;
  const activeSortDir = controlledSortDirection !== undefined ? controlledSortDirection : internalSortDir;

  const handleHeaderClick = (col: Column<T>) => {
    if (!col.sortable || !col.accessor) return;

    let nextDir: SortDirection | null = "asc";
    if (activeSortKey === col.accessor) {
      if (activeSortDir === "asc") nextDir = "desc";
      else if (activeSortDir === "desc") nextDir = null;
      else nextDir = "asc";
    }

    if (onSort) {
      onSort(col, nextDir);
    } else {
      setInternalSortKey(nextDir ? col.accessor : null);
      setInternalSortDir(nextDir);
    }
  };

  const sortedData = useMemo(() => {
    if (!activeSortKey || !activeSortDir || onSort) return data;
    return [...data].sort((a, b) => {
      const valA = a[activeSortKey];
      const valB = b[activeSortKey];
      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      let comparison = 0;
      if (typeof valA === "number" && typeof valB === "number") {
        comparison = valA - valB;
      } else {
        comparison = String(valA).localeCompare(String(valB), undefined, { numeric: true });
      }
      return activeSortDir === "asc" ? comparison : -comparison;
    });
  }, [data, activeSortKey, activeSortDir, onSort]);

  return (
    <div className="aui-table-wrapper">
      <table className={`aui-table ${dense ? "aui-table-dense" : ""} ${className}`.trim()}>
        <thead>
          <tr>
            {columns.map((col, idx) => {
              const isSortable = !!col.sortable && !!col.accessor;
              const isSorted = isSortable && activeSortKey === col.accessor && activeSortDir !== null;
              const align = col.align || "left";

              return (
                <th
                  key={idx}
                  className={isSortable ? "aui-table-th-sortable" : undefined}
                  style={{ textAlign: align }}
                  onClick={isSortable ? () => handleHeaderClick(col) : undefined}
                  role={isSortable ? "button" : undefined}
                  tabIndex={isSortable ? 0 : undefined}
                  onKeyDown={
                    isSortable
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleHeaderClick(col);
                          }
                        }
                      : undefined
                  }
                >
                  <span>{col.header}</span>
                  {isSortable && (
                    <span
                      className={`aui-table-sort-icon ${isSorted ? "is-active" : ""}`}
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
                        {isSorted && activeSortDir === "asc" ? (
                          <path d="M12 19V5M5 12l7-7 7 7" />
                        ) : isSorted && activeSortDir === "desc" ? (
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
          {sortedData.map((row, rIdx) => (
            <tr key={rIdx}>
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
