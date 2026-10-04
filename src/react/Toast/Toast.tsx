import React from "react";
import { CloseIcon } from "../Icons";
import { cn } from "../../utils/cn";

export type ToastVariant = "default" | "success" | "error" | "warning" | "info";

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  onClose?: () => void;
}

const glyph: Record<ToastVariant, string> = {
  default: "i",
  info: "i",
  success: "✓",
  warning: "!",
  error: "×",
};

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      title,
      description,
      variant = "default",
      onClose,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role="status"
        className={cn("aui-toast", `aui-toast-${variant}`, className)}
        {...props}
      >
        {!children && (
          <span className="aui-toast-icon" aria-hidden="true">
            {glyph[variant]}
          </span>
        )}
        <div className="aui-toast-body">
          {title && <p className="aui-toast-title">{title}</p>}
          {description && <p className="aui-toast-desc">{description}</p>}
          {children}
        </div>
        {onClose && (
          <button
            type="button"
            className="aui-toast-close"
            onClick={onClose}
            aria-label="Dismiss"
          >
            <CloseIcon size={14} />
          </button>
        )}
      </div>
    );
  }
);
Toast.displayName = "Toast";

export const ToastTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("aui-toast-title", className)} {...props} />
));
ToastTitle.displayName = "ToastTitle";

export const ToastDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("aui-toast-desc", className)} {...props} />
));
ToastDescription.displayName = "ToastDescription";

export const ToastStack = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("aui-toast-stack", className)}
    aria-live="polite"
    {...props}
  >
    {children}
  </div>
));
ToastStack.displayName = "ToastStack";
