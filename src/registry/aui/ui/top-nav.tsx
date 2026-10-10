"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

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
  items?: TopNavDropdownItem[];
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
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
    const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);

    const maxWidthClass =
      maxWidth === "full"
        ? "max-w-full"
        : maxWidth === "lg"
        ? "max-w-5xl"
        : "max-w-7xl";

    return (
      <header
        ref={ref}
        className={cn(
          "w-full bg-background/80 backdrop-blur-md border-b border-border z-50 font-sans",
          sticky && "sticky top-0",
          className
        )}
        {...props}
      >
        <div className={cn("flex items-center justify-between gap-6 h-16 px-6 mx-auto", maxWidthClass)}>
          {/* Left section: Brand and links */}
          <div className="flex items-center gap-8 min-w-0 flex-1">
            {brand && (
              <a
                href={brand.href || "/"}
                className="inline-flex items-center gap-3 no-underline text-foreground shrink-0"
              >
                {brand.logo && (
                  <span className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary border border-border font-bold text-sm shrink-0 overflow-hidden">
                    {brand.logo}
                  </span>
                )}
                <div className="flex flex-col min-w-0 gap-0.5">
                  <span className="font-heading font-bold text-foreground text-sm tracking-tight whitespace-nowrap leading-tight">
                    {brand.title}
                  </span>
                  {brand.subtitle && (
                    <span className="text-xs text-muted-foreground whitespace-nowrap leading-tight">
                      {brand.subtitle}
                    </span>
                  )}
                </div>
                {brand.badge && <span className="ml-1">{brand.badge}</span>}
              </a>
            )}

            {/* Desktop Navigation Links */}
            {links.length > 0 && (
              <nav className="hidden md:flex items-center gap-1.5 list-none m-0 p-0" aria-label="Main Navigation">
                {links.map((link, idx) => {
                  const linkId = link.id || String(idx);
                  if (link.items && link.items.length > 0) {
                    const isOpen = openDropdown === linkId;
                    return (
                      <div key={linkId} className="relative">
                        <button
                          type="button"
                          onClick={() => setOpenDropdown(isOpen ? null : linkId)}
                          className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer",
                            link.active
                              ? "text-foreground font-semibold bg-accent"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          )}
                        >
                          {link.icon && <span>{link.icon}</span>}
                          <span>{link.label}</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={cn("transition-transform opacity-60", isOpen && "rotate-180")}
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </button>

                        {isOpen && (
                          <div className="absolute left-0 mt-2 w-64 p-2 bg-popover text-popover-foreground rounded-md border border-border shadow-lg z-50 flex flex-col gap-1">
                            <div className="px-2.5 py-1.5 text-xs font-semibold text-muted-foreground border-b border-border mb-1 uppercase tracking-wider">
                              {link.label}
                            </div>
                            {link.items.map((sub, sIdx) => {
                              if (sub.divider) {
                                return <div key={sIdx} className="h-px bg-border my-1" />;
                              }
                              const Comp = sub.href ? "a" : "button";
                              return (
                                <Comp
                                  key={sub.id || sIdx}
                                  href={sub.href}
                                  onClick={() => {
                                    sub.onClick?.();
                                    setOpenDropdown(null);
                                  }}
                                  className={cn(
                                    "flex items-start gap-3 w-full p-2.5 rounded-md transition-colors text-left",
                                    sub.destructive
                                      ? "text-destructive hover:bg-destructive/10"
                                      : "text-foreground hover:bg-accent"
                                  )}
                                >
                                  {sub.icon && <span className="mt-0.5 shrink-0 text-muted-foreground">{sub.icon}</span>}
                                  <div className="flex flex-col min-w-0 gap-1 flex-1">
                                    <span className="font-semibold text-xs leading-snug">{sub.label}</span>
                                    {sub.description && (
                                      <span className="text-[11px] text-muted-foreground leading-relaxed whitespace-normal break-words">
                                        {sub.description}
                                      </span>
                                    )}
                                  </div>
                                </Comp>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  const Comp = link.href ? "a" : "button";
                  return (
                    <Comp
                      key={linkId}
                      href={link.href}
                      onClick={link.onClick}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap",
                        link.active
                          ? "text-foreground font-semibold bg-accent"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
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

          {/* Right section: Actions, Theme, User menu, Burger */}
          <div className="flex items-center gap-4 shrink-0 ml-auto">
            {rightActions}

            {user && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="inline-flex items-center gap-2.5 p-1 pr-3 rounded-full border border-border bg-secondary hover:bg-accent transition-colors cursor-pointer"
                  aria-label={`User menu for ${user.name}`}
                >
                  <div className="w-7 h-7 rounded-full bg-muted text-foreground text-xs font-bold flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user.initials || user.name.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <span className="text-xs font-semibold text-foreground max-w-[140px] truncate">
                    {user.name}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-60"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 p-1.5 bg-popover text-popover-foreground rounded-md border border-border shadow-lg z-50 flex flex-col gap-1">
                    <div className="flex flex-col gap-0.5 px-3 py-2 border-b border-border mb-1">
                      <div className="text-xs font-bold text-foreground truncate">{user.name}</div>
                      {user.email && (
                        <div className="text-[11px] text-muted-foreground truncate">{user.email}</div>
                      )}
                    </div>

                    {userMenuItems && userMenuItems.length > 0 ? (
                      userMenuItems.map((item, idx) => {
                        if (item.divider) {
                          return <div key={idx} className="h-px bg-border my-1" />;
                        }
                        const Comp = item.href ? "a" : "button";
                        return (
                          <Comp
                            key={idx}
                            href={item.href}
                            onClick={() => {
                              item.onClick?.();
                              setUserDropdownOpen(false);
                            }}
                            className={cn(
                              "flex items-center gap-2.5 w-full px-3 py-2 text-xs rounded transition-colors text-left",
                              item.destructive
                                ? "text-destructive hover:bg-destructive/10"
                                : "text-foreground hover:bg-accent"
                            )}
                          >
                            {item.icon}
                            <span>{item.label}</span>
                          </Comp>
                        );
                      })
                    ) : (
                      <a
                        href={user.href || "#"}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-foreground hover:bg-accent rounded transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        <span>Account Settings</span>
                      </a>
                    )}

                    {(onLogout || logoutLabel) && (
                      <>
                        <div className="h-px bg-border my-1" />
                        <button
                          type="button"
                          onClick={() => {
                            onLogout?.();
                            setUserDropdownOpen(false);
                          }}
                          className="flex items-center gap-2 w-full px-2.5 py-1.5 text-xs text-destructive hover:bg-destructive/10 rounded transition-colors text-left cursor-pointer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
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
                          <span>{logoutLabel}</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Mobile burger toggle button */}
            <button
              type="button"
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-md border border-border text-foreground hover:bg-accent transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu collapsible */}
        {mobileOpen && (
          <div className="md:hidden flex flex-col gap-3 px-5 py-4 bg-background border-b border-border shadow-lg max-h-[calc(100vh-4.5rem)] overflow-y-auto">
            {links.map((link, idx) => (
              <div key={link.id || idx} className="flex flex-col gap-1 border-b border-border/50 pb-2.5 last:border-b-0 last:pb-0">
                <a
                  href={link.href || "#"}
                  onClick={link.onClick}
                  className={cn(
                    "flex items-center justify-between p-2.5 text-sm font-semibold rounded-md border border-border/60 bg-secondary transition-colors",
                    link.active
                      ? "text-foreground bg-accent border-border"
                      : "text-foreground/90 hover:bg-accent"
                  )}
                >
                  <span className="flex items-center gap-2">
                    {link.icon}
                    {link.label}
                  </span>
                  {link.badge}
                </a>
                {link.items && link.items.length > 0 && (
                  <div className="pl-3 mt-1.5 flex flex-col gap-1 border-l-2 border-border ml-2">
                    {link.items.map((sub, sIdx) => {
                      if (sub.divider) return null;
                      return (
                        <a
                          key={sub.id || sIdx}
                          href={sub.href || "#"}
                          onClick={sub.onClick}
                          className={cn(
                            "flex flex-col gap-0.5 p-2 rounded-md transition-colors",
                            sub.active
                              ? "text-foreground font-semibold bg-accent"
                              : "text-foreground/80 hover:bg-accent"
                          )}
                        >
                          <span className="text-xs font-semibold">{sub.label}</span>
                          {sub.description && (
                            <span className="text-[11px] text-muted-foreground leading-relaxed">
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

            {/* Mobile user profile card & logout */}
            {user && (
              <div className="flex items-center justify-between p-3 rounded-md border border-border bg-secondary mt-1">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-muted text-foreground text-xs font-bold flex items-center justify-center overflow-hidden shrink-0">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.initials || user.name.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-foreground truncate">{user.name}</span>
                    {user.email && (
                      <span className="text-[11px] text-muted-foreground truncate">{user.email}</span>
                    )}
                  </div>
                </div>
                {(onLogout || logoutLabel) && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors"
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
                  </button>
                )}
              </div>
            )}

            {/* Mobile right actions */}
            {rightActions && (
              <div className="flex flex-col gap-2 mt-1">
                {rightActions}
              </div>
            )}
          </div>
        )}
      </header>
    );
  }
);

TopNav.displayName = "TopNav";
