import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  shortcut?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, leftIcon, rightIcon, shortcut, error, helperText, className = "", id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const wrapperClasses = [
      "aui-input-wrapper",
      leftIcon ? "aui-input-has-left-icon" : "",
      rightIcon || shortcut ? "aui-input-has-right-icon" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="aui-form-group">
        {label && (
          <label htmlFor={inputId} className="aui-label">
            {label}
          </label>
        )}
        <div className={wrapperClasses}>
          {leftIcon && <span className="aui-input-icon-left">{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={`aui-input ${className}`}
            aria-invalid={Boolean(error)}
            {...props}
          />
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

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = "", id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    return (
      <div className="aui-form-group">
        {label && (
          <label htmlFor={inputId} className="aui-label">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={`aui-textarea ${className}`}
          aria-invalid={Boolean(error)}
          {...props}
        />
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

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: Array<{ label: string; value: string }>;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className = "", id, children, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    return (
      <div className="aui-form-group">
        {label && (
          <label htmlFor={inputId} className="aui-label">
            {label}
          </label>
        )}
        <select ref={ref} id={inputId} className={`aui-select ${className}`} {...props}>
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {error && (
          <p style={{ color: "var(--aui-primary)", fontSize: "0.82rem", margin: "0.3rem 0 0 0" }}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

export const Switch: React.FC<SwitchProps> = ({ label, className = "", ...props }) => {
  return (
    <label className={`aui-switch-label ${className}`}>
      <span className="aui-switch">
        <input type="checkbox" role="switch" {...props} />
        <span className="aui-switch-track" />
      </span>
      {label && <span>{label}</span>}
    </label>
  );
};

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, className = "", ...props }) => {
  return (
    <label className={`aui-checkbox-label ${className}`}>
      <input type="checkbox" className="aui-checkbox" {...props} />
      {label && <span>{label}</span>}
    </label>
  );
};
