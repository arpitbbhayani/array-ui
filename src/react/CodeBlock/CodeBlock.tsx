import React, { useState } from "react";
import { CopyIcon, CheckIcon } from "../Icons";
import { highlight } from "./highlight";

export interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  /** Syntax-colour the snippet (default true). */
  highlight?: boolean;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = "bash",
  filename,
  highlight: shouldHighlight = true,
  className = "",
}) => {
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

  return (
    <div className={`aui-codeblock ${className}`}>
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
        <code>{shouldHighlight ? highlight(code) : code}</code>
      </pre>
    </div>
  );
};
