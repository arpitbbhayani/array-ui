"use client";

import React, { useState, useEffect } from "react";
import { cn } from "../../utils/cn";

export interface DevToolbarItem {
  name: string;
  label: string;
  port?: number | string;
  path?: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode;
  accent?: string;
  target?: string;
}

export interface DevToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: DevToolbarItem[];
  hostname?: string;
  badgeLabel?: string;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  position?: "bottom-center" | "bottom-right" | "bottom-left";
  storageKey?: string;
  children?: React.ReactNode;
}

export const DevToolbar = React.forwardRef<HTMLDivElement, DevToolbarProps>(
  (
    {
      items = [],
      hostname = "localhost",
      badgeLabel = "DEV",
      collapsed: controlledCollapsed,
      defaultCollapsed = false,
      onCollapsedChange,
      position = "bottom-center",
      storageKey,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);

    useEffect(() => {
      if (storageKey && typeof window !== "undefined") {
        const saved = localStorage.getItem(storageKey);
        if (saved !== null) {
          setInternalCollapsed(saved === "true");
        }
      }
    }, [storageKey]);

    const isCollapsed =
      controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

    const toggleCollapse = () => {
      const next = !isCollapsed;
      if (controlledCollapsed === undefined) {
        setInternalCollapsed(next);
      }
      if (storageKey && typeof window !== "undefined") {
        localStorage.setItem(storageKey, String(next));
      }
      onCollapsedChange?.(next);
    };

    const positionClass =
      position === "bottom-right"
        ? "aui-dev-toolbar-right"
        : position === "bottom-left"
        ? "aui-dev-toolbar-left"
        : "aui-dev-toolbar-center";

    if (isCollapsed) {
      return (
        <div className={cn("aui-dev-toolbar-fixed aui-dev-toolbar-right", className)}>
          <button
            type="button"
            onClick={toggleCollapse}
            className="aui-dev-toolbar-collapsed-btn"
            title={`Expand ${badgeLabel} toolbar`}
          >
            <span className="aui-dev-toolbar-badge-dot aui-pulse" />
            <span>{badgeLabel} DASHBOARDS</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn("aui-dev-toolbar-fixed", positionClass, className)}
        {...props}
      >
        <div className="aui-dev-toolbar">
          {/* Badge */}
          {badgeLabel && (
            <div className="aui-dev-toolbar-badge">
              <span className="aui-dev-toolbar-badge-dot aui-pulse" />
              <span>{badgeLabel}</span>
            </div>
          )}

          {/* Items */}
          <div className="aui-dev-toolbar-items">
            {items.map((item) => {
              const url =
                item.href ||
                (item.port
                  ? `http://${hostname}:${item.port}${item.path || ""}`
                  : item.path || "#");

              const renderIcon = () => {
                if (!item.icon) return null;
                if (React.isValidElement(item.icon)) return item.icon;
                try {
                  const IconComp = item.icon as React.ComponentType<{ className?: string }>;
                  return <IconComp className={cn("aui-dev-toolbar-item-icon", item.accent)} />;
                } catch {
                  return null;
                }
              };

              return (
                <a
                  key={item.name || item.label}
                  href={url}
                  target={item.target || "_blank"}
                  rel="noopener noreferrer"
                  className="aui-dev-toolbar-item"
                  title={`${item.label} (${url})`}
                >
                  {renderIcon()}
                  <span className="aui-dev-toolbar-item-label">{item.label}</span>
                  {item.port && (
                    <span className="aui-dev-toolbar-item-port">:{item.port}</span>
                  )}
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="aui-dev-toolbar-external-icon"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              );
            })}
            {children}
          </div>

          <div className="aui-dev-toolbar-divider" />

          {/* Collapse Toggle */}
          <button
            type="button"
            onClick={toggleCollapse}
            className="aui-dev-toolbar-toggle"
            title="Minimize toolbar"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>
    );
  }
);

DevToolbar.displayName = "DevToolbar";
