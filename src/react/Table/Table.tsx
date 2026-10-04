import React, { useState, useMemo } from "react";
import { cn } from "../../utils/cn";

export interface Column<T> {
  header: React.ReactNode;
  accessor?: keyof T;
  render?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  align?: "left" | "center" | "right";
}

export type SortDirection = "asc" | "desc";

export interface TableProps<T = any>
  extends React.TableHTMLAttributes<HTMLTableElement> {
  columns?: Column<T>[];
  data?: T[];
  dense?: boolean;
  sortColumn?: keyof T;
  sortDirection?: SortDirection;
  onSort?: (column: Column<T>, direction: SortDirection | null) => void;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps<any>>(
  (
    {
      columns,
      data,
      dense = false,
      sortColumn: controlledSortColumn,
      sortDirection: controlledSortDirection,
      onSort,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const [internalSortKey, setInternalSortKey] = useState<any>(null);
    const [internalSortDir, setInternalSortDir] = useState<SortDirection | null>(null);

    const activeSortKey =
      controlledSortColumn !== undefined ? controlledSortColumn : internalSortKey;
    const activeSortDir =
      controlledSortDirection !== undefined ? controlledSortDirection : internalSortDir;

    const handleHeaderClick = (col: Column<any>) => {
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
      if (!data || !activeSortKey || !activeSortDir || onSort) return data || [];
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
          comparison = String(valA).localeCompare(String(valB), undefined, {
            numeric: true,
          });
        }
        return activeSortDir === "asc" ? comparison : -comparison;
      });
    }, [data, activeSortKey, activeSortDir, onSort]);

    // If compound children are provided (shadcn style)
    if (!columns && children) {
      return (
        <div className="aui-table-wrapper">
          <table
            ref={ref}
            className={cn("aui-table", dense && "aui-table-dense", className)}
            {...props}
          >
            {children}
          </table>
        </div>
      );
    }

    return (
      <div className="aui-table-wrapper">
        <table
          ref={ref}
          className={cn("aui-table", dense && "aui-table-dense", className)}
          {...props}
        >
          {columns && (
            <thead>
              <tr>
                {columns.map((col, idx) => {
                  const isSortable = !!col.sortable && !!col.accessor;
                  const isSorted =
                    isSortable &&
                    activeSortKey === col.accessor &&
                    activeSortDir !== null;
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
          )}
          {sortedData && (
            <tbody>
              {sortedData.map((row, rIdx) => (
                <tr key={rIdx}>
                  {columns?.map((col, cIdx) => (
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
          )}
        </table>
      </div>
    );
  }
);
Table.displayName = "Table";

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("aui-table-header", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("aui-table-body", className)} {...props} />
));
TableBody.displayName = "TableBody";

export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot ref={ref} className={cn("aui-table-footer", className)} {...props} />
));
TableFooter.displayName = "TableFooter";

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr ref={ref} className={cn("aui-table-row", className)} {...props} />
));
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th ref={ref} className={cn("aui-table-head", className)} {...props} />
));
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td ref={ref} className={cn("aui-table-cell", className)} {...props} />
));
TableCell.displayName = "TableCell";

export const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("aui-table-caption", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";
