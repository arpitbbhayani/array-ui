import React from "react";

export interface SidebarLink {
  label: string;
  href: string;
  active?: boolean;
  badge?: React.ReactNode;
}

export interface SidebarGroup {
  title?: string;
  links: SidebarLink[];
}

export interface SidebarProps {
  groups: SidebarGroup[];
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ groups, className = "" }) => (
  <nav className={`aui-sidebar ${className}`} aria-label="Sidebar">
    {groups.map((group, gi) => (
      <div key={gi} className="aui-sidebar-group">
        {group.title && <p className="aui-sidebar-title">{group.title}</p>}
        {group.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={`aui-sidebar-link ${link.active ? "is-active" : ""}`}
          >
            <span>{link.label}</span>
            {link.badge}
          </a>
        ))}
      </div>
    ))}
  </nav>
);
