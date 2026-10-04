import React from "react";
import { cn } from "../../utils/cn";

export interface CoverCardAuthor {
  name?: string;
  handle?: string;
  avatar?: string;
}

export interface CoverCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  siteName?: string;
  category?: string;
  path?: string;
  badge?: string;
  author?: CoverCardAuthor;
  tags?: string[];
  readingTime?: string;
  date?: string;
  theme?: "dark" | "light" | "brand";
  pattern?: "dots" | "grid" | "none";
  fixedSize?: boolean;
}

export const CoverCard = React.forwardRef<HTMLDivElement, CoverCardProps>(
  (
    {
      title,
      description,
      siteName = "Array UI",
      category,
      path,
      badge,
      author,
      tags = [],
      readingTime,
      date,
      theme = "dark",
      pattern = "dots",
      fixedSize = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    // Compute monogram if author name exists and no avatar url
    const initials = author?.name
      ? author.name
          .split(" ")
          .map((p) => p[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : "AB";

    return (
      <div
        ref={ref}
        className={cn(
          "aui-cover-card",
          `aui-cover-${theme}`,
          `aui-cover-pattern-${pattern}`,
          fixedSize && "aui-cover-card-fixed",
          className
        )}
        {...props}
      >
        {/* Precision CAD crosshairs */}
        <div className="aui-cover-corner aui-cover-corner-tl" aria-hidden="true" />
        <div className="aui-cover-corner aui-cover-corner-tr" aria-hidden="true" />
        <div className="aui-cover-corner aui-cover-corner-bl" aria-hidden="true" />
        <div className="aui-cover-corner aui-cover-corner-br" aria-hidden="true" />

        <div className="aui-cover-inner">
          {/* Header */}
          <div className="aui-cover-header">
            <div className="aui-cover-brand">
              <span className="aui-cover-brand-dot" aria-hidden="true" />
              <span className="aui-cover-sitename">{siteName}</span>
              {category && <span className="aui-cover-category">{category}</span>}
            </div>

            <div className="aui-cover-header-right">
              {path && <span className="aui-cover-path">{path}</span>}
              {badge && <span className="aui-cover-badge">{badge}</span>}
            </div>
          </div>

          {/* Body */}
          <div className="aui-cover-body">
            <h1 className="aui-cover-title">{title}</h1>
            {description && <p className="aui-cover-desc">{description}</p>}
            {children}
          </div>

          {/* Footer */}
          <div className="aui-cover-footer">
            {author ? (
              <div className="aui-cover-author">
                <div className="aui-cover-avatar">
                  {author.avatar ? (
                    <img src={author.avatar} alt={author.name || "Author"} />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>
                <div className="aui-cover-author-info">
                  {author.name && <div className="aui-cover-author-name">{author.name}</div>}
                  {author.handle && <div className="aui-cover-author-meta">{author.handle}</div>}
                </div>
              </div>
            ) : (
              <div className="aui-cover-author">
                <div className="aui-cover-brand-dot" />
                <span className="aui-cover-sitename">{siteName}</span>
              </div>
            )}

            <div className="aui-cover-meta">
              {readingTime && (
                <span className="aui-cover-chip aui-cover-chip-muted">{readingTime}</span>
              )}
              {date && <span className="aui-cover-chip aui-cover-chip-muted">{date}</span>}
              {tags.map((tag, idx) => (
                <span key={idx} className="aui-cover-chip">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CoverCard.displayName = "CoverCard";

export const OgCard = CoverCard;
