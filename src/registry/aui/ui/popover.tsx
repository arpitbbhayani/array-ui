"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

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
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = React.useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const open = isControlled ? controlledIsOpen : uncontrolledIsOpen;

  const containerRef = React.useRef<HTMLDivElement>(null);

  const setOpen = (next: boolean) => {
    if (!isControlled) {
      setUncontrolledIsOpen(next);
    }
    onOpenChange?.(next);
  };

  React.useEffect(() => {
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
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const alignClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  };

  const sideClasses = {
    bottom: "top-full mt-1.5",
    top: "bottom-full mb-1.5",
    left: "right-full mr-1.5 top-0",
    right: "left-full ml-1.5 top-0",
  };

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)}>
      <div
        onClick={() => setOpen(!open)}
        role="button"
        tabIndex={0}
        className="inline-block cursor-pointer"
      >
        {trigger}
      </div>

      {open && (
        <div
          className={cn(
            "absolute z-50 rounded-md border border-border bg-popover text-popover-foreground shadow-md outline-hidden p-4 animate-in fade-in-0 zoom-in-95",
            alignClasses[align],
            sideClasses[side]
          )}
          style={{
            marginTop: side === "bottom" ? `${sideOffset}px` : undefined,
          }}
          role="dialog"
        >
          {children}
        </div>
      )}
    </div>
  );
}
