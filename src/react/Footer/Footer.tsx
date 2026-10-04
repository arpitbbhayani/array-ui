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
    heading: "Writings & Media",
    links: [
      { label: "Projects", href: "/projects", hint: "Open-source" },
      { label: "Blogs", href: "/blogs", hint: "Essays" },
      { label: "Notes", href: "/notes", hint: "Takeaways" },
      { label: "Videos", href: "/videos", hint: "Walkthroughs" },
      { label: "Papershelf", href: "/papershelf", hint: "Research" },
      { label: "Bookshelf", href: "/bookshelf", hint: "Reads" },
      { label: "Talks & Appearances", href: "/talks" },
      { label: "RSS Feed", href: "/rss.xml", isRss: true, icon: <RssIcon size={13} /> },
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

export const Footer = React.forwardRef<HTMLElement, FooterProps>(
  (
    {
      columns = defaultColumns,
      disclaimer,
      copyright = `© ${new Date().getFullYear()} Arpit Bhayani. All rights reserved.`,
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
