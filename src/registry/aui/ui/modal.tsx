"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export interface ModalProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  isOpen?: boolean;
  open?: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  footer?: React.ReactNode;
  closeOnBackdropClick?: boolean;
}

export function Modal({
  isOpen,
  open,
  onClose,
  title,
  children,
  footer,
  className,
  closeOnBackdropClick = true,
  ...props
}: ModalProps) {
  const isVisible = open !== undefined ? open : Boolean(isOpen);
  const [mounted, setMounted] = React.useState(false);
  const modalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose?.();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isVisible, onClose]);

  if (!isVisible || !mounted) return null;

  const modalNode = (
    <div
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-[3px] flex items-center justify-center p-4 animate-in fade-in-0"
      onClick={(e) => {
        if (closeOnBackdropClick && e.target === e.currentTarget) {
          onClose?.();
        }
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className={cn(
          "w-full max-w-md bg-card text-card-foreground border border-border rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95",
          className
        )}
        tabIndex={-1}
        {...props}
      >
        {(title || onClose) && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            {title && (
              <h3 className="font-heading font-semibold text-lg text-foreground">
                {title}
              </h3>
            )}
            {onClose && (
              <button
                type="button"
                className="w-7 h-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer ml-auto"
                onClick={onClose}
                aria-label="Close dialog"
              >
                ✕
              </button>
            )}
          </div>
        )}

        <div className="p-5 text-sm">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-2 px-5 py-3 bg-muted/30 border-t border-border">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(modalNode, document.body)
    : null;
}
