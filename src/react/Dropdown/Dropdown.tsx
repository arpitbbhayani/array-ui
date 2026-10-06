"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../utils/cn";
import { ChevronDownIcon, type IconProps } from "../Icons";

export interface DropdownChevronProps extends IconProps {}

export function DropdownChevron({
  className,
  size = 12,
  ...props
}: DropdownChevronProps) {
  return (
    <ChevronDownIcon
      size={size}
      className={cn("aui-dropdown-chevron", className)}
      {...props}
    />
  );
}

export interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  trigger: React.ReactNode;
  align?: "left" | "right";
  children: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      trigger,
      align = "right",
      children,
      className,
      isOpen: controlledOpen,
      onOpenChange,
      ...props
    },
    ref
  ) => {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : uncontrolledOpen;
    const containerRef = useRef<HTMLDivElement>(null);

    const toggle = () => {
      const next = !open;
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    };

    const close = () => {
      if (!isControlled) setUncontrolledOpen(false);
      onOpenChange?.(false);
    };

    useEffect(() => {
      if (!open) return;
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Node;
        if (containerRef.current && !containerRef.current.contains(target)) {
          close();
        }
      };
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          close();
        }
      };
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("click", handleClickOutside);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [open]);

    return (
      <div
        ref={(node) => {
          (containerRef as any).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as any).current = node;
        }}
        className={cn("aui-dropdown", open && "is-open", className)}
        {...props}
      >
        <div
          className="aui-dropdown-trigger"
          onClick={toggle}
          aria-haspopup="menu"
          aria-expanded={open}
        >
          {trigger}
        </div>
        {open && (
          <div
            className={cn(
              "aui-dropdown-menu",
              open && "is-open",
              align === "left" && "aui-dropdown-menu-left"
            )}
            role="menu"
          >
            {children}
          </div>
        )}
      </div>
    );
  }
);
Dropdown.displayName = "Dropdown";
