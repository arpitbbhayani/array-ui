import * as React from "react";
import { cn } from "@/lib/utils";

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

function RssIcon() {
  return (
    <svg className="w-3.5 h-3.5 inline mr-1 text-[#ff8c00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 11a9 9 0 0 1 9 9" />
      <path d="M4 4a16 16 0 0 1 16 16" />
      <circle cx="5" cy="19" r="1" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg className="w-3 h-3 inline ml-1 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

export function Footer({
  columns = defaultColumns,
  disclaimer = "Array UI is an editorial design system for personal sites, developer SaaS, and technical documentation. Built with zero custom CSS, machined telemetry, and an agent-first component architecture.",
  copyright = `© ${new Date().getFullYear()} Array UI. Built for systems engineers and autonomous coding agents. MIT Licensed.`,
  socialPills,
  className,
  children,
  ...props
}: FooterProps) {
  return (
    <footer
      className={cn(
        "w-full border-t border-border bg-card/60 backdrop-blur-xs py-12 px-4 sm:px-6 lg:px-8 mt-12",
        className
      )}
      {...props}
    >
      <div className="max-w-6xl mx-auto">
        {columns && columns.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {columns.map((col, idx) => (
              <div key={idx} className="space-y-3">
                <h4 className="font-heading font-bold text-xs tracking-wider uppercase text-muted-foreground/80">
                  {col.heading}
                </h4>
                <ul className="space-y-2 text-sm">
                  {col.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <a
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        className={cn(
                          "group flex items-center justify-between text-muted-foreground hover:text-foreground transition-colors py-0.5",
                          link.isHighlight && "text-primary font-medium hover:underline",
                          link.isRss && "text-[#ff8c00] hover:text-[#ffa033] font-medium"
                        )}
                      >
                        <span className="flex items-center gap-1.5">
                          {link.isRss && <RssIcon />}
                          {link.icon}
                          <span>{link.label}</span>
                          {link.external && <ExternalIcon />}
                        </span>
                        {link.hint && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded border border-border bg-muted/60 text-muted-foreground group-hover:text-foreground transition-colors font-mono">
                            {link.hint}
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {children}

        {disclaimer && (
          <div className="border-t border-border/60 py-6 text-xs text-muted-foreground leading-relaxed">
            {disclaimer}
          </div>
        )}

        <div className="border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>{copyright}</div>
          {socialPills && (
            <div className="flex flex-wrap items-center gap-2">{socialPills}</div>
          )}
        </div>
      </div>
    </footer>
  );
}
