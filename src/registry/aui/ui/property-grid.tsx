import * as React from "react";
import { cn } from "@/lib/utils";

export interface PropertyItem {
  label: string;
  value: React.ReactNode;
  copyable?: boolean;
  copyValue?: string;
}

export interface PropertyGridProps extends React.HTMLAttributes<HTMLDivElement> {
  items: PropertyItem[];
}

export function PropertyGrid({ items, className, ...props }: PropertyGridProps) {
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const handleCopy = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <div
      className={cn(
        "rounded-lg border border-border divide-y divide-border bg-card text-card-foreground text-sm overflow-hidden my-4 shadow-xs",
        className
      )}
      {...props}
    >
      {items.map((item, idx) => {
        const strVal =
          item.copyValue ?? (typeof item.value === "string" ? item.value : undefined);
        const isCopied = copiedKey === item.label;

        return (
          <div
            key={idx}
            className="flex items-center justify-between px-4 py-2.5 hover:bg-muted/40 transition-colors"
          >
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
              {item.label}
            </span>
            <div className="flex items-center gap-2 font-mono text-sm text-foreground">
              <span>{item.value}</span>
              {item.copyable !== false && strVal && (
                <button
                  type="button"
                  className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                  title="Copy value"
                  onClick={() => handleCopy(item.label, strVal)}
                >
                  {isCopied ? (
                    <span className="text-xs text-emerald-500 font-semibold">Copied</span>
                  ) : (
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
