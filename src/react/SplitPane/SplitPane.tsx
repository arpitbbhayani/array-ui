import React from "react";
import { cn } from "../../utils/cn";

export interface SplitPaneProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional content for the aside column. If provided, `children` becomes the main content. */
  aside?: React.ReactNode;
  /** Whether the first/aside column sticks while scrolling on desktop screens. Default false. */
  stickyFirst?: boolean;
  /** Alias for stickyFirst. */
  stickyAside?: boolean;
  /** Width ratio or grid template layout. Defaults to "5/7". */
  ratio?: "5/7" | "1/1" | "1/2" | "2/1" | "1/3" | "3/1" | string;
  /** Minimum width for the aside column on large screens. Default "320px". */
  minAside?: string | number;
  /** Gap between columns. Default "lg" (1.5rem / 24px). */
  gap?: "sm" | "md" | "lg" | "xl";
}

export interface SplitPaneAsideProps extends React.HTMLAttributes<HTMLElement> {
  sticky?: boolean;
}

export const SplitPaneAside = React.forwardRef<HTMLElement, SplitPaneAsideProps>(
  ({ className, sticky, children, ...props }, ref) => {
    return (
      <aside
        ref={ref}
        className={cn(
          "aui-split-aside",
          sticky && "is-sticky",
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
        className={cn("aui-split-main", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
SplitPaneMain.displayName = "SplitPaneMain";

interface SplitPaneComponent
  extends React.ForwardRefExoticComponent<
    SplitPaneProps & React.RefAttributes<HTMLDivElement>
  > {
  Aside: typeof SplitPaneAside;
  Main: typeof SplitPaneMain;
}

export const SplitPane = React.forwardRef<HTMLDivElement, SplitPaneProps>(
  (
    {
      aside,
      stickyFirst = false,
      stickyAside,
      ratio = "5/7",
      minAside = "320px",
      gap = "lg",
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isSticky = stickyAside !== undefined ? stickyAside : stickyFirst;
    const minW = typeof minAside === "number" ? `${minAside}px` : minAside;

    const dynamicStyle: React.CSSProperties = {
      ...(ratio && ratio !== "5/7"
        ? {
            gridTemplateColumns:
              ratio === "1/1"
                ? "repeat(2, minmax(0, 1fr))"
                : ratio === "1/2"
                ? "1fr 2fr"
                : ratio === "2/1"
                ? "2fr 1fr"
                : `minmax(${minW}, 5fr) minmax(0, 7fr)`,
          }
        : {}),
      ...style,
    };

    return (
      <div
        ref={ref}
        className={cn("aui-split-pane", gap && `aui-gap-${gap}`, className)}
        style={dynamicStyle}
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
) as SplitPaneComponent;

SplitPane.displayName = "SplitPane";
SplitPane.Aside = SplitPaneAside;
SplitPane.Main = SplitPaneMain;
