import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  interactive?: boolean;
  as?: React.ElementType;
}

export const Card: React.FC<CardProps> = ({
  hoverable = true,
  interactive = false,
  as: Component = "div",
  children,
  className = "",
  ...props
}) => {
  const classNames = [
    "aui-card",
    hoverable ? "aui-card-hover" : "",
    interactive ? "aui-card-interactive" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classNames} {...props}>
      {children}
    </Component>
  );
};
