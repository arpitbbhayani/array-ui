import * as React from "react";
import { cn } from "@/lib/utils";

// --- Container ---
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  size?: "narrow" | "sm" | "md" | "lg" | "xl" | "full";
}

const CONTAINER_SIZES = {
  narrow: "max-w-3xl",
  sm: "max-w-4xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-[1400px]",
  full: "max-w-full",
};

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ as: Component = "div", size = "xl", className, children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn("mx-auto w-full px-4 sm:px-6", CONTAINER_SIZES[size], className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Container.displayName = "Container";

// --- Stack ---
export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch";
}

const STACK_GAPS = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

const STACK_ALIGNS = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ as: Component = "div", gap = "md", align = "stretch", className, children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn("flex flex-col", STACK_GAPS[gap], STACK_ALIGNS[align], className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Stack.displayName = "Stack";

// --- Row ---
export interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "baseline" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  wrap?: boolean;
}

const ROW_GAPS = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-5",
  xl: "gap-8",
};

const ROW_ALIGNS = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  baseline: "items-baseline",
  stretch: "items-stretch",
};

const ROW_JUSTIFIES = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
};

export const Row = React.forwardRef<HTMLDivElement, RowProps>(
  (
    {
      as: Component = "div",
      gap = "md",
      align = "center",
      justify = "start",
      wrap = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          "flex flex-row",
          ROW_GAPS[gap],
          ROW_ALIGNS[align],
          ROW_JUSTIFIES[justify],
          wrap && "flex-wrap",
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Row.displayName = "Row";

// --- Grid ---
export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | string;
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
}

const GRID_COLS = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
  5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-5",
  6: "grid-cols-2 sm:grid-cols-3 md:grid-cols-6",
  12: "grid-cols-12",
};

const GRID_GAPS = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ as: Component = "div", cols = 2, gap = "md", className, children, ...props }, ref) => {
    const colClass = typeof cols === "number" ? GRID_COLS[cols as keyof typeof GRID_COLS] || `grid-cols-${cols}` : cols;

    return (
      <Component
        ref={ref}
        className={cn("grid", colClass, GRID_GAPS[gap], className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Grid.displayName = "Grid";
