"use client";

import React, { useState } from "react";
import { cn } from "../../utils/cn";
import { Dropdown } from "../Dropdown";
import { ThemeToggle } from "../Theme/ThemeToggle";
import { LogOutIcon, UserIcon, ChevronDownIcon, MenuIcon, XIcon } from "../Icons";

export interface TopNavBrandData {
  logo?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  href?: string;
}

export interface TopNavDropdownItem {
  id?: string;
  label: string;
  href?: string;
  description?: string;
  icon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  divider?: boolean;
  destructive?: boolean;
}

export interface TopNavLinkData {
  id?: string;
  label: string;
  href?: string;
  active?: boolean;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  items?: TopNavDropdownItem[]; // If provided, renders dropdown
  onClick?: () => void;
  disabled?: boolean;
  external?: boolean;
}

export interface TopNavUserData {
  name: string;
  email?: string;
  avatar?: string;
  initials?: string;
  role?: string;
  href?: string;
}

export interface TopNavUserMenuItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  divider?: boolean;
  destructive?: boolean;
}

export interface TopNavProps extends React.HTMLAttributes<HTMLElement> {
  brand?: TopNavBrandData;
  links?: TopNavLinkData[];
  rightActions?: React.ReactNode;
  user?: TopNavUserData;
  userMenuItems?: TopNavUserMenuItem[];
  onLogout?: () => void;
  logoutLabel?: string;
  showThemeToggle?: boolean;
  sticky?: boolean;
  maxWidth?: "xl" | "lg" | "full";
}

