import React from "react";

export type ButtonVariant = "primary" | "secondary" | "light" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
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
  const classNames = [
    "aui-btn",
    `aui-btn-${variant}`,
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
