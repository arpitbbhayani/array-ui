import React from "react";
import { cn } from "../../utils/cn";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  as?: React.ElementType;
  size?: "display" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level = 1, as, size, className, children, ...props }, ref) => {
    const Component = (as || `h${level}`) as React.ElementType;
    const sizeClass = size ? `aui-${size}` : `aui-h${level}`;

    return (
      <Component
        ref={ref}
        className={cn("aui-heading", sizeClass, className)}
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
        className={cn("aui-lead", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Lead.displayName = "Lead";