export const TopNav = React.forwardRef<HTMLElement, TopNavProps>(
  (
    {
      brand,
      links = [],
      rightActions,
      user,
      userMenuItems,
      onLogout,
      logoutLabel = "Log out",
      showThemeToggle = true,
      sticky = true,
      maxWidth = "xl",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const containerMaxWidthClass =
      maxWidth === "full"
        ? "aui-topnav-container-full"
        : maxWidth === "lg"
        ? "aui-topnav-container-lg"
        : "aui-topnav-container-xl";

    return (
      <header
        ref={ref}
        className={cn(
          "aui-topnav",
          sticky && "aui-topnav-sticky",
          className
        )}
        {...props}
      >
        <div className={cn("aui-topnav-container", containerMaxWidthClass)}>
          {/* Left section: Brand and links */}
          <div className="aui-topnav-left">
            {brand && (
              <a
                href={brand.href || "/"}
                className="aui-topnav-brand"
              >
                {brand.logo && (
                  <span className="aui-topnav-logo">
                    {brand.logo}
                  </span>
                )}
                <div className="aui-topnav-brand-meta">
                  <span className="aui-topnav-title">{brand.title}</span>
                  {brand.subtitle && (
                    <span className="aui-topnav-subtitle">{brand.subtitle}</span>
                  )}
                </div>
                {brand.badge && (
                  <span style={{ marginLeft: "0.25rem" }}>{brand.badge}</span>
                )}
              </a>
            )}

            {/* Desktop Navigation Links */}
            {links.length > 0 && (
              <nav className="aui-topnav-links" aria-label="Main Navigation">
                {links.map((link, idx) => {
                  if (link.items && link.items.length > 0) {
                    return (
                      <Dropdown
                        key={link.id || idx}
                        align="left"
                        trigger={
                          <button
                            type="button"
                            className={cn(
                              "aui-topnav-link",
                              link.active && "is-active"
                            )}
                          >
                            {link.icon && <span>{link.icon}</span>}
                            <span>{link.label}</span>
                            <ChevronDownIcon size={13} style={{ opacity: 0.6 }} />
                          </button>
                        }
                      >
                        <div className="aui-dropdown-header">{link.label}</div>
                        {link.items.map((sub, sIdx) => {
                          if (sub.divider) {
                            return <div key={sIdx} className="aui-dropdown-divider" />;
                          }
                          const Component = sub.href ? "a" : "button";
                          return (
                            <Component
                              key={sub.id || sIdx}
                              href={sub.href}
                              onClick={sub.onClick}
                              className={cn(
                                "aui-topnav-dropdown-card",
                                sub.active && "is-active",
                                sub.destructive && "is-destructive"
                              )}
                            >
                              {sub.icon && <span className="aui-topnav-dropdown-icon">{sub.icon}</span>}
                              <div className="aui-topnav-dropdown-content">
                                <span className="aui-topnav-dropdown-title">{sub.label}</span>
                                {sub.description && (
                                  <span className="aui-topnav-dropdown-desc">
                                    {sub.description}
                                  </span>
                                )}
                              </div>
                            </Component>
                          );
                        })}
                      </Dropdown>
                    );
                  }

                  const Comp = link.href ? "a" : "button";
                  return (
                    <Comp
                      key={link.id || idx}
                      href={link.href}
                      onClick={link.onClick}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className={cn(
                        "aui-topnav-link",
                        link.active && "is-active"
                      )}
                    >
                      {link.icon && <span>{link.icon}</span>}
                      <span>{link.label}</span>
                      {link.badge && <span>{link.badge}</span>}
                    </Comp>
                  );
                })}
              </nav>
            )}

            {children}
          </div>

          {/* Right section: Actions, Theme selector, User menu, Burger */}
          <div className="aui-topnav-right">
            {rightActions}

            {showThemeToggle && <ThemeToggle size={18} />}

            {user && (
              <Dropdown
                align="right"
                trigger={
                  <button
                    type="button"
                    className="aui-topnav-user-trigger"
                    aria-label={`User menu for ${user.name}`}
                  >
                    <div className="aui-topnav-user-avatar">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        user.initials || user.name.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <span className="aui-topnav-user-name">{user.name}</span>
                    <ChevronDownIcon size={12} style={{ opacity: 0.6 }} />
                  </button>
                }
              >
                <div className="aui-topnav-user-header">
                  <span className="aui-topnav-user-header-name">{user.name}</span>
                  {user.email && (
                    <span className="aui-topnav-user-header-email">{user.email}</span>
                  )}
                </div>

                {userMenuItems && userMenuItems.length > 0 ? (
                  userMenuItems.map((item, idx) => {
                    if (item.divider) {
                      return <div key={idx} className="aui-dropdown-divider" />;
                    }
                    const Comp = item.href ? "a" : "button";
                    return (
                      <Comp
                        key={idx}
                        href={item.href}
                        onClick={item.onClick}
                        className={cn(
                          "aui-dropdown-item",
                          item.destructive && "is-destructive"
                        )}
                        style={{ padding: "0.55rem 0.85rem", gap: "0.65rem" }}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Comp>
                    );
                  })
                ) : (
                  <>
                    <a
                      href={user.href || "#"}
                      className="aui-dropdown-item"
                      style={{ padding: "0.55rem 0.85rem", gap: "0.65rem" }}
                    >
                      <UserIcon size={14} />
                      <span>Account Settings</span>
                    </a>
                  </>
                )}

                {(onLogout || logoutLabel) && (
                  <>
                    <div className="aui-dropdown-divider" />
                    <button
                      type="button"
                      onClick={onLogout}
                      className="aui-dropdown-item is-destructive"
                      style={{ padding: "0.55rem 0.85rem", gap: "0.65rem" }}
                    >
                      <LogOutIcon size={14} />
                      <span>{logoutLabel}</span>
                    </button>
                  </>
                )}
              </Dropdown>
            )}

            {/* Mobile burger toggle button */}
            <button
              type="button"
              className="aui-topnav-burger"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <XIcon size={18} /> : <MenuIcon size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu collapsible drawer */}
        <div
          className={cn(
            "aui-topnav-mobile-menu",
            mobileOpen && "is-open"
          )}
        >
          {links.map((link, idx) => (
            <div key={link.id || idx} className="aui-topnav-mobile-section">
              <a
                href={link.href || "#"}
                onClick={link.onClick}
                className={cn(
                  "aui-topnav-mobile-link",
                  link.active && "is-active"
                )}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  {link.icon}
                  {link.label}
                </span>
                {link.badge}
              </a>
              {link.items && link.items.length > 0 && (
                <div className="aui-topnav-mobile-subgroup">
                  {link.items.map((sub, sIdx) => {
                    if (sub.divider) return null;
                    return (
                      <a
                        key={sub.id || sIdx}
                        href={sub.href || "#"}
                        onClick={sub.onClick}
                        className={cn(
                          "aui-topnav-mobile-sublink",
                          sub.active && "is-active"
                        )}
                      >
                        <span className="aui-topnav-mobile-sublink-title">{sub.label}</span>
                        {sub.description && (
                          <span className="aui-topnav-mobile-sublink-desc">
                            {sub.description}
                          </span>
                        )}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {/* User profile card & logout in mobile menu */}
          {user && (
            <div className="aui-topnav-mobile-section">
              <div className="aui-topnav-mobile-user">
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
                  <div className="aui-topnav-user-avatar">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      user.initials || user.name.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                    <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--aui-text-secondary)" }}>
                      {user.name}
                    </span>
                    {user.email && (
                      <span style={{ fontSize: "0.76rem", color: "var(--aui-text-muted)" }}>
                        {user.email}
                      </span>
                    )}
                  </div>
                </div>
                {(onLogout || logoutLabel) && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="aui-topnav-link"
                    style={{ color: "var(--aui-accent-rose, #f43f5e)", padding: "0.4rem 0.6rem" }}
                    title={logoutLabel}
                    aria-label={logoutLabel}
                  >
                    <LogOutIcon size={16} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Right actions slot in mobile drawer */}
          {rightActions && (
            <div className="aui-topnav-mobile-actions">
              {rightActions}
            </div>
          )}
        </div>
      </header>
    );
  }
);

TopNav.displayName = "TopNav";
