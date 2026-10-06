"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../utils/cn";

export interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export function Popover({
  trigger,
  children,
  align = "start",
  side = "bottom",
  sideOffset = 6,
  isOpen: controlledIsOpen,
  onOpenChange,
  className,
}: PopoverProps) {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const open = isControlled ? controlledIsOpen : uncontrolledIsOpen;

  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const setOpen = (next: boolean) => {
    if (!isControlled) {
      setUncontrolledIsOpen(next);
    }
    onOpenChange?.(next);
  };

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const alignClass = `is-align-${align}`;
  const sideClass = `is-side-${side}`;

  return (
    <div
      ref={containerRef}
      className={cn("aui-popover-container", className)}
    >
      <div
        className="aui-popover-trigger"
        onClick={() => setOpen(!open)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(!open);
          }
        }}
      >
        {trigger}
      </div>

      {open && (
        <div
          ref={popoverRef}
          className={cn("aui-popover-content", alignClass, sideClass)}
          style={{
            marginTop: side === "bottom" ? `${sideOffset}px` : undefined,
            marginBottom: side === "top" ? `${sideOffset}px` : undefined,
            marginLeft: side === "right" ? `${sideOffset}px` : undefined,
            marginRight: side === "left" ? `${sideOffset}px` : undefined,
          }}
          role="dialog"
        >
          {children}
        </div>
      )}
    </div>
  );
}

export const PopoverTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("aui-popover-trigger", className)} {...props} />
));
PopoverTrigger.displayName = "PopoverTrigger";

export const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("aui-popover-content", className)} {...props} />
));
PopoverContent.displayName = "PopoverContent";
