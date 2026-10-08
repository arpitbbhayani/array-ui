import * as React from "react";
import { cn } from "@/lib/utils";

export interface SidebarLinkItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode;
  active?: boolean;
  badge?: React.ReactNode;
  external?: boolean;
}

export interface SidebarGroupData {
  title?: string;
  links: SidebarLinkItem[];
}

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  groups?: SidebarGroupData[];
  header?: React.ReactNode;
  footer?: React.ReactNode;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

function renderLinkIcon(icon: React.ComponentType<{ className?: string }> | React.ReactNode) {
  if (!icon) return null;
  if (React.isValidElement(icon)) {
    return <span className="inline-flex mr-2 shrink-0">{icon}</span>;
  }
  if (typeof icon === "function" || typeof icon === "object") {
    const IconComponent = icon as React.ComponentType<{ className?: string }>;
    return (
      <span className="inline-flex mr-2 shrink-0">
        <IconComponent className="h-4 w-4" />
      </span>
    );
  }
  return <span className="inline-flex mr-2 shrink-0">{icon}</span>;
}

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  (
    {
      groups,
      header,
      footer,
      collapsed = false,
      onToggleCollapse,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <nav
        ref={ref}
        className={cn(
          "flex flex-col border-r border-border bg-card text-card-foreground transition-all duration-200",
          collapsed ? "w-14 min-w-[56px]" : "w-64 min-w-[256px]",
          className
        )}
        aria-label="Sidebar"
        {...props}
      >
        {header && (
          <div className={cn("p-4 border-b border-border", collapsed && "p-2 flex justify-center")}>
            {header}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          {!groups && children
            ? children
            : groups &&
              groups.map((group, gi) => (
                <div key={gi} className="space-y-1">
                  {group.title && !collapsed && (
                    <p className="px-3 font-mono text-[0.7rem] font-medium text-muted-foreground uppercase tracking-wider mb-2">
                      {group.title}
                    </p>
                  )}
                  {group.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      title={collapsed ? link.label : undefined}
                      className={cn(
                        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                        link.active
                          ? "bg-muted text-primary font-semibold"
                          : "text-muted-foreground hover:text-foreground",
                        collapsed && "justify-center px-2"
                      )}
                    >
                      {renderLinkIcon(link.icon)}
                      {!collapsed && <span>{link.label}</span>}
                      {!collapsed && link.badge && (
                        <span className="ml-auto">{link.badge}</span>
                      )}
                    </a>
                  ))}
                </div>
              ))}
        </div>

        {footer && (
          <div className={cn("p-4 border-t border-border mt-auto", collapsed && "p-2 flex justify-center")}>
            {footer}
          </div>
        )}
      </nav>
    );
  }
);
Sidebar.displayName = "Sidebar";

export { Sidebar };
