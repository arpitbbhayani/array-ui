import * as React from "react";
import { cn } from "@/lib/utils";

export interface SearchBoxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  shortcut?: string;
  onClear?: () => void;
}

const SearchBox = React.forwardRef<HTMLInputElement, SearchBoxProps>(
  ({ shortcut = "⌘K", onClear, value, onChange, className, ...props }, ref) => {
    return (
      <div className={cn("relative flex items-center w-full", className)}>
        <svg
          className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          className="flex h-9 w-full rounded-md border border-input bg-background pl-9 pr-12 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
          {...props}
        />

        {shortcut && (
          <kbd className="absolute right-2 pointer-events-none inline-flex items-center font-mono text-[0.7rem] font-medium px-1.5 py-0.5 rounded border border-border bg-muted text-muted-foreground">
            {shortcut}
          </kbd>
        )}
      </div>
    );
  }
);
SearchBox.displayName = "SearchBox";

export { SearchBox };
