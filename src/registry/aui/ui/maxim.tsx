import * as React from "react";
import { cn } from "@/lib/utils";

export interface MaximProps extends React.HTMLAttributes<HTMLQuoteElement> {
  quote?: React.ReactNode;
  author?: string;
  source?: string;
  sourceUrl?: string;
}

export function Maxim({
  quote,
  author,
  source,
  sourceUrl,
  children,
  className,
  ...props
}: MaximProps) {
  return (
    <blockquote
      className={cn(
        "relative pl-4 py-1.5 my-6 border-l-[3px] border-[#cc9900] dark:border-[#fbbf24] font-serif italic text-lg leading-relaxed text-foreground/90",
        className
      )}
      {...props}
    >
      <p>{quote || children}</p>
      {(author || source) && (
        <cite className="block not-italic font-sans text-xs text-muted-foreground font-medium uppercase tracking-wider mt-2">
          {author && <span>— {author}</span>}
          {source && (
            <span>
              {author ? ", " : "— "}
              {sourceUrl ? (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground transition-colors"
                >
                  {source}
                </a>
              ) : (
                source
              )}
            </span>
          )}
        </cite>
      )}
    </blockquote>
  );
}
