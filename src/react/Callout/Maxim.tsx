import React from "react";

export interface MaximProps extends React.HTMLAttributes<HTMLQuoteElement> {
  quote?: React.ReactNode;
  author?: string;
  source?: string;
  sourceUrl?: string;
}

export const Maxim: React.FC<MaximProps> = ({
  quote,
  author,
  source,
  sourceUrl,
  children,
  className = "",
  ...props
}) => {
  return (
    <blockquote className={`aui-maxim ${className}`} {...props}>
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
};
