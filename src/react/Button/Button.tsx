import React from "react";

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
  | "primary"
  | "secondary"
  | "light"
  | "outline"
  | "ghost"
  | "danger"
  | "solid"
  | ButtonColor;

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  href?: string;
  target?: string;
  rel?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  color,
  size = "md",
  href,
  target,
  rel,
  icon,
  iconPosition = "left",
  fullWidth = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
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
  ].includes(variant as string);

  const effectiveColor = color || (isColorVariant ? (variant as ButtonColor) : undefined);
  const effectiveVariant = isColorVariant ? "solid" : variant;

  const classNames = [
    "aui-btn",
    effectiveVariant ? `aui-btn-${effectiveVariant}` : "",
    effectiveColor ? `aui-btn-color-${effectiveColor}` : "",
    `aui-btn-${size}`,
    fullWidth ? "aui-btn-full" : "",
    disabled ? "is-disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {icon && iconPosition === "left" && <span className="icon aui-btn-icon-left">{icon}</span>}
      {children && <span>{children}</span>}
      {icon && iconPosition === "right" && <span className="icon aui-btn-icon-right">{icon}</span>}
    </>
  );

  if (href) {
    return (
      <a
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
    <button type="button" className={classNames} disabled={disabled} {...props}>
      {content}
    </button>
  );
};
