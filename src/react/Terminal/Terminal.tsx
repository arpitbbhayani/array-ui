import React from "react";

export type TerminalLine =
  | string
  | { text: string; kind?: "cmd" | "out" | "ok" | "err" };

export interface TerminalProps {
  title?: string;
  lines: TerminalLine[];
  className?: string;
}

export const Terminal: React.FC<TerminalProps> = ({ title = "bash", lines, className = "" }) => (
  <div className={`aui-terminal ${className}`}>
    <div className="aui-terminal-bar">
      <span className="aui-terminal-dot" />
      <span className="aui-terminal-dot" />
      <span className="aui-terminal-dot" />
      <span className="aui-terminal-title">{title}</span>
    </div>
    <div className="aui-terminal-body">
      {lines.map((line, i) => {
        const { text, kind } =
          typeof line === "string" ? { text: line, kind: "cmd" as const } : { kind: "cmd" as const, ...line };
        return (
          <span key={i} className={`aui-terminal-line aui-terminal-${kind}`}>
            {text}
          </span>
        );
      })}
    </div>
  </div>
);
