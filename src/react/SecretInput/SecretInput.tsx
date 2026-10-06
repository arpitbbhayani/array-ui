"use client";

import React, { useState } from "react";
import { EyeIcon, EyeOffIcon, CopyIcon, CheckIcon } from "../Icons";
import { cn } from "../../utils/cn";

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
  const [isMasked, setIsMasked] = useState(maskByDefault);
  const [copied, setCopied] = useState(false);

  const inputId = id || (label ? `secret-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      onCopy?.();
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      // fallback
      const textArea = document.createElement("textarea");
      textArea.value = value;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      onCopy?.();
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const maskedDisplay = value ? "•".repeat(Math.min(value.length, 32)) : "";

  return (
    <div className={cn("aui-secret-input-container", className)}>
      {label && (
        <label htmlFor={inputId} className="aui-label">
          {label}
        </label>
      )}

      <div className="aui-secret-input-wrapper">
        <input
          id={inputId}
          type={isMasked ? "password" : "text"}
          readOnly
          value={value}
          className="aui-secret-input"
          spellCheck="false"
          autoComplete="off"
        />

        <div className="aui-secret-input-actions">
          <button
            type="button"
            className="aui-secret-input-btn"
            onClick={() => setIsMasked((prev) => !prev)}
            aria-label={isMasked ? "Reveal secret" : "Hide secret"}
            title={isMasked ? "Reveal secret" : "Hide secret"}
          >
            {isMasked ? <EyeIcon size={15} /> : <EyeOffIcon size={15} />}
          </button>

          {allowCopy && (
            <button
              type="button"
              className={cn(
                "aui-secret-input-btn aui-secret-input-copy-btn",
                copied && "is-copied"
              )}
              onClick={handleCopy}
              aria-label={copied ? "Copied" : "Copy to clipboard"}
              title={copied ? "Copied!" : "Copy secret"}
            >
              {copied ? (
                <>
                  <CheckIcon size={14} />
                  <span className="aui-secret-copied-label">Copied</span>
                </>
              ) : (
                <CopyIcon size={14} />
              )}
            </button>
          )}
        </div>
      </div>

      {helperText && (
        <p className="aui-form-hint">{helperText}</p>
      )}
    </div>
  );
}

export const CopyInput = SecretInput;
