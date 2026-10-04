"use client";

import React, { useState } from "react";
import { Button } from "../Button/Button";

export interface NewsletterProps {
  title?: string;
  description?: string;
  action?: string;
  placeholder?: string;
  buttonText?: string;
  linkedinUrl?: string;
  substackUrl?: string;
  className?: string;
  onSubmit?: (email: string) => void;
}

export const Newsletter: React.FC<NewsletterProps> = ({
  title = "Stay in the loop",
  description = "No-fluff engineering essays, database teardowns, and system design insights delivered straight to your inbox.",
  action,
  placeholder = "Enter your email address...",
  buttonText = "Subscribe",
  linkedinUrl,
  substackUrl,
  className = "",
  onSubmit,
}) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    if (onSubmit) {
      e.preventDefault();
      onSubmit(email);
      setStatus("success");
    }
  };

  return (
    <div className={`aui-newsletter ${className}`}>
      {title && <h3 className="aui-newsletter-title">{title}</h3>}
      {description && <p className="aui-newsletter-desc">{description}</p>}

      {status === "success" ? (
        <p style={{ color: "var(--aui-success)", fontWeight: 600 }}>Thank you for subscribing!</p>
      ) : action || onSubmit ? (
        <form action={action} method="POST" onSubmit={handleSubmit} className="aui-newsletter-form">
          <input
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            className="aui-newsletter-input"
            aria-label={placeholder}
          />
          <Button variant="primary" type="submit">
            {buttonText}
          </Button>
        </form>
      ) : null}

      {(linkedinUrl || substackUrl) && (
        <div className="aui-newsletter-buttons">
          {linkedinUrl && (
            <Button
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              size="sm"
            >
              Subscribe on LinkedIn &rarr;
            </Button>
          )}
          {substackUrl && (
            <Button
              href={substackUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              size="sm"
            >
              Subscribe on Substack &rarr;
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
