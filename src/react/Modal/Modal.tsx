"use client";

import React, { useEffect, useRef, useState, useId } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "../Icons";
import { cn } from "../../utils/cn";

export interface ModalProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  isOpen?: boolean;
  open?: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  footer?: React.ReactNode;
  closeOnBackdropClick?: boolean;
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      open,
      onClose,
      title,
      children,
      footer,
      className,
      closeOnBackdropClick = true,
      ...props
    },
    ref
  ) => {
    const isVisible = open !== undefined ? open : Boolean(isOpen);
    const [mounted, setMounted] = useState(false);
    const localModalRef = useRef<HTMLDivElement>(null);
    const modalRef = (ref as React.RefObject<HTMLDivElement>) || localModalRef;
    const previousActiveElement = useRef<HTMLElement | null>(null);
    const generatedId = useId();
    const titleId = `aui-modal-title-${generatedId}`;

    useEffect(() => {
      setMounted(true);
    }, []);

    useEffect(() => {
      if (!isVisible) return;

      previousActiveElement.current = document.activeElement as HTMLElement | null;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          onClose?.();
          return;
        }

        if (e.key === "Tab" && modalRef.current) {
          const focusable = modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusable.length === 0) return;

          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const timer = setTimeout(() => {
        if (modalRef.current) {
          const focusable = modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusable.length > 0) {
            focusable[0].focus();
          } else {
            modalRef.current.focus();
          }
        }
      }, 20);

      return () => {
        clearTimeout(timer);
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = originalOverflow;
        if (
          previousActiveElement.current &&
          typeof previousActiveElement.current.focus === "function"
        ) {
          previousActiveElement.current.focus();
        }
      };
    }, [isVisible, onClose, modalRef]);

    if (!isVisible || !mounted) return null;

    const modalNode = (
      <div
        className="aui-modal-backdrop"
        onClick={(e) => {
          if (closeOnBackdropClick && e.target === e.currentTarget) {
            onClose?.();
          }
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
      >
        <div
          ref={modalRef}
          className={cn("aui-modal", className)}
          tabIndex={-1}
          {...props}
        >
          {(title || onClose) && (
            <div className="aui-modal-header">
              {title && (
                <h3 id={titleId} className="aui-modal-title">
                  {title}
                </h3>
              )}
              {onClose && (
                <button
                  type="button"
                  className="aui-modal-close"
                  onClick={onClose}
                  aria-label="Close dialog"
                >
                  <CloseIcon size={20} />
                </button>
              )}
            </div>
          )}

          <div className="aui-modal-body">{children}</div>

          {footer && <div className="aui-modal-footer">{footer}</div>}
        </div>
      </div>
    );

    return typeof document !== "undefined"
      ? createPortal(modalNode, document.body)
      : null;
  }
);
Modal.displayName = "Modal";

/**
 * Dialog alias for shadcn/ui convention
 */
export const Dialog = Modal;
