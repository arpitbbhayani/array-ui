"use client";

import React, { useEffect, useRef, useState, useId } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "../Icons";
import { cn } from "../../utils/cn";

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
  const [mounted, setMounted] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const generatedId = useId();
  const titleId = `aui-drawer-title-${generatedId}`;
  const descId = `aui-drawer-desc-${generatedId}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    previousActiveElement.current = document.activeElement as HTMLElement | null;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose?.();
        return;
      }

      if (e.key === "Tab" && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      if (drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length > 0) {
          focusable[0].focus();
        } else {
          drawerRef.current.focus();
        }
      }
    }, 20);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      if (
        previousActiveElement.current &&
        typeof previousActiveElement.current.focus === "function"
      ) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const drawerNode = (
    <div
      className="aui-drawer-backdrop"
      onClick={(e) => {
        if (closeOnBackdropClick && e.target === e.currentTarget) {
          onClose?.();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descId : undefined}
    >
      <div
        ref={drawerRef}
        className={cn(
          "aui-drawer",
          `aui-drawer-${side}`,
          `aui-drawer-${size}`,
          className
        )}
        tabIndex={-1}
      >
        <div className="aui-drawer-header">
          <div className="aui-drawer-header-text">
            {title && (
              <h3 id={titleId} className="aui-drawer-title">
                {title}
              </h3>
            )}
            {description && (
              <p id={descId} className="aui-drawer-description">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            className="aui-drawer-close"
            onClick={onClose}
            aria-label="Close panel"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="aui-drawer-content">{children}</div>

        {footer && <div className="aui-drawer-footer">{footer}</div>}
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(drawerNode, document.body)
    : null;
}

export const DrawerHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("aui-drawer-header", className)} {...props} />
));
DrawerHeader.displayName = "DrawerHeader";

export const DrawerTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("aui-drawer-title", className)} {...props} />
));
DrawerTitle.displayName = "DrawerTitle";

export const DrawerDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("aui-drawer-description", className)}
    {...props}
  />
));
DrawerDescription.displayName = "DrawerDescription";

export const DrawerContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("aui-drawer-content", className)} {...props} />
));
DrawerContent.displayName = "DrawerContent";

export const DrawerFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("aui-drawer-footer", className)} {...props} />
));
DrawerFooter.displayName = "DrawerFooter";

// Aliases for Sheet
export const Sheet = Drawer;
export const SheetHeader = DrawerHeader;
export const SheetTitle = DrawerTitle;
export const SheetDescription = DrawerDescription;
export const SheetContent = DrawerContent;
export const SheetFooter = DrawerFooter;
