"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning";
  confirmationPhrase?: string;
  loading?: boolean;
  className?: string;
}

export function AlertDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  confirmationPhrase,
  loading = false,
  className,
}: AlertDialogProps) {
  const [mounted, setMounted] = React.useState(false);
  const [typedPhrase, setTypedPhrase] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const cancelBtnRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      setTypedPhrase("");
      setSubmitting(false);
      const timer = setTimeout(() => {
        cancelBtnRef.current?.focus();
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const phraseMatches = confirmationPhrase
    ? typedPhrase.trim() === confirmationPhrase.trim()
    : true;

  const isActionDisabled = !phraseMatches || loading || submitting;

  const handleConfirmClick = async () => {
    if (isActionDisabled) return;
    try {
      setSubmitting(true);
      await onConfirm();
    } finally {
      setSubmitting(false);
    }
  };

  const node = (
    <div
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-[3px] flex items-center justify-center p-4 animate-in fade-in-0"
      role="alertdialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={cn(
          "w-full max-w-md rounded-xl border bg-card p-6 shadow-2xl overflow-hidden animate-in zoom-in-95",
          variant === "danger" ? "border-rose-500/30" : "border-amber-500/30",
          className
        )}
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-bold text-lg",
              variant === "danger"
                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
            )}
          >
            ⚠
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="font-heading font-semibold text-lg text-foreground">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        {confirmationPhrase && (
          <div className="mt-4 p-3 rounded-lg border border-border bg-muted/40 space-y-2">
            <p className="text-xs text-muted-foreground">
              Please type <code className="font-mono font-semibold text-primary px-1 py-0.5 rounded bg-muted">{confirmationPhrase}</code> to confirm:
            </p>
            <input
              type="text"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 font-mono text-sm shadow-xs outline-hidden focus:ring-1 focus:ring-ring"
              value={typedPhrase}
              onChange={(e) => setTypedPhrase(e.target.value)}
              placeholder={confirmationPhrase}
            />
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            ref={cancelBtnRef}
            type="button"
            className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
            onClick={onClose}
            disabled={loading || submitting}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={cn(
              "inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
              variant === "danger" ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
            )}
            onClick={handleConfirmClick}
            disabled={isActionDisabled}
          >
            {loading || submitting ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(node, document.body)
    : null;
}
