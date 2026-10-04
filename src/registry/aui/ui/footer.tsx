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
    heading: "Writings & Media",
    links: [
      { label: "Projects", href: "/projects", hint: "Open-source" },
      { label: "Blogs", href: "/blogs", hint: "Essays" },
      { label: "Notes", href: "/notes", hint: "Takeaways" },
      { label: "Videos", href: "/videos", hint: "Walkthroughs" },
      { label: "Papershelf", href: "/papershelf", hint: "Research" },
      { label: "Bookshelf", href: "/bookshelf", hint: "Reads" },
      { label: "Talks & Appearances", href: "/talks" },
      { label: "RSS Feed", href: "/rss.xml", isRss: true },
    ],
  },
  {
    heading: "Masterclasses",
    links: [
      { label: "System Design Masterclass", href: "/courses" },
      { label: "Database Internals", href: "/courses" },
      { label: "View all courses →", href: "/courses", isHighlight: true },
    ],
  },
  {
    heading: "Ecosystem",
    links: [
      { label: "DiceDB", href: "https://github.com/DiceDB/Dice", external: true, hint: "Fast in-memory DB" },
      { label: "px0.ai", href: "https://px0.ai", external: true, hint: "Instant code review" },
      { label: "deckrun", href: "https://github.com/arpitbbhayani/deckrun", external: true, hint: "CLI presentation tool" },
    ],
  },
  {
    heading: "Connect",
    links: [
      { label: "Twitter / X", href: "https://twitter.com/arpit_bhayani", external: true },
      { label: "LinkedIn", href: "https://linkedin.com/in/arpitbhayani", external: true },
      { label: "YouTube", href: "https://youtube.com/c/ArpitBhayani", external: true },
      { label: "GitHub", href: "https://github.com/arpitbbhayani", external: true },
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
  disclaimer,
  copyright = `© ${new Date().getFullYear()} Arpit Bhayani. Built for curious engineers.`,
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
