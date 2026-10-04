import React from "react";

export type BadgeVariant = "default" | "primary" | "dark" | "light";

export interface BadgeProps extends React.HTMLAttributes<HTMLElement> {
  variant?: BadgeVariant;
  href?: string;
  interactive?: boolean;
  target?: string;
  rel?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  href,
  interactive = false,
  target,
  rel,
  children,
  className = "",
  ...props
}) => {
  const isInteractive = interactive || Boolean(href);
  const classNames = [
    "aui-badge",
    variant !== "default" ? `aui-badge-${variant}` : "",
    isInteractive ? "aui-badge-interactive" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <a
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
    <span className={classNames} {...props}>
      {children}
    </span>
  );
};
