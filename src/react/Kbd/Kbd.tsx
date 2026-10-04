import React from "react";
import { cn } from "../../utils/cn";

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  /** Render several keys joined as a combo, e.g. keys={["⌘", "K"]} */
  keys?: string[];
}

export const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ keys, children, className, ...props }, ref) => {
    if (keys && keys.length > 0) {
      return (
        <span
          ref={ref as unknown as React.Ref<HTMLSpanElement>}
          className={cn("aui-kbd-group", className)}
        >
          {keys.map((key, i) => (
            <kbd key={`${key}-${i}`} className="aui-kbd" {...props}>
              {key}
            </kbd>
          ))}
        </span>
      );
    }
    return (
      <kbd
        ref={ref}
        className={cn("aui-kbd", className)}
        {...props}
      >
        {children}
      </kbd>
    );
  }
);

Kbd.displayName = "Kbd";
