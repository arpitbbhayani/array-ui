import React from "react";

export interface HeroProps {
  title?: string;
  subtitle?: string;
  bio?: React.ReactNode;
  avatarUrl?: string;
  avatarAlt?: string;
  socialLinks?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const Hero: React.FC<HeroProps> = ({
  title = "Hey, I am Arpit",
  subtitle = "engineering, databases, and systems. always building.",
  bio,
  avatarUrl,
  avatarAlt = "Portrait",
  socialLinks,
  actions,
  className = "",
}) => {
  return (
    <section className={`aui-hero ${className}`}>
      <div className="aui-hero-grid">
        <div className="aui-hero-content">
          {title && <h1 className="aui-hero-title">{title}</h1>}
          {subtitle && <h2 className="aui-hero-subtitle">{subtitle}</h2>}
          {bio && <div className="aui-hero-body">{bio}</div>}
          {actions && <div style={{ marginBottom: "1.5rem" }}>{actions}</div>}
          {socialLinks && <div className="aui-hero-socials">{socialLinks}</div>}
        </div>

        {avatarUrl && (
          <div className="aui-hero-avatar-wrapper">
            <img
              src={avatarUrl}
              alt={avatarAlt}
              className="aui-hero-avatar"
              loading="eager"
            />
          </div>
        )}
      </div>
    </section>
  );
};
