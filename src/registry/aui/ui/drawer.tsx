"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  side?: "left" | "right" | "bottom";
  size?: "sm" | "md" | "lg" | "xl" | "full";
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  closeOnBackdropClick?: boolean;
}

export function Drawer({
  isOpen,
  onClose,
  side = "right",
  size = "md",
  title,
  description,
  children,
  footer,
  className,
  closeOnBackdropClick = true,
}: DrawerProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const sizeClasses = {
    sm: side === "bottom" ? "h-[300px]" : "w-full sm:max-w-sm",
    md: side === "bottom" ? "h-[450px]" : "w-full sm:max-w-md",
    lg: side === "bottom" ? "h-[600px]" : "w-full sm:max-w-lg",
    xl: side === "bottom" ? "h-[750px]" : "w-full sm:max-w-xl",
    full: "w-screen h-screen",
  };

  const sideClasses = {
    right: "inset-y-0 right-0 border-l border-border",
    left: "inset-y-0 left-0 border-r border-border",
    bottom: "inset-x-0 bottom-0 border-t border-border max-h-[85vh]",
  };

  const node = (
    <div
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-[3px] animate-in fade-in-0"
      onClick={(e) => {
        if (closeOnBackdropClick && e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          "fixed bg-card text-card-foreground shadow-2xl flex flex-col overflow-hidden transition-all duration-300",
          sideClasses[side],
          sizeClasses[size],
          className
        )}
      >
        <div className="flex items-start justify-between px-6 py-5 border-b border-border">
          <div className="flex flex-col gap-1">
            {title && (
              <h3 className="font-heading font-semibold text-lg text-foreground">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <button
            type="button"
            className="w-7 h-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            onClick={onClose}
            aria-label="Close drawer"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto text-sm">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-2 px-6 py-4 bg-muted/30 border-t border-border">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(node, document.body)
    : null;
}

export const Sheet = Drawer;
