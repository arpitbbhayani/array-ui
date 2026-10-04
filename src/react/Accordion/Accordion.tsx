"use client";

import React, { createContext, useContext, useState } from "react";
import { cn } from "../../utils/cn";

export interface AccordionItemData {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
}

interface AccordionContextValue {
  openValues: string[];
  toggleValue: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: AccordionItemData[];
  type?: "single" | "multiple";
  collapsible?: boolean;
  allowMultiple?: boolean;
  defaultOpenIds?: string[];
  defaultValue?: string | string[];
}

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      items,
      type = "single",
      collapsible = true,
      allowMultiple = false,
      defaultOpenIds = [],
      defaultValue,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const isMultiple = type === "multiple" || allowMultiple;

    const initial = defaultValue
      ? Array.isArray(defaultValue)
        ? defaultValue
        : [defaultValue]
      : defaultOpenIds;

    const [openValues, setOpenValues] = useState<string[]>(initial);

    const toggleValue = (val: string) => {
      setOpenValues((prev) => {
        const isOpen = prev.includes(val);
        if (isMultiple) {
          return isOpen ? prev.filter((v) => v !== val) : [...prev, val];
        }
        if (isOpen) {
          return collapsible ? [] : prev;
        }
        return [val];
      });
    };

    if (!items && children) {
      return (
        <AccordionContext.Provider value={{ openValues, toggleValue }}>
          <div ref={ref} className={cn("aui-accordion", className)} {...props}>
            {children}
          </div>
        </AccordionContext.Provider>
      );
    }

    return (
      <div ref={ref} className={cn("aui-accordion", className)} {...props}>
        {items &&
          items.map((item) => {
            const isOpen = openValues.includes(item.id);
            return (
              <div
                key={item.id}
                className={cn("aui-accordion-item", isOpen && "is-open")}
              >
                <button
                  type="button"
                  className="aui-accordion-trigger"
                  onClick={() => toggleValue(item.id)}
                  aria-expanded={isOpen}
                >
                  <span>{item.title}</span>
                  <span className="aui-accordion-icon">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </button>
                <div className="aui-accordion-content">
                  <div className="aui-accordion-inner">{item.content}</div>
                </div>
              </div>
            );
          })}
      </div>
    );
  }
);
Accordion.displayName = "Accordion";

const AccordionItemContext = createContext<{ value: string; isOpen: boolean }>({
  value: "",
  isOpen: false,
});

export interface AccordionItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const AccordionItem = React.forwardRef<
  HTMLDivElement,
  AccordionItemProps
>(({ value, className, children, ...props }, ref) => {
  const context = useContext(AccordionContext);
  const isOpen = context?.openValues.includes(value) ?? false;

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <div
        ref={ref}
        className={cn("aui-accordion-item", isOpen && "is-open", className)}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
});
AccordionItem.displayName = "AccordionItem";

export const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, onClick, ...props }, ref) => {
  const accContext = useContext(AccordionContext);
  const itemContext = useContext(AccordionItemContext);

  return (
    <button
      ref={ref}
      type="button"
      className={cn("aui-accordion-trigger", className)}
      aria-expanded={itemContext.isOpen}
      onClick={(e) => {
        accContext?.toggleValue(itemContext.value);
        onClick?.(e);
      }}
      {...props}
    >
      <span>{children}</span>
      <span className="aui-accordion-icon">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
    </button>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

export const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const itemContext = useContext(AccordionItemContext);

  return (
    <div
      ref={ref}
      className={cn("aui-accordion-content", className)}
      style={{
        display: itemContext.isOpen ? "block" : "none",
      }}
      {...props}
    >
      <div className="aui-accordion-inner">{children}</div>
    </div>
  );
});
AccordionContent.displayName = "AccordionContent";
