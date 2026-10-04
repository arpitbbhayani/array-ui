"use client";

import React, { createContext, useContext, useState } from "react";
import { cn } from "../../utils/cn";

export interface TabItem {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
}

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export interface TabsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  tabs?: TabItem[];
  defaultTabId?: string;
  activeTabId?: string;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  onChange?: (id: string) => void;
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      tabs,
      defaultTabId,
      activeTabId,
      defaultValue,
      value: controlledValue,
      onValueChange,
      onChange,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const initial =
      defaultValue ||
      defaultTabId ||
      (tabs && tabs[0] ? tabs[0].id : "");

    const [selected, setSelected] = useState(initial);
    const activeValue =
      controlledValue !== undefined
        ? controlledValue
        : activeTabId !== undefined
        ? activeTabId
        : selected;

    const handleSelect = (val: string) => {
      if (controlledValue === undefined && activeTabId === undefined) {
        setSelected(val);
      }
      onValueChange?.(val);
      onChange?.(val);
    };

    // If compound children are provided (shadcn style)
    if (!tabs && children) {
      return (
        <TabsContext.Provider value={{ value: activeValue, onValueChange: handleSelect }}>
          <div ref={ref} className={cn("aui-tabs", className)} {...props}>
            {children}
          </div>
        </TabsContext.Provider>
      );
    }

    // Array-based mode (aui style)
    return (
      <div ref={ref} className={cn("aui-tabs", className)} {...props}>
        {tabs && (
          <ul className="aui-tabs-list" role="tablist">
            {tabs.map((tab) => {
              const isActive = tab.id === activeValue;
              return (
                <li key={tab.id}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={cn("aui-tab-trigger", isActive && "is-active")}
                    onClick={() => handleSelect(tab.id)}
                  >
                    {tab.label}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {tabs &&
          tabs.map((tab) => {
            const isActive = tab.id === activeValue;
            return (
              <div
                key={tab.id}
                role="tabpanel"
                className={cn("aui-tab-panel", isActive && "is-active")}
              >
                {tab.content}
              </div>
            );
          })}
      </div>
    );
  }
);
Tabs.displayName = "Tabs";

export const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="tablist"
    className={cn("aui-tabs-list", className)}
    {...props}
  />
));
TabsList.displayName = "TabsList";

export interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  TabsTriggerProps
>(({ value, className, onClick, ...props }, ref) => {
  const context = useContext(TabsContext);
  const isActive = context?.value === value;

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={isActive}
      className={cn("aui-tab-trigger", isActive && "is-active", className)}
      onClick={(e) => {
        context?.onValueChange(value);
        onClick?.(e);
      }}
      {...props}
    />
  );
});
TabsTrigger.displayName = "TabsTrigger";

export interface TabsContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent = React.forwardRef<
  HTMLDivElement,
  TabsContentProps
>(({ value, className, children, ...props }, ref) => {
  const context = useContext(TabsContext);
  const isActive = context?.value === value;

  if (!isActive) return null;

  return (
    <div
      ref={ref}
      role="tabpanel"
      className={cn("aui-tab-panel is-active", className)}
      {...props}
    >
      {children}
    </div>
  );
});
TabsContent.displayName = "TabsContent";
