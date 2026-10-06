"use client";

import React, { useEffect, useRef, useState, useId } from "react";
import { createPortal } from "react-dom";
import { Button } from "../Button/Button";
import { AlertTriangleIcon } from "../Icons";
import { cn } from "../../utils/cn";

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
  const [mounted, setMounted] = useState(false);
  const [typedPhrase, setTypedPhrase] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();
  const titleId = `aui-alert-dialog-title-${generatedId}`;
  const descId = `aui-alert-dialog-desc-${generatedId}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTypedPhrase("");
      setSubmitting(false);
      // Autofocus cancel button by default
      const timer = setTimeout(() => {
        cancelButtonRef.current?.focus();
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
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

  const dialogNode = (
    <div
      className="aui-alert-dialog-backdrop"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        className={cn(
          "aui-alert-dialog",
          `aui-alert-dialog-${variant}`,
          className
        )}
        tabIndex={-1}
      >
        <div className="aui-alert-dialog-header">
          <div
            className={cn(
              "aui-alert-dialog-icon-wrapper",
              `is-${variant}`
            )}
          >
            <AlertTriangleIcon size={20} />
          </div>
          <div className="aui-alert-dialog-header-text">
            <h3 id={titleId} className="aui-alert-dialog-title">
              {title}
            </h3>
            <p id={descId} className="aui-alert-dialog-description">
              {description}
            </p>
          </div>
        </div>

        {confirmationPhrase && (
          <div className="aui-alert-dialog-phrase-box">
            <p className="aui-alert-dialog-phrase-instruction">
              Please type <code className="aui-alert-dialog-code">{confirmationPhrase}</code> to confirm:
            </p>
            <input
              type="text"
              className="aui-alert-dialog-input"
              value={typedPhrase}
              onChange={(e) => setTypedPhrase(e.target.value)}
              placeholder={confirmationPhrase}
              autoComplete="off"
              spellCheck="false"
            />
          </div>
        )}

        <div className="aui-alert-dialog-footer">
          <Button
            ref={cancelButtonRef}
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={loading || submitting}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === "danger" ? "destructive" : "primary"}
            size="sm"
            onClick={handleConfirmClick}
            disabled={isActionDisabled}
          >
            {loading || submitting ? "Processing..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(dialogNode, document.body)
    : null;
}
