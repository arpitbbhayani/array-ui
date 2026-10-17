"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface NavLinkItem {
  label: string;
  href: string;
  active?: boolean;
  external?: boolean;
  badge?: string;
}

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  brandName?: string;
  brandHref?: string;
  logo?: React.ReactNode;
  brand?: {
    name?: string;
    href?: string;
    logo?: React.ReactNode;
  };
  links?: NavLinkItem[];
  actions?: React.ReactNode;
  rightActions?: React.ReactNode;
  statusIndicator?: React.ReactNode;
  currentPath?: string;
}

export function Navbar({
  brandName,
  brandHref,
  logo,
  brand,
  links = [],
  actions,
  rightActions,
  statusIndicator,
  currentPath,
  className,
  ...props
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const effectiveBrandName = brandName || brand?.name || "Array UI";
  const effectiveBrandHref = brandHref || brand?.href || "/";
  const effectiveLogo = logo || brand?.logo;
  const effectiveActions = actions || rightActions;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200 border-b",
        scrolled
          ? "border-border bg-background/85 backdrop-blur-md shadow-2xs"
          : "border-border/60 bg-background/60 backdrop-blur-xs",
        className
      )}
      {...props}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4 font-sans">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <a
            href={effectiveBrandHref}
            className="flex items-center gap-2 font-heading font-bold text-base tracking-tight text-foreground hover:opacity-90 transition-opacity"
          >
            {effectiveLogo}
            <span>{effectiveBrandName}</span>
          </a>
          {statusIndicator && (
            <div className="hidden sm:inline-flex items-center pl-2 border-l border-border/80">
              {statusIndicator}
            </div>
          )}
        </div>

        {/* Desktop Links */}
        {links && links.length > 0 && (
          <nav className="hidden md:flex items-center gap-6 text-sm" aria-label="Main Navigation">
            {links.map((link, idx) => {
              const isActive = link.active ?? (currentPath ? currentPath === link.href : false);
              return (
                <a
                  key={idx}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className={cn(
                    "transition-colors hover:text-foreground py-1 text-sm font-medium",
                    isActive
                      ? "text-primary font-semibold"
                      : "text-muted-foreground"
                  )}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="ml-1.5 text-[10px] font-mono px-1.5 py-0.5 rounded border border-border bg-muted/60 text-muted-foreground">
                      {link.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>
        )}

        {/* Right Actions & Mobile Toggle */}
        <div className="flex items-center gap-2.5">
          {effectiveActions && (
            <div className="flex items-center gap-2">{effectiveActions}</div>
          )}

          {/* Mobile hamburger button */}
          {links && links.length > 0 && (
            <button
              type="button"
              className="md:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors border border-border"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && links && links.length > 0 && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-2">
          {statusIndicator && <div className="pb-2 border-b border-border/60">{statusIndicator}</div>}
          <nav className="flex flex-col space-y-1">
            {links.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-3 py-2 rounded-md text-sm transition-colors",
                  link.active
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
