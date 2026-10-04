import * as React from "react";
import { cn } from "@/lib/utils";

export interface DiffLine {
  type: "add" | "del" | "normal" | "meta";
  content: string;
  oldNum?: number | string;
  newNum?: number | string;
}

export interface DiffBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  file?: string;
  diff?: string;
  lines?: DiffLine[];
}

export function parseDiff(raw: string): { lines: DiffLine[]; adds: number; dels: number } {
  const rawLines = raw.trim().split("\n");
  const lines: DiffLine[] = [];
  let adds = 0;
  let dels = 0;
  let oldIndex = 1;
  let newIndex = 1;

  for (const line of rawLines) {
    if (line.startsWith("@@")) {
      lines.push({ type: "meta", content: line, oldNum: "...", newNum: "..." });
    } else if (line.startsWith("+")) {
      adds++;
      lines.push({ type: "add", content: line.slice(1), newNum: newIndex++ });
    } else if (line.startsWith("-")) {
      dels++;
      lines.push({ type: "del", content: line.slice(1), oldNum: oldIndex++ });
    } else {
      lines.push({
        type: "normal",
        content: line.startsWith(" ") ? line.slice(1) : line,
        oldNum: oldIndex++,
        newNum: newIndex++,
      });
    }
  }

  return { lines, adds, dels };
}

export function DiffBlock({
  file,
  diff,
  lines: customLines,
  className,
  ...props
}: DiffBlockProps) {
  const parsed = React.useMemo(() => (diff ? parseDiff(diff) : { lines: customLines || [], adds: 0, dels: 0 }), [diff, customLines]);
  const lines = customLines || parsed.lines;
  const adds = customLines ? customLines.filter((l) => l.type === "add").length : parsed.adds;
  const dels = customLines ? customLines.filter((l) => l.type === "del").length : parsed.dels;

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-[#070709] text-[#ececf1] font-mono text-[0.84rem] overflow-hidden shadow-md my-4",
        className
      )}
      {...props}
    >
      {file && (
        <div className="flex items-center justify-between px-3.5 py-2 bg-[#121217] border-b border-[#24242c] text-xs">
          <span className="text-zinc-300 font-medium">{file}</span>
          <div className="flex items-center gap-2 font-mono text-[0.75rem]">
            {adds > 0 && <span className="text-emerald-400">+{adds}</span>}
            {dels > 0 && <span className="text-rose-400">-{dels}</span>}
          </div>
        </div>
      )}
      <div className="p-2 overflow-x-auto leading-relaxed">
        {lines.map((l, idx) => {
          let lineBg = "hover:bg-zinc-800/40";
          let textColor = "text-zinc-300";
          let symbol = " ";

          if (l.type === "add") {
            lineBg = "bg-emerald-950/40 text-emerald-300 border-l-2 border-emerald-500";
            textColor = "text-emerald-300";
            symbol = "+";
          } else if (l.type === "del") {
            lineBg = "bg-rose-950/40 text-rose-300 border-l-2 border-rose-500";
            textColor = "text-rose-300";
            symbol = "-";
          } else if (l.type === "meta") {
            lineBg = "text-cyan-400 bg-cyan-950/20";
            textColor = "text-cyan-400 font-semibold";
            symbol = "@";
          }

          return (
            <div
              key={idx}
              className={cn(
                "flex items-center px-2 py-0.5 rounded-xs transition-colors",
                lineBg
              )}
            >
              <span className="w-12 select-none text-[0.72rem] text-zinc-600 font-mono text-right pr-3 flex-shrink-0">
                {l.oldNum ?? " "} {l.newNum ?? " "}
              </span>
              <span className="w-4 select-none text-zinc-500 font-semibold flex-shrink-0">
                {symbol}
              </span>
              <span className={cn("whitespace-pre flex-1", textColor)}>
                {l.content}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
