import * as React from "react";
import { cn } from "@/lib/utils";

export type TerminalLine =
  | string
  | { text: string; kind?: "cmd" | "out" | "ok" | "err" };

export interface TerminalProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  lines: TerminalLine[];
}

export function Terminal({
  title = "bash",
  lines,
  className,
  ...props
}: TerminalProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-[#070709] text-[#ececf1] font-mono text-[0.88rem] overflow-hidden shadow-md my-4",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-1.5 px-3 py-2 bg-[#121217] border-b border-[#24242c]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        <span className="text-xs text-muted-foreground font-sans ml-2 font-medium">
          {title}
        </span>
      </div>
      <div className="p-3.5 space-y-1.5 overflow-x-auto leading-relaxed">
        {lines.map((line, i) => {
          const { text, kind } =
            typeof line === "string"
              ? { text: line, kind: "cmd" as const }
              : { kind: "cmd" as const, ...line };

          let colorClass = "text-[#cfcfd6]";
          let prefix = "";

          if (kind === "cmd") {
            colorClass = "text-white font-medium";
            prefix = "$ ";
          } else if (kind === "ok") {
            colorClass = "text-emerald-400";
            prefix = "✔ ";
          } else if (kind === "err") {
            colorClass = "text-rose-400";
            prefix = "✖ ";
          }

          return (
            <div key={i} className={cn("whitespace-pre", colorClass)}>
              {prefix && (
                <span className="select-none opacity-60 mr-1.5">{prefix}</span>
              )}
              <span>{text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
