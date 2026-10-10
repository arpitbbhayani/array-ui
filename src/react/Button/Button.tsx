import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import { Spinner } from "../Spinner/Spinner";

export type ButtonColor =
  | "red"
  | "green"
  | "blue"
  | "amber"
  | "yellow"
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
      yellow: "aui-btn-solid aui-btn-color-yellow",
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
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  isLoading?: boolean;
  loadingText?: React.ReactNode;
  spinner?: React.ReactNode;
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
      leftIcon,
      rightIcon,
      loading = false,
      isLoading = false,
      loadingText,
      spinner,
      fullWidth = false,
      asChild = false,
      children,
      className,
      disabled,
      onClick,
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
      "yellow",
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

    const loadingActive = Boolean(loading || isLoading);
    const isDisabled = Boolean(disabled || loadingActive);

    const classNames = cn(
      "aui-btn",
      effectiveVariant && `aui-btn-${effectiveVariant}`,
      effectiveColor && `aui-btn-color-${effectiveColor}`,
      normalizedSize && `aui-btn-${normalizedSize}`,
      fullWidth && "aui-btn-full",
      isDisabled && "is-disabled",
      loadingActive && "is-loading",
      className
    );

    if (asChild) {
      return (
        <Slot ref={ref} className={classNames} {...props}>
          {children}
        </Slot>
      );
    }

    const spinnerElement = spinner || (
      <Spinner
        size={normalizedSize === "lg" ? "md" : "sm"}
        className="aui-btn-spinner"
      />
    );

    const effectiveLeftIcon = loadingActive
      ? (iconPosition === "right" && !leftIcon ? undefined : spinnerElement)
      : leftIcon || (iconPosition === "left" ? icon : undefined);

    const effectiveRightIcon = loadingActive
      ? (iconPosition === "right" && !leftIcon ? spinnerElement : undefined)
      : rightIcon || (iconPosition === "right" ? icon : undefined);

    const effectiveChildren = loadingActive && loadingText ? loadingText : children;
    const hasChildren =
      effectiveChildren !== undefined &&
      effectiveChildren !== null &&
      effectiveChildren !== "";

    const isIconOnly = !hasChildren && Boolean(effectiveLeftIcon || effectiveRightIcon);

    const content = isIconOnly ? (
      <span className="aui-btn-icon" aria-hidden="true">
        {effectiveLeftIcon || effectiveRightIcon}
      </span>
    ) : (
      <>
        {effectiveLeftIcon && (
          <span className="aui-btn-icon aui-btn-icon-left" aria-hidden="true">
            {effectiveLeftIcon}
          </span>
        )}
        {hasChildren && <span className="aui-btn-label">{effectiveChildren}</span>}
        {effectiveRightIcon && (
          <span className="aui-btn-icon aui-btn-icon-right" aria-hidden="true">
            {effectiveRightIcon}
          </span>
        )}
      </>
    );

    if (href) {
      return (
        <a
          ref={ref as unknown as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={target === "_blank" && !rel ? "noopener noreferrer" : rel}
          className={classNames}
          aria-disabled={isDisabled}
          aria-busy={loadingActive ? "true" : undefined}
          onClick={isDisabled ? (e) => e.preventDefault() : onClick}
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
        disabled={isDisabled}
        aria-busy={loadingActive ? "true" : undefined}
        onClick={onClick}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";

