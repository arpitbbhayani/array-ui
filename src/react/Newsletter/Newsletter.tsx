import React from "react";
import { Button } from "../Button/Button";

export interface NewsletterProps {
  title?: string;
  subtitle?: string;
  statsText?: string;
  description?: string;
  avatarUrl?: string;
  linkedInUrl?: string;
  substackUrl?: string;
  className?: string;
}

export const Newsletter: React.FC<NewsletterProps> = ({
  title = "Arpit's Newsletter",
  subtitle = "Newsletter for the curious engineers",
  statsText = "Read by 40,000+ readers",
  description = "If you like what you read, subscribe to get posts delivered straight to your inbox. I write essays on engineering topics, databases, and systems, shared weekly.",
  avatarUrl,
  linkedInUrl = "https://www.linkedin.com/newsletters/asli-engineering-6921728898456072192/",
  substackUrl = "https://arpit.substack.com",
  className = "",
}) => {
  return (
    <div className={`aui-newsletter ${className}`}>
      {avatarUrl && (
        <div>
          <img src={avatarUrl} alt="Avatar" className="aui-newsletter-avatar" />
        </div>
      )}

      {title && <h2 className="aui-newsletter-title">{title}</h2>}
      {subtitle && <h3 className="aui-newsletter-subtitle">{subtitle}</h3>}
      {statsText && <p className="aui-newsletter-stats">{statsText}</p>}
      {description && <p className="aui-newsletter-desc">{description}</p>}

      <div className="aui-btn-group aui-btn-group-centered">
        {linkedInUrl && (
          <Button href={linkedInUrl} target="_blank" variant="primary">
            Subscribe on LinkedIn
          </Button>
        )}
        {substackUrl && (
          <Button href={substackUrl} target="_blank" variant="secondary">
            Subscribe on Substack
          </Button>
        )}
      </div>
    </div>
  );
};
