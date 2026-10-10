"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SideNavBrandData {
  logo?: React.ReactNode;
  name: React.ReactNode;
  subtitle?: React.ReactNode;
  href?: string;
  badge?: React.ReactNode;
}

export interface SideNavItemData {
  id?: string;
  label: string;
  href?: string;
  icon?: React.ReactNode | React.ComponentType<{ className?: string }>;
  active?: boolean;
  badge?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  external?: boolean;
}

export interface SideNavGroupData {
  title?: string;
  items: SideNavItemData[];
}

export interface SideNavUserData {
  name: string;
  email?: string;
  avatar?: string;
  initials?: string;
  role?: string;
  href?: string;
}

export interface SideNavProps extends React.HTMLAttributes<HTMLElement> {
  side?: "left" | "right";
  fixed?: boolean;
  sticky?: boolean;
  collapsed?: boolean;
  brand?: SideNavBrandData;
  items?: SideNavItemData[];
  groups?: SideNavGroupData[];
  user?: SideNavUserData;
  onLogout?: () => void;
  logoutHref?: string;
  logoutLabel?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

function renderItemIcon(icon: React.ReactNode | React.ComponentType<{ className?: string }>) {
  if (!icon) return null;
  if (React.isValidElement(icon)) {
    return <span className="inline-flex items-center justify-center w-4 h-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground">{icon}</span>;
  }
  if (typeof icon === "function") {
    const IconComponent = icon as React.ComponentType<{ className?: string }>;
    return (
      <span className="inline-flex items-center justify-center w-4 h-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground">
        <IconComponent />
      </span>
    );
  }
  return <span className="inline-flex items-center justify-center w-4 h-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground">{icon}</span>;
}

export const SideNav = React.forwardRef<HTMLElement, SideNavProps>(
  (
    {
      side = "left",
      fixed = false,
      sticky = false,
      collapsed = false,
      brand,
      items,
      groups,
      user,
      onLogout,
      logoutHref,
      logoutLabel = "Log out",
      header,
      footer,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const menuGroups: SideNavGroupData[] = groups
      ? groups
      : items
      ? [{ items }]
      : [];

    return (
      <nav
        ref={ref}
        className={cn(
          "flex flex-col bg-card text-card-foreground transition-all duration-200 z-40",
          collapsed ? "w-[68px] min-w-[68px]" : "w-[260px] min-w-[260px]",
          side === "right" ? "border-l border-border" : "border-r border-border",
          fixed && cn("fixed top-0 bottom-0", side === "right" ? "right-0" : "left-0"),
          sticky && "sticky top-0 max-h-screen",
          "h-full min-h-screen",
          className
        )}
        aria-label="Side Navigation"
        {...props}
      >
        {/* Header / Brand */}
        {header ? (
          <div className="p-4 border-b border-border min-h-[64px] flex items-center">{header}</div>
        ) : brand ? (
          <div className="p-4 border-b border-border min-h-[64px] flex items-center">
            <a
              href={brand.href || "/"}
              className="flex items-center gap-3 no-underline text-foreground min-w-0 flex-1"
              title={typeof brand.name === "string" ? brand.name : undefined}
            >
              {brand.logo && (
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary border border-border shrink-0 overflow-hidden font-bold text-sm">
                  {brand.logo}
                </div>
              )}
              {!collapsed && (
                <div className="flex flex-col min-w-0 overflow-hidden">
                  <div className="font-heading text-sm font-bold leading-tight text-foreground truncate flex items-center gap-1.5">
                    {brand.name}
                    {brand.badge && (
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">
                        {brand.badge}
                      </span>
                    )}
                  </div>
                  {brand.subtitle && (
                    <div className="text-xs text-muted-foreground truncate mt-0.5">
                      {brand.subtitle}
                    </div>
                  )}
                </div>
              )}
            </a>
          </div>
        ) : null}

        {/* Body / Vertical Tab Menu */}
        <div className="flex-1 overflow-y-auto px-2.5 py-4 flex flex-col gap-5" role="tablist">
          {menuGroups.length > 0
            ? menuGroups.map((group, gi) => (
                <div key={gi} className="flex flex-col gap-0.5">
                  {group.title && !collapsed && (
                    <p className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground px-2.5 py-1 m-0">
                      {group.title}
                    </p>
                  )}
                  {group.items.map((item, ii) => {
                    const itemKey = item.id || `${gi}-${ii}`;
                    const content = (
                      <>
                        {item.active ? (
                          <span className="inline-flex items-center justify-center w-4 h-4 shrink-0 text-primary">
                            {renderItemIcon(item.icon)}
                          </span>
                        ) : (
                          renderItemIcon(item.icon)
                        )}
                        {!collapsed && (
                          <span className="flex-1 truncate">{item.label}</span>
                        )}
                        {!collapsed && item.badge && (
                          <span className="ml-auto font-mono text-[11px] px-1.5 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">
                            {item.badge}
                          </span>
                        )}
                      </>
                    );

                    const baseClasses = cn(
                      "group relative flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer w-full text-left no-underline",
                      item.active
                        ? cn(
                            "bg-muted/60 text-foreground font-semibold",
                            side === "left" && "before:absolute before:left-0 before:top-[15%] before:bottom-[15%] before:w-1 before:bg-primary before:rounded-r",
                            side === "right" && "after:absolute after:right-0 after:top-[15%] after:bottom-[15%] after:w-1 after:bg-primary after:rounded-l"
                          )
                        : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                      item.disabled && "opacity-50 cursor-not-allowed pointer-events-none"
                    );

                    if (item.href) {
                      return (
                        <a
                          key={itemKey}
                          href={item.disabled ? undefined : item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noopener noreferrer" : undefined}
                          role="tab"
                          aria-selected={item.active}
                          title={collapsed ? item.label : undefined}
                          onClick={item.onClick}
                          className={baseClasses}
                        >
                          {content}
                        </a>
                      );
                    }

                    return (
                      <button
                        key={itemKey}
                        type="button"
                        role="tab"
                        aria-selected={item.active}
                        disabled={item.disabled}
                        title={collapsed ? item.label : undefined}
                        onClick={item.onClick}
                        className={baseClasses}
                      >
                        {content}
                      </button>
                    );
                  })}
                </div>
              ))
            : children}
        </div>

        {/* Footer / Profile & Logout */}
        {footer ? (
          <div className="p-3 border-t border-border bg-card">{footer}</div>
        ) : user || onLogout || logoutHref ? (
          <div className="p-3 border-t border-border bg-card">
            <div className="flex items-center justify-between gap-2 p-1.5 rounded-md hover:bg-muted/40 transition-colors">
              {user && (
                <a
                  href={user.href || "#"}
                  className="flex items-center gap-2.5 min-w-0 flex-1 no-underline text-foreground"
                  title={user.name}
                >
                  <div className="w-8 h-8 rounded-md border border-border bg-muted text-foreground flex items-center justify-center font-semibold text-xs shrink-0 overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.initials || user.name.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  {!collapsed && (
                    <div className="flex flex-col min-w-0 overflow-hidden">
                      <div className="text-xs font-semibold text-foreground truncate leading-tight">
                        {user.name}
                      </div>
                      {user.email ? (
                        <div className="text-[11px] text-muted-foreground truncate mt-0.5">
                          {user.email}
                        </div>
                      ) : user.role ? (
                        <div className="text-[11px] text-muted-foreground truncate mt-0.5">
                          {user.role}
                        </div>
                      ) : null}
                    </div>
                  )}
                </a>
              )}

              {(onLogout || logoutHref) && (
                logoutHref ? (
                  <a
                    href={logoutHref}
                    className="inline-flex items-center justify-center w-7 h-7 rounded text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0"
                    title={logoutLabel}
                    aria-label={logoutLabel}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                  </a>
                ) : (
                  <button
                    type="button"
                    className="inline-flex items-center justify-center w-7 h-7 rounded text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0"
                    title={logoutLabel}
                    aria-label={logoutLabel}
                    onClick={onLogout}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                  </button>
                )
              )}
            </div>
          </div>
        ) : null}
      </nav>
    );
  }
);

SideNav.displayName = "SideNav";

export const SideNavHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 border-b border-border min-h-[64px] flex items-center", className)} {...props} />
));
SideNavHeader.displayName = "SideNavHeader";

export const SideNavBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex-1 overflow-y-auto px-2.5 py-4 flex flex-col gap-5", className)} {...props} />
));
SideNavBody.displayName = "SideNavBody";

export const SideNavFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-3 border-t border-border bg-card", className)} {...props} />
));
SideNavFooter.displayName = "SideNavFooter";
