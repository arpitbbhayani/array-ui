"use client";

import React, { useEffect, useState } from "react";

export interface HeadingItem {
  depth: number;
  slug: string;
  text: string;
}

export interface TableOfContentsProps {
  headings?: HeadingItem[];
  title?: string;
  minDepth?: number;
  maxDepth?: number;
  sticky?: boolean;
  className?: string;
  activeSlug?: string;
  onSelect?: (slug: string) => void;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  headings = [],
  title = "On this page",
  minDepth = 2,
  maxDepth = 3,
  sticky = true,
  className = "",
  activeSlug: controlledActiveSlug,
  onSelect,
}) => {
  const [internalActiveSlug, setInternalActiveSlug] = useState<string>("");

  const activeSlug = controlledActiveSlug !== undefined ? controlledActiveSlug : internalActiveSlug;

  const filteredHeadings = headings.filter(
    (h) => h.depth >= minDepth && h.depth <= maxDepth
  );

  useEffect(() => {
    if (controlledActiveSlug !== undefined) return;
    if (typeof window === "undefined" || !filteredHeadings.length) return;

    const slugs = filteredHeadings.map((h) => h.slug);
    const elements = slugs
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInternalActiveSlug(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0.1 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings, minDepth, maxDepth, controlledActiveSlug]);

  if (filteredHeadings.length === 0) {
    return null;
  }

  return (
    <nav
      className={`aui-toc ${sticky ? "aui-toc-sticky" : ""} ${className}`}
      aria-label="Table of contents"
    >
      {title && (
        <p className="aui-toc-title">
          <span>{title}</span>
        </p>
      )}
      <ul className="aui-toc-list">
        {filteredHeadings.map((h) => {
          const isActive = activeSlug === h.slug;
          return (
            <li key={h.slug} className={`aui-toc-item aui-toc-depth-${h.depth}`}>
              <a
                href={`#${h.slug}`}
                className={`aui-toc-link ${isActive ? "is-active" : ""}`}
                onClick={(e) => {
                  if (onSelect) {
                    onSelect(h.slug);
                  }
                }}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
