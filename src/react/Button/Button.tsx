import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

export type ButtonColor =
  | "red"
  | "green"
  | "blue"
  | "amber"
  | "violet"
  | "pink"
  | "cyan"
  | "success"
  | "warning"
  | "info"
  | "danger";

export type ButtonVariant =
  | "default"
  | "primary"
  | "secondary"
  | "destructive"
  | "danger"
  | "light"
  | "outline"
  | "ghost"
  | "link"
  | "solid"
  | ButtonColor;

export type ButtonSize = "default" | "sm" | "md" | "lg" | "icon";

export const buttonVariants = cva("aui-btn", {
  variants: {
    variant: {
      default: "aui-btn-primary",
      primary: "aui-btn-primary",
      secondary: "aui-btn-secondary",
      destructive: "aui-btn-danger",
      danger: "aui-btn-danger",
      outline: "aui-btn-outline",
      ghost: "aui-btn-ghost",
      link: "aui-btn-link",
      light: "aui-btn-light",
      solid: "aui-btn-solid",
      red: "aui-btn-solid aui-btn-color-red",
      green: "aui-btn-solid aui-btn-color-green",
      blue: "aui-btn-solid aui-btn-color-blue",
      amber: "aui-btn-solid aui-btn-color-amber",
      violet: "aui-btn-solid aui-btn-color-violet",
      pink: "aui-btn-solid aui-btn-color-pink",
      cyan: "aui-btn-solid aui-btn-color-cyan",
      success: "aui-btn-solid aui-btn-color-success",
      warning: "aui-btn-solid aui-btn-color-warning",
      info: "aui-btn-solid aui-btn-color-info",
    },
    size: {
      default: "aui-btn-md",
      sm: "aui-btn-sm",
      md: "aui-btn-md",
      lg: "aui-btn-lg",
      icon: "aui-btn-icon-only",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  href?: string;
  target?: string;
  rel?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      color,
      size = "md",
      href,
      target,
      rel,
      icon,
      iconPosition = "left",
      fullWidth = false,
      asChild = false,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    // Map shadcn synonyms
    const normalizedVariant =
      variant === "default"
        ? "primary"
        : variant === "destructive"
        ? "danger"
        : variant;

    const normalizedSize = size === "default" ? "md" : size;

    const isColorVariant = [
      "red",
      "green",
      "blue",
      "amber",
      "violet",
      "pink",
      "cyan",
      "success",
      "warning",
      "info",
    ].includes(normalizedVariant as string);

    const effectiveColor =
      color || (isColorVariant ? (normalizedVariant as ButtonColor) : undefined);
    const effectiveVariant = isColorVariant ? "solid" : normalizedVariant;

    const classNames = cn(
      "aui-btn",
      effectiveVariant && `aui-btn-${effectiveVariant}`,
      effectiveColor && `aui-btn-color-${effectiveColor}`,
      normalizedSize && `aui-btn-${normalizedSize}`,
      fullWidth && "aui-btn-full",
      disabled && "is-disabled",
      className
    );

    const content = (
      <>
        {icon && iconPosition === "left" && (
          <span className="icon aui-btn-icon-left">{icon}</span>
        )}
        {children && <span>{children}</span>}
        {icon && iconPosition === "right" && (
          <span className="icon aui-btn-icon-right">{icon}</span>
        )}
      </>
    );

    if (asChild) {
      return (
        <Slot ref={ref} className={classNames} {...props}>
          {children}
        </Slot>
      );
    }

    if (href) {
      return (
        <a
          ref={ref as unknown as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={target === "_blank" && !rel ? "noopener noreferrer" : rel}
          className={classNames}
          aria-disabled={disabled}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        type="button"
        className={classNames}
        disabled={disabled}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";
