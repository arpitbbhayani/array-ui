import React from "react";
import { cn } from "../../utils/cn";

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      onPageChange,
      children,
      className,
      ...props
    },
    ref
  ) => {
    if (currentPage === undefined || totalPages === undefined) {
      return (
        <nav
          ref={ref}
          role="navigation"
          aria-label="pagination"
          className={cn("aui-pagination", className)}
          {...props}
        >
          {children}
        </nav>
      );
    }

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <nav
        ref={ref}
        role="navigation"
        aria-label="pagination"
        className={cn("aui-pagination", className)}
        {...props}
      >
        <button
          type="button"
          className="aui-pagination-item"
          onClick={() => onPageChange?.(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
        >
          ←
        </button>

        {pages.map((p) => (
          <button
            key={p}
            type="button"
            className={cn(
              "aui-pagination-item",
              p === currentPage && "is-active"
            )}
            onClick={() => onPageChange?.(p)}
            aria-current={p === currentPage ? "page" : undefined}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          className="aui-pagination-item"
          onClick={() => onPageChange?.(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          →
        </button>
      </nav>
    );
  }
);
Pagination.displayName = "Pagination";

export const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("aui-pagination-content", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

export const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.LiHTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("aui-pagination-list-item", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

export const PaginationLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { isActive?: boolean }
>(({ className, isActive, ...props }, ref) => (
  <a
    ref={ref}
    aria-current={isActive ? "page" : undefined}
    className={cn(
      "aui-pagination-item",
      isActive && "is-active",
      className
    )}
    {...props}
  />
));
PaginationLink.displayName = "PaginationLink";

export const PaginationPrevious = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, children = "← Previous", ...props }, ref) => (
  <a
    ref={ref}
    aria-label="Go to previous page"
    className={cn("aui-pagination-item aui-pagination-prev", className)}
    {...props}
  >
    {children}
  </a>
));
PaginationPrevious.displayName = "PaginationPrevious";

export const PaginationNext = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, children = "Next →", ...props }, ref) => (
  <a
    ref={ref}
    aria-label="Go to next page"
    className={cn("aui-pagination-item aui-pagination-next", className)}
    {...props}
  >
    {children}
  </a>
));
PaginationNext.displayName = "PaginationNext";

export const PaginationEllipsis = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    aria-hidden="true"
    className={cn("aui-pagination-ellipsis", className)}
    {...props}
  >
    …
  </span>
));
PaginationEllipsis.displayName = "PaginationEllipsis";
