import React from "react";
import { RssIcon } from "../Icons";
import { cn } from "../../utils/cn";

export interface FooterLink {
  label: string;
  href: string;
  hint?: string;
  external?: boolean;
  icon?: React.ReactNode;
  isRss?: boolean;
  isHighlight?: boolean;
}

export interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  columns?: FooterColumn[];
  disclaimer?: React.ReactNode;
  copyright?: string;
  socialPills?: React.ReactNode;
}

const defaultColumns: FooterColumn[] = [
  {
    heading: "Design System",
    links: [
      { label: "Overview", href: "/" },
      { label: "Component Catalog", href: "/components" },
      { label: "Design Foundations", href: "/foundations" },
      { label: "Color Tokens", href: "/foundations#colors" },
      { label: "Typography Scale", href: "/foundations#typography" },
      { label: "Spacing & Hairlines", href: "/foundations#spacing" },
      { label: "Zero-CSS Invariants", href: "/foundations#invariants" },
    ],
  },
  {
    heading: "Components",
    links: [
      { label: "Developer & Telemetry", href: "/components#ping-status" },
      { label: "Core UI & Actions", href: "/components#buttons" },
      { label: "Forms & Inputs", href: "/components#input" },
      { label: "Feedback & Overlays", href: "/components#alert" },
      { label: "Data Display", href: "/components#table" },
      { label: "Navigation Primitives", href: "/components#tabs" },
      { label: "Explainer Kit", href: "/components#explorables" },
    ],
  },
  {
    heading: "For AI Agents & LLMs",
    links: [
      { label: "Agents Protocol & Prompt", href: "/agents", isHighlight: true },
      { label: "llms.txt (Standard)", href: "/llms.txt", hint: "Manifest", external: true },
      { label: "llms-full.txt", href: "/llms-full.txt", hint: "Full APIs", external: true },
      { label: "shadcn Registry JSON", href: "/r/registry.json", hint: "Schema", external: true },
      { label: "AGENTS.md", href: "https://raw.githubusercontent.com/arpitbbhayani/aui/main/AGENTS.md", hint: "Rules", external: true },
      { label: "robots.txt", href: "/robots.txt", external: true },
    ],
  },
  {
    heading: "Installation & Code",
    links: [
      { label: "GitHub Repository", href: "https://github.com/arpitbbhayani/aui", external: true, hint: "Source" },
      { label: "npm Package", href: "https://www.npmjs.com/package/array-ui", external: true, hint: "v0.1.4" },
      { label: "shadcn Registry Guide", href: "/agents#shadcn" },
      { label: "React & Next.js Setup", href: "/#overview" },
      { label: "Astro Integration", href: "/#overview" },
    ],
  },
];

export const Footer = React.forwardRef<HTMLElement, FooterProps>(
  (
    {
      columns = defaultColumns,
      disclaimer = "Array UI is an editorial design system for personal sites, developer SaaS, and technical documentation. Built with zero custom CSS, machined telemetry, and an agent-first component architecture.",
      copyright = `© ${new Date().getFullYear()} Array UI. Built for systems engineers and autonomous coding agents. MIT Licensed.`,
      socialPills,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <footer ref={ref} className={cn("aui-footer", className)} {...props}>
        <div className="aui-container">
          {columns && columns.length > 0 && (
            <div className="aui-footer-grid">
              {columns.map((col, idx) => (
                <div key={idx} className="aui-footer-col">
                  <h4 className="aui-footer-heading">{col.heading}</h4>
                  <ul className="aui-footer-links">
                    {col.links.map((link, lIdx) => (
                      <li
                        key={lIdx}
                        className={link.isHighlight ? "aui-footer-highlight" : ""}
                      >
                        <a
                          href={link.href}
                          target={link.external ? "_blank" : undefined}
                          rel={link.external ? "noopener noreferrer" : undefined}
                          style={
                            link.isRss
                              ? { color: "#ff8c00" }
                              : link.isHighlight
                              ? { color: "var(--aui-primary)", fontWeight: 600 }
                              : undefined
                          }
                        >
                          {link.icon && (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                              }}
                            >
                              {link.icon}
                            </span>
                          )}
                          <span>{link.label}</span>
                          {link.hint && (
                            <span className="aui-link-hint">{link.hint}</span>
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {disclaimer && (
            <div className="aui-footer-disclaimer">{disclaimer}</div>
          )}

          <div className="aui-footer-bottom">
            <div>{copyright}</div>
            {socialPills && (
              <div className="aui-footer-socials">{socialPills}</div>
            )}
          </div>
        </div>
      </footer>
    );
  }
);

Footer.displayName = "Footer";
