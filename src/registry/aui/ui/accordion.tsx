import * as React from "react";
import { cn } from "@/lib/utils";

interface AccordionContextValue {
  openItems: string[];
  toggleItem: (id: string) => void;
}

const AccordionContext = React.createContext<AccordionContextValue | undefined>(undefined);

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  defaultValue?: string | string[];
}

export function Accordion({
  type = "single",
  defaultValue,
  children,
  className,
  ...props
}: AccordionProps) {
  const [openItems, setOpenItems] = React.useState<string[]>(() => {
    if (!defaultValue) return [];
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const isOpen = prev.includes(id);
      if (type === "single") {
        return isOpen ? [] : [id];
      }
      return isOpen ? prev.filter((i) => i !== id) : [...prev, id];
    });
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={cn("divide-y divide-border border-y border-border", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function AccordionItem({ value, className, children, ...props }: AccordionItemProps) {
  return (
    <div className={cn(className)} data-value={value} {...props}>
      {children}
    </div>
  );
}

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export function AccordionTrigger({ value, className, children, ...props }: AccordionTriggerProps) {
  const ctx = React.useContext(AccordionContext);
  const isOpen = ctx?.openItems.includes(value);

  return (
    <button
      type="button"
      onClick={() => ctx?.toggleItem(value)}
      className={cn(
        "flex flex-1 items-center justify-between py-2.5 text-sm font-semibold text-foreground transition-all hover:text-primary cursor-pointer w-full text-left",
        className
      )}
      {...props}
    >
      <span>{children}</span>
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("shrink-0 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180 text-foreground")}
        aria-hidden="true"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
}

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function AccordionContent({ value, className, children, ...props }: AccordionContentProps) {
  const ctx = React.useContext(AccordionContext);
  const isOpen = ctx?.openItems.includes(value);

  if (!isOpen) return null;

  return (
    <div className={cn("pb-2.5 pt-0.5 text-sm text-muted-foreground leading-relaxed", className)} {...props}>
      {children}
    </div>
  );
}
