"use client";

import React, { useState } from "react";
import { ThemeToggle } from "../Theme/ThemeToggle";
import { MenuIcon, CloseIcon } from "../Icons";

export interface NavLinkItem {
  label: string;
  href: string;
  active?: boolean;
  external?: boolean;
  badge?: string;
}

export interface NavbarProps {
  brand?: {
    name?: string;
    href?: string;
    logo?: React.ReactNode;
  };
  links?: NavLinkItem[];
  rightActions?: React.ReactNode;
  showThemeToggle?: boolean;
  className?: string;
  currentPath?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  brand = { name: "Arpit Bhayani", href: "/" },
  links = [],
  rightActions,
  showThemeToggle = true,
  className = "",
  currentPath,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <header className={`aui-nav-wrapper ${className}`}>
      <div className="aui-container">
        <nav className="aui-nav" aria-label="Main Navigation">
          <div className="aui-nav-brand">
            <a href={brand.href || "/"} className="aui-nav-title">
              {brand.logo}
              <span>{brand.name || "Arpit Bhayani"}</span>
            </a>
          </div>

          <ul className={`aui-nav-menu ${mobileMenuOpen ? "is-open" : ""}`}>
            {links.map((link) => {
              const isActive = link.active ?? (currentPath ? currentPath === link.href || (link.href !== "/" && currentPath.startsWith(link.href)) : false);
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`aui-nav-item ${isActive ? "is-active" : ""}`}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="aui-badge aui-badge-primary" style={{ marginLeft: "0.4rem", fontSize: "0.68rem" }}>
                        {link.badge}
                      </span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="aui-nav-actions">
            {rightActions}
            {showThemeToggle && <ThemeToggle />}
            <button
              type="button"
              className="aui-nav-burger"
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};
