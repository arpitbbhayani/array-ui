import React from "react";
import { cn } from "../../utils/cn";

// --- Container ---
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  size?: "narrow" | "sm" | "md" | "lg" | "xl" | "full";
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ as: Component = "div", size = "xl", className, children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn("aui-container", size !== "xl" && `aui-container-${size}`, className)}
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

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ as: Component = "div", gap = "md", align, className, children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          "aui-stack",
          gap && gap !== "md" && `aui-stack-${gap}`,
          align && `aui-align-${align}`,
          className
        )}
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
          justify === "between" ? "aui-row-between" : "aui-row",
          gap && gap !== "md" && `aui-row-${gap}`,
          align && `aui-align-${align}`,
          wrap && "aui-flex-wrap",
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

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ as: Component = "div", cols = 2, gap = "md", className, children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          "aui-grid",
          typeof cols === "number" && `aui-grid-cols-${cols}`,
          gap && gap !== "md" && `aui-gap-${gap}`,
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Grid.displayName = "Grid";
