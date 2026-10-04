import React from "react";
import { cn } from "../../utils/cn";

export type TerminalLine =
  | string
  | { text: string; kind?: "cmd" | "out" | "ok" | "err" };

export interface TerminalProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  lines: TerminalLine[];
}

export const Terminal = React.forwardRef<HTMLDivElement, TerminalProps>(
  ({ title = "bash", lines, className, ...props }, ref) => (
    <div ref={ref} className={cn("aui-terminal", className)} {...props}>
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
            <span key={i} className={cn("aui-terminal-line", `aui-terminal-${kind}`)}>
              {text}
            </span>
          );
        })}
      </div>
    </div>
  )
);

Terminal.displayName = "Terminal";
