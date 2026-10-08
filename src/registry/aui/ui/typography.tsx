import * as React from "react";
import { cn } from "@/lib/utils";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  as?: React.ElementType;
  size?: "display" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const HEADING_SIZES = {
  display: "text-4xl md:text-5xl font-extrabold tracking-tight",
  h1: "text-3xl md:text-4xl font-bold tracking-tight",
  h2: "text-2xl md:text-3xl font-bold tracking-tight",
  h3: "text-xl md:text-2xl font-bold",
  h4: "text-lg md:text-xl font-bold",
  h5: "text-base font-semibold",
  h6: "text-sm font-semibold uppercase tracking-wider",
};

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level = 1, as, size, className, children, ...props }, ref) => {
    const Component = (as || `h${level}`) as React.ElementType;
    const sizeKey = size || (`h${level}` as keyof typeof HEADING_SIZES);

    return (
      <Component
        ref={ref}
        className={cn(
          "font-heading text-foreground",
          HEADING_SIZES[sizeKey] || HEADING_SIZES.h1,
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Heading.displayName = "Heading";

export const H1 = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, "level">>(
  (props, ref) => <Heading ref={ref} level={1} {...props} />
);
H1.displayName = "H1";

export const H2 = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, "level">>(
  (props, ref) => <Heading ref={ref} level={2} {...props} />
);
H2.displayName = "H2";

export const H3 = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, "level">>(
  (props, ref) => <Heading ref={ref} level={3} {...props} />
);
H3.displayName = "H3";

export const H4 = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, "level">>(
  (props, ref) => <Heading ref={ref} level={4} {...props} />
);
H4.displayName = "H4";

export interface LeadProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: React.ElementType;
}

export const Lead = React.forwardRef<HTMLParagraphElement, LeadProps>(
  ({ as: Component = "p", className, children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn("text-lg md:text-xl text-muted-foreground leading-relaxed", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Lead.displayName = "Lead";
