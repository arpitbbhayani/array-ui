import * as React from "react";
import { cn } from "@/lib/utils";

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

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
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
        className={cn(
          "relative flex items-start gap-3 w-full max-w-sm p-4 rounded-lg border border-border bg-card text-card-foreground shadow-lg text-sm",
          variant === "success" && "border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
          variant === "warning" && "border-amber-500/30 text-amber-600 dark:text-amber-400",
          variant === "error" && "border-rose-500/30 text-rose-600 dark:text-rose-400",
          className
        )}
        {...props}
      >
        {!children && (
          <span
            className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-muted font-mono text-[11px] font-medium mt-[1px] shadow-[0_0_8px_currentColor]"
            aria-hidden="true"
          >
            {glyph[variant]}
          </span>
        )}
        <div className="flex-1 min-w-0">
          {title && <p className="font-heading font-semibold text-foreground text-sm leading-5">{title}</p>}
          {description && <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{description}</p>}
          {children}
        </div>
        {onClose && (
          <button
            type="button"
            className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-xs text-muted-foreground hover:text-foreground"
            onClick={onClose}
            aria-label="Dismiss"
          >
            ✕
          </button>
        )}
      </div>
    );
  }
);
Toast.displayName = "Toast";

export { Toast };
