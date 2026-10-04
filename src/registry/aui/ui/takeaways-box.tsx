import * as React from "react";
import { cn } from "@/lib/utils";

export interface TakeawaysBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  items?: React.ReactNode[];
}

export function TakeawaysBox({
  title = "Key Takeaways",
  items,
  children,
  className,
  ...props
}: TakeawaysBoxProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-muted/40 p-5 my-6 shadow-2xs",
        className
      )}
      {...props}
    >
      {title && (
        <h4 className="font-heading font-semibold text-base text-foreground mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          {title}
        </h4>
      )}
      {items && items.length > 0 ? (
        <ul className="space-y-2 text-sm text-foreground/85 list-disc list-inside">
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        children
      )}
    </div>
  );
}
