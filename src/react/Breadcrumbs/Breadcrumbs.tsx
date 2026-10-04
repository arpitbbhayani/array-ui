import React from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  separator = "/",
  className = "",
}) => {
  return (
    <nav aria-label="Breadcrumbs">
      <ul className={`aui-breadcrumbs ${className}`}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isActive = item.active || isLast;

          return (
            <li key={index}>
              {isActive || !item.href ? (
                <span aria-current={isActive ? "page" : undefined}>{item.label}</span>
              ) : (
                <a href={item.href}>{item.label}</a>
              )}
              {!isLast && <span className="aui-breadcrumbs-separator">{separator}</span>}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
