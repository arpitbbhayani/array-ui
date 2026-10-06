import React from "react";
import { cn } from "../../utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  shortcut?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      leftIcon,
      rightIcon,
      shortcut,
      error,
      helperText,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const hasWrapper = label || leftIcon || rightIcon || shortcut || error || helperText;

    const inputElement = (
      <input
        ref={ref}
        id={inputId}
        className={cn("aui-input", className)}
        aria-invalid={Boolean(error)}
        {...props}
      />
    );

    if (!hasWrapper) {
      return inputElement;
    }

    const wrapperClasses = cn(
      "aui-input-wrapper",
      leftIcon && "aui-input-has-left-icon",
      (rightIcon || shortcut) && "aui-input-has-right-icon"
    );

    return (
      <div className="aui-form-group">
        {label && (
          <label htmlFor={inputId} className="aui-label">
            {label}
          </label>
        )}
        <div className={wrapperClasses}>
          {leftIcon && <span className="aui-input-icon-left">{leftIcon}</span>}
          {inputElement}
          {rightIcon && <span className="aui-input-icon-right">{rightIcon}</span>}
          {shortcut && <span className="aui-input-shortcut">{shortcut}</span>}
        </div>
        {error && (
          <p style={{ color: "var(--aui-primary)", fontSize: "0.82rem", margin: "0.3rem 0 0 0" }}>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p style={{ color: "var(--aui-text-muted)", fontSize: "0.82rem", margin: "0.3rem 0 0 0" }}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const textareaElement = (
      <textarea
        ref={ref}
        id={inputId}
        className={cn("aui-textarea", className)}
        aria-invalid={Boolean(error)}
        {...props}
      />
    );

    if (!label && !error && !helperText) {
      return textareaElement;
    }

    return (
      <div className="aui-form-group">
        {label && (
          <label htmlFor={inputId} className="aui-label">
            {label}
          </label>
        )}
        {textareaElement}
        {error && (
          <p style={{ color: "var(--aui-primary)", fontSize: "0.82rem", margin: "0.3rem 0 0 0" }}>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p style={{ color: "var(--aui-text-muted)", fontSize: "0.82rem", margin: "0.3rem 0 0 0" }}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Select } from "../Select";
export type { SelectProps, SelectOption } from "../Select";

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <label className={cn("aui-switch-label", className)}>
        <span className="aui-switch">
          <input ref={ref} type="checkbox" role="switch" {...props} />
          <span className="aui-switch-track" />
        </span>
        {label && <span>{label}</span>}
      </label>
    );
  }
);
Switch.displayName = "Switch";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <label className={cn("aui-checkbox-label", className)}>
        <input ref={ref} type="checkbox" className="aui-checkbox" {...props} />
        {label && <span>{label}</span>}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";
