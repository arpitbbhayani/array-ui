import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

export type AlertVariant =
  | "default"
  | "destructive"
  | "info"
  | "success"
  | "warning"
  | "error";

export const alertVariants = cva("aui-alert", {
  variants: {
    variant: {
      default: "aui-alert-info",
      destructive: "aui-alert-error",
      info: "aui-alert-info",
      success: "aui-alert-success",
      warning: "aui-alert-warning",
      error: "aui-alert-error",
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: AlertVariant;
  title?: React.ReactNode;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = "info",
      title,
      children,
      icon,
      className,
      ...props
    },
    ref
  ) => {
    const normalizedVariant =
      variant === "default"
        ? "info"
        : variant === "destructive"
        ? "error"
        : variant;

    return (
      <div
        ref={ref}
        className={cn("aui-alert", `aui-alert-${normalizedVariant}`, className)}
        role="alert"
        {...props}
      >
        {icon && (
          <span style={{ flexShrink: 0, marginTop: "2px" }}>{icon}</span>
        )}
        <div style={{ flex: 1 }}>
          {title && <div className="aui-alert-title">{title}</div>}
          {children}
        </div>
      </div>
    );
  }
);
Alert.displayName = "Alert";

export const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("aui-alert-title", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

export const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("aui-alert-description", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";
