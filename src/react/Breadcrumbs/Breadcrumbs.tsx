import React from "react";
import { cn } from "../../utils/cn";

export interface BreadcrumbItemData {
  label: string;
  href?: string;
  active?: boolean;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items?: BreadcrumbItemData[];
  separator?: React.ReactNode;
}

export const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ items, separator = "/", className, children, ...props }, ref) => {
    if (!items && children) {
      return (
        <nav ref={ref} aria-label="Breadcrumb" className={className} {...props}>
          <ol className="aui-breadcrumbs">{children}</ol>
        </nav>
      );
    }

    return (
      <nav ref={ref} aria-label="Breadcrumb" className={className} {...props}>
        <ul className={cn("aui-breadcrumbs", className)}>
          {items &&
            items.map((item, index) => {
              const isLast = index === items.length - 1;
              const isActive = item.active || isLast;

              return (
                <li key={index}>
                  {isActive || !item.href ? (
                    <span aria-current={isActive ? "page" : undefined}>
                      {item.label}
                    </span>
                  ) : (
                    <a href={item.href}>{item.label}</a>
                  )}
                  {!isLast && (
                    <span className="aui-breadcrumbs-separator">
                      {separator}
                    </span>
                  )}
                </li>
              );
            })}
        </ul>
      </nav>
    );
  }
);
Breadcrumbs.displayName = "Breadcrumbs";

export const Breadcrumb = Breadcrumbs;

export const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.OlHTMLAttributes<HTMLOListElement>
>(({ className, ...props }, ref) => (
  <ol ref={ref} className={cn("aui-breadcrumbs", className)} {...props} />
));
BreadcrumbList.displayName = "BreadcrumbList";

export const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.LiHTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("aui-breadcrumb-item", className)} {...props} />
));
BreadcrumbItem.displayName = "BreadcrumbItem";

export const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, ...props }, ref) => (
  <a ref={ref} className={cn("aui-breadcrumb-link", className)} {...props} />
));
BreadcrumbLink.displayName = "BreadcrumbLink";

export const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    aria-current="page"
    className={cn("aui-breadcrumb-page", className)}
    {...props}
  />
));
BreadcrumbPage.displayName = "BreadcrumbPage";

export const BreadcrumbSeparator = React.forwardRef<
  HTMLLIElement,
  React.LiHTMLAttributes<HTMLLIElement>
>(({ children = "/", className, ...props }, ref) => (
  <li
    ref={ref}
    role="presentation"
    aria-hidden="true"
    className={cn("aui-breadcrumbs-separator", className)}
    {...props}
  >
    {children}
  </li>
));
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";
