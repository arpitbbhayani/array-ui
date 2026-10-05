import * as React from "react";
import { cn } from "@/lib/utils";

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  keys?: string[];
}

export function Kbd({ keys, children, className, ...props }: KbdProps) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center font-mono text-[0.72rem] font-medium px-1.5 py-0.5 rounded border border-border bg-muted/60 text-muted-foreground shadow-2xs select-none gap-0.5",
        className
      )}
      {...props}
    >
      {keys ? keys.join(" ") : children}
    </kbd>
  );
}
