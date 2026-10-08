import * as React from "react";
import { cn } from "@/lib/utils";

export interface SplitPaneProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional content for the aside column. If provided, `children` becomes the main content. */
  aside?: React.ReactNode;
  /** Whether the first/aside column sticks while scrolling on desktop screens. Default true. */
  stickyFirst?: boolean;
  /** Alias for stickyFirst. */
  stickyAside?: boolean;
  /** Breakpoint at which columns stack vertically. Default "lg". */
  stackBreakpoint?: "md" | "lg" | "xl";
  /** Width ratio or grid template layout. Defaults to "5/7" (minmax(320px, 5fr) minmax(0, 7fr)). */
  ratio?: "5/7" | "1/1" | "1/2" | "2/1" | "1/3" | "3/1" | string;
  /** Minimum width for the aside column on large screens. Default "320px". */
  minAside?: string | number;
  /** Gap between columns. Default "lg" (1.5rem / 24px). */
  gap?: "sm" | "md" | "lg" | "xl";
}

const GAP_MAP = {
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

export interface SplitPaneAsideProps extends React.HTMLAttributes<HTMLElement> {
  sticky?: boolean;
}

export const SplitPaneAside = React.forwardRef<HTMLElement, SplitPaneAsideProps>(
  ({ className, sticky, children, ...props }, ref) => {
    return (
      <aside
        ref={ref}
        className={cn(
          "flex flex-col gap-3 min-w-0 w-full",
          sticky && "lg:sticky lg:top-4",
          className
        )}
        {...props}
      >
        {children}
      </aside>
    );
  }
);
SplitPaneAside.displayName = "SplitPaneAside";

export interface SplitPaneMainProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}

export const SplitPaneMain = React.forwardRef<HTMLElement, SplitPaneMainProps>(
  ({ className, as: Component = "article", children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn("flex min-w-0 flex-col gap-4 w-full", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
SplitPaneMain.displayName = "SplitPaneMain";

export function SplitPane({
  aside,
  stickyFirst = false,
  stickyAside,
  stackBreakpoint = "lg",
  ratio = "5/7",
  minAside = "320px",
  gap = "lg",
  className,
  children,
  ...props
}: SplitPaneProps) {
  const isSticky = stickyAside !== undefined ? stickyAside : stickyFirst;
  const minW = typeof minAside === "number" ? `${minAside}px` : minAside;

  const gridColsClass =
    ratio === "1/1"
      ? "lg:grid-cols-2"
      : ratio === "1/2"
      ? "lg:grid-cols-[1fr_2fr]"
      : ratio === "2/1"
      ? "lg:grid-cols-[2fr_1fr]"
      : ratio === "1/3"
      ? "lg:grid-cols-[1fr_3fr]"
      : ratio === "3/1"
      ? "lg:grid-cols-[3fr_1fr]"
      : `lg:grid-cols-[minmax(${minW},5fr)_minmax(0,7fr)]`;

  return (
    <div
      className={cn(
        "grid items-start w-full",
        gridColsClass,
        GAP_MAP[gap],
        className
      )}
      {...props}
    >
      {aside !== undefined ? (
        <>
          <SplitPaneAside sticky={isSticky}>{aside}</SplitPaneAside>
          <SplitPaneMain>{children}</SplitPaneMain>
        </>
      ) : (
        children
      )}
    </div>
  );
}

SplitPane.Aside = SplitPaneAside;
SplitPane.Main = SplitPaneMain;
