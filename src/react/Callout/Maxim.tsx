import React from "react";
import { cn } from "../../utils/cn";

export interface MaximProps extends React.HTMLAttributes<HTMLQuoteElement> {
  quote?: React.ReactNode;
  author?: string;
  source?: string;
  sourceUrl?: string;
}

export const Maxim = React.forwardRef<HTMLQuoteElement, MaximProps>(
  (
    {
      quote,
      author,
      source,
      sourceUrl,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <blockquote ref={ref} className={cn("aui-maxim", className)} {...props}>
        {quote || children}
        {(author || source) && (
          <cite>
            {author && <span>- {author}</span>}
            {source && (
              <span>
                {author ? ", " : "- "}
                {sourceUrl ? (
                  <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
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
);

Maxim.displayName = "Maxim";
