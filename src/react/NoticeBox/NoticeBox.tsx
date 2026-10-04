import React from "react";
import { ArrowUpRightIcon } from "../Icons";
import { cn } from "../../utils/cn";

export interface NoticeBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  driveUrl?: string;
  driveLabel?: string;
  formats?: Array<{ label: string; desc: string }>;
  nudge?: React.ReactNode;
}

export const NoticeBox = React.forwardRef<HTMLDivElement, NoticeBoxProps>(
  (
    {
      title = "Access the presentation decks and notes",
      driveUrl,
      driveLabel = "this Google Drive folder",
      formats = [
        { label: "HTML files", desc: "View via npx deckrun <path>" },
        { label: "Markdown files", desc: "View presentation decks using npx deckrun <path.md>" },
        { label: "Google Slides", desc: "Open directly in Google Slides" },
        { label: "GoodNotes files", desc: "Load directly into the GoodNotes app" },
        { label: "PDF files", desc: "Open in any standard PDF reader" },
      ],
      nudge,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn("aui-notice-box", className)} {...props}>
        <div className="aui-notice-title">
          {title}{" "}
          {driveUrl && (
            <a
              href={driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="aui-notice-link"
            >
              {driveLabel} <ArrowUpRightIcon size={13} />
            </a>
          )}
        </div>

        {formats && formats.length > 0 && (
          <ul className="aui-notice-list">
            {formats.map((f, i) => (
              <li key={i}>
                <strong>{f.label}:</strong> {f.desc}
              </li>
            ))}
          </ul>
        )}

        {children}

        {nudge && <div className="aui-notice-footer">{nudge}</div>}
      </div>
    );
  }
);

NoticeBox.displayName = "NoticeBox";
