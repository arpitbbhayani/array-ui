"use client";

import React from "react";
import { cn } from "../../utils/cn";
import { LogOutIcon } from "../Icons";

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
    return <span className="aui-sidenav-item-icon">{icon}</span>;
  }
  if (typeof icon === "function") {
    const IconComponent = icon as React.ComponentType<{ className?: string }>;
    return (
      <span className="aui-sidenav-item-icon">
        <IconComponent />
      </span>
    );
  }
  return <span className="aui-sidenav-item-icon">{icon}</span>;
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
    // Normalize items vs groups
    const menuGroups: SideNavGroupData[] = groups
      ? groups
      : items
      ? [{ items }]
      : [];

    return (
      <nav
        ref={ref}
        className={cn(
          "aui-sidenav",
          side === "right" ? "aui-sidenav-right" : "aui-sidenav-left",
          fixed && "aui-sidenav-fixed",
          sticky && "aui-sidenav-sticky",
          collapsed && "aui-sidenav-collapsed",
          className
        )}
        aria-label="Side Navigation"
        {...props}
      >
        {/* Header / Brand */}
        {header ? (
          <div className="aui-sidenav-header">{header}</div>
        ) : brand ? (
          <div className="aui-sidenav-header">
            <a
              href={brand.href || "/"}
              className="aui-sidenav-brand"
              title={typeof brand.name === "string" ? brand.name : undefined}
            >
              {brand.logo && <div className="aui-sidenav-logo">{brand.logo}</div>}
              {!collapsed && (
                <div className="aui-sidenav-brand-meta">
                  <div className="aui-sidenav-brand-title">
                    {brand.name}
                    {brand.badge && (
                      <span className="aui-sidenav-item-badge" style={{ marginLeft: "0.4rem" }}>
                        {brand.badge}
                      </span>
                    )}
                  </div>
                  {brand.subtitle && (
                    <div className="aui-sidenav-brand-subtitle">{brand.subtitle}</div>
                  )}
                </div>
              )}
            </a>
          </div>
        ) : null}

        {/* Body / Vertical Tab Menu */}
        <div className="aui-sidenav-body" role="tablist">
          {menuGroups.length > 0
            ? menuGroups.map((group, gi) => (
                <div key={gi} className="aui-sidenav-group">
                  {group.title && !collapsed && (
                    <p className="aui-sidenav-group-title">{group.title}</p>
                  )}
                  {group.items.map((item, ii) => {
                    const itemKey = item.id || `${gi}-${ii}`;
                    const content = (
                      <>
                        {renderItemIcon(item.icon)}
                        {!collapsed && (
                          <span className="aui-sidenav-item-label">{item.label}</span>
                        )}
                        {!collapsed && item.badge && (
                          <span className="aui-sidenav-item-badge">{item.badge}</span>
                        )}
                      </>
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
                          className={cn(
                            "aui-sidenav-item",
                            item.active && "is-active",
                            item.disabled && "is-disabled"
                          )}
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
                        className={cn(
                          "aui-sidenav-item",
                          item.active && "is-active",
                          item.disabled && "is-disabled"
                        )}
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
          <div className="aui-sidenav-footer">{footer}</div>
        ) : user || onLogout || logoutHref ? (
          <div className="aui-sidenav-footer">
            <div className="aui-sidenav-profile">
              {user && (
                <a
                  href={user.href || "#"}
                  className="aui-sidenav-profile-info"
                  title={user.name}
                >
                  <div className="aui-sidenav-avatar">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      user.initials || user.name.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  {!collapsed && (
                    <div className="aui-sidenav-profile-text">
                      <div className="aui-sidenav-profile-name">{user.name}</div>
                      {user.email ? (
                        <div className="aui-sidenav-profile-email">{user.email}</div>
                      ) : user.role ? (
                        <div className="aui-sidenav-profile-email">{user.role}</div>
                      ) : null}
                    </div>
                  )}
                </a>
              )}

              {(onLogout || logoutHref) && (
                logoutHref ? (
                  <a
                    href={logoutHref}
                    className="aui-sidenav-logout-btn"
                    title={logoutLabel}
                    aria-label={logoutLabel}
                  >
                    <LogOutIcon size={16} />
                  </a>
                ) : (
                  <button
                    type="button"
                    className="aui-sidenav-logout-btn"
                    title={logoutLabel}
                    aria-label={logoutLabel}
                    onClick={onLogout}
                  >
                    <LogOutIcon size={16} />
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
  <div ref={ref} className={cn("aui-sidenav-header", className)} {...props} />
));
SideNavHeader.displayName = "SideNavHeader";

export const SideNavBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("aui-sidenav-body", className)} {...props} />
));
SideNavBody.displayName = "SideNavBody";

export const SideNavFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("aui-sidenav-footer", className)} {...props} />
));
SideNavFooter.displayName = "SideNavFooter";

export const SideNavGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("aui-sidenav-group", className)} {...props} />
));
SideNavGroup.displayName = "SideNavGroup";
