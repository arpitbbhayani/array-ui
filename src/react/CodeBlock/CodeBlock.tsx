"use client";

import React, { useState } from "react";
import { CopyIcon, CheckIcon } from "../Icons";
import { highlight } from "./highlight";
import { cn } from "../../utils/cn";

export interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string;
  language?: string;
  filename?: string;
  /** Syntax-colour the snippet (default true). */
  highlight?: boolean;
  /** Show line numbers gutter in code block. */
  showLineNumbers?: boolean;
  /** 1-based line numbers to highlight with subtle rail highlight. */
  highlightLines?: number[];
}

export const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  (
    {
      code,
      language = "bash",
      filename,
      highlight: shouldHighlight = true,
      showLineNumbers = false,
      highlightLines = [],
      className,
      ...props
    },
    ref
  ) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Fallback
      }
    };

    const lines = code.replace(/\r\n/g, "\n").trimEnd().split("\n");

    return (
      <div ref={ref} className={cn("aui-codeblock", className)} {...props}>
        <div className="aui-codeblock-header">
          <span className="aui-codeblock-lang">{filename || language}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="aui-codeblock-copy"
            aria-label="Copy code to clipboard"
          >
            {copied ? (
              <>
                <CheckIcon size={13} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <CopyIcon size={13} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <pre className="aui-codeblock-pre aui-pre">
          <code className="aui-codeblock-code">
            {lines.map((line, idx) => {
              const lineNum = idx + 1;
              const isHighlighted = highlightLines.includes(lineNum);
              return (
                <div
                  key={idx}
                  className={cn(
                    "aui-codeblock-line",
                    isHighlighted && "is-highlighted"
                  )}
                >
                  {showLineNumbers ? (
                    <span className="aui-codeblock-lineno">{lineNum}</span>
                  ) : null}
                  <span
                    className={cn(
                      "aui-codeblock-line-text",
                      !showLineNumbers && "aui-codeblock-line-text-pad"
                    )}
                  >
                    {shouldHighlight ? highlight(line || " ") : line || " "}
                  </span>
                </div>
              );
            })}
          </code>
        </pre>
      </div>
    );
  }
);

CodeBlock.displayName = "CodeBlock";
