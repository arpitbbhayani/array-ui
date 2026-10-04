import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

export type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "destructive"
  | "outline"
  | "dark"
  | "light"
  | "red"
  | "blue"
  | "violet"
  | "green"
  | "amber"
  | "pink"
  | "cyan";

export const badgeVariants = cva("aui-badge", {
  variants: {
    variant: {
      default: "",
      primary: "aui-badge-primary",
      secondary: "aui-badge-light",
      destructive: "aui-badge-red",
      outline: "aui-badge-outline",
      dark: "aui-badge-dark",
      light: "aui-badge-light",
      red: "aui-badge-red",
      blue: "aui-badge-blue",
      violet: "aui-badge-violet",
      green: "aui-badge-green",
      amber: "aui-badge-amber",
      pink: "aui-badge-pink",
      cyan: "aui-badge-cyan",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLElement> {
  variant?: BadgeVariant;
  href?: string;
  interactive?: boolean;
  target?: string;
  rel?: string;
}

export const Badge = React.forwardRef<HTMLElement, BadgeProps>(
  (
    {
      variant = "default",
      href,
      interactive = false,
      target,
      rel,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const isInteractive = interactive || Boolean(href);

    const normalizedVariant =
      variant === "secondary"
        ? "light"
        : variant === "destructive"
        ? "red"
        : variant;

    const classNames = cn(
      "aui-badge",
      normalizedVariant !== "default" && `aui-badge-${normalizedVariant}`,
      isInteractive && "aui-badge-interactive",
      className
    );

    if (href) {
      return (
        <a
          ref={ref as unknown as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={target === "_blank" && !rel ? "noopener noreferrer" : rel}
          className={classNames}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }

    return (
      <span
        ref={ref as unknown as React.Ref<HTMLSpanElement>}
        className={classNames}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
