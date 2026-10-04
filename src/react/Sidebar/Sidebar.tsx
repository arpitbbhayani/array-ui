import React from "react";
import { cn } from "../../utils/cn";

export interface SidebarLinkItem {
  label: string;
  href: string;
  active?: boolean;
  badge?: React.ReactNode;
}

export interface SidebarGroupData {
  title?: string;
  links: SidebarLinkItem[];
}

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  groups?: SidebarGroupData[];
}

export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ groups, children, className, ...props }, ref) => {
    if (!groups && children) {
      return (
        <nav
          ref={ref}
          className={cn("aui-sidebar", className)}
          aria-label="Sidebar"
          {...props}
        >
          {children}
        </nav>
      );
    }

    return (
      <nav
        ref={ref}
        className={cn("aui-sidebar", className)}
        aria-label="Sidebar"
        {...props}
      >
        {groups &&
          groups.map((group, gi) => (
            <div key={gi} className="aui-sidebar-group">
              {group.title && (
                <p className="aui-sidebar-title">{group.title}</p>
              )}
              {group.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "aui-sidebar-link",
                    link.active && "is-active"
                  )}
                >
                  <span>{link.label}</span>
                  {link.badge}
                </a>
              ))}
            </div>
          ))}
      </nav>
    );
  }
);

Sidebar.displayName = "Sidebar";

export const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("aui-sidebar-group", className)} {...props} />
));
SidebarGroup.displayName = "SidebarGroup";
