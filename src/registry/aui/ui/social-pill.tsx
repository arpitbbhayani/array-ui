import * as React from "react";
import { cn } from "@/lib/utils";

export interface SocialPillProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  platform: string;
  count?: string | number;
  icon?: React.ReactNode;
}

export function SocialPill({
  platform,
  count,
  icon,
  className,
  children,
  target = "_blank",
  rel = "noopener noreferrer",
  ...props
}: SocialPillProps) {
  return (
    <a
      target={target}
      rel={rel}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-border bg-card text-foreground hover:bg-muted hover:border-foreground/30 transition-all cursor-pointer shadow-2xs",
        className
      )}
      {...props}
    >
      {icon && <span className="opacity-80">{icon}</span>}
      <span className="capitalize">{platform}</span>
      {count && <span className="text-muted-foreground text-[11px]">({count})</span>}
      {children}
    </a>
  );
}
