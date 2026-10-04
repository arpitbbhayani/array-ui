import * as React from "react";
import { cn } from "@/lib/utils";

export interface CourseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  href: string;
  badge?: string;
  tags?: string[];
  ctaText?: string;
}

export function CourseCard({
  title,
  description,
  href,
  badge,
  tags = [],
  ctaText = "View details →",
  className,
  ...props
}: CourseCardProps) {
  return (
    <div
      className={cn(
        "group relative rounded-xl border border-border bg-card p-6 shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-200 flex flex-col justify-between my-4",
        className
      )}
      {...props}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-heading text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            <a href={href}>
              <span className="absolute inset-0" aria-hidden="true" />
              {title}
            </a>
          </h3>
          {badge && (
            <span className="relative z-10 px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {description}
        </p>
      </div>

      <div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5 relative z-10">
            {tags.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded text-[11px] font-mono bg-muted text-muted-foreground border border-border"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-end pt-3 border-t border-border/70 relative z-10">
          <span className="text-sm font-semibold text-primary group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
            {ctaText}
          </span>
        </div>
      </div>
    </div>
  );
}
