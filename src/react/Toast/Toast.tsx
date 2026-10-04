import React from "react";
import { CloseIcon } from "../Icons";

export type ToastVariant = "default" | "success" | "error" | "warning" | "info";

export interface ToastProps {
  title: string;
  description?: string;
  variant?: ToastVariant;
  onClose?: () => void;
  className?: string;
}

const glyph: Record<ToastVariant, string> = {
  default: "i",
  info: "i",
  success: "✓",
  warning: "!",
  error: "×",
};

export const Toast: React.FC<ToastProps> = ({
  title,
  description,
  variant = "default",
  onClose,
  className = "",
}) => (
  <div role="status" className={`aui-toast aui-toast-${variant} ${className}`}>
    <span className="aui-toast-icon" aria-hidden="true">
      {glyph[variant]}
    </span>
    <div className="aui-toast-body">
      <p className="aui-toast-title">{title}</p>
      {description && <p className="aui-toast-desc">{description}</p>}
    </div>
    {onClose && (
      <button type="button" className="aui-toast-close" onClick={onClose} aria-label="Dismiss">
        <CloseIcon size={14} />
      </button>
    )}
  </div>
);

export const ToastStack: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="aui-toast-stack" aria-live="polite">
    {children}
  </div>
);
