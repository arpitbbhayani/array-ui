"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SecretInputProps {
  value: string;
  label?: string;
  helperText?: string;
  maskByDefault?: boolean;
  allowCopy?: boolean;
  onCopy?: () => void;
  className?: string;
  id?: string;
}

export function SecretInput({
  value,
  label,
  helperText,
  maskByDefault = true,
  allowCopy = true,
  onCopy,
  className,
  id,
}: SecretInputProps) {
  const [isMasked, setIsMasked] = React.useState(maskByDefault);
  const [copied, setCopied] = React.useState(false);

  const inputId = id || (label ? `secret-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-foreground">
          {label}
        </label>
      )}

      <div className="relative flex items-center rounded-md border border-input bg-background shadow-xs focus-within:ring-1 focus-within:ring-ring">
        <input
          id={inputId}
          type={isMasked ? "password" : "text"}
          readOnly
          value={value}
          className="flex h-9 w-full bg-transparent px-3 py-1 font-mono text-sm outline-hidden"
          spellCheck="false"
        />

        <div className="flex items-center gap-1 pr-2">
          <button
            type="button"
            className="inline-flex h-7 w-7 items-center justify-center rounded-xs text-muted-foreground hover:text-foreground hover:bg-muted"
            onClick={() => setIsMasked(!isMasked)}
            aria-label={isMasked ? "Reveal secret" : "Hide secret"}
          >
            {isMasked ? "👁" : "🔒"}
          </button>

          {allowCopy && (
            <button
              type="button"
              className={cn(
                "inline-flex h-7 items-center gap-1 rounded-xs px-2 text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                copied && "text-emerald-600 dark:text-emerald-400 font-semibold"
              )}
              onClick={handleCopy}
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>
          )}
        </div>
      </div>

      {helperText && (
        <p className="text-xs text-muted-foreground mt-0.5">{helperText}</p>
      )}
    </div>
  );
}

export const CopyInput = SecretInput;
