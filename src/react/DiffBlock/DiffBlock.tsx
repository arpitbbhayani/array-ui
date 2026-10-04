import React from "react";
import { FileIcon } from "../Icons";

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
      // Reset counters based on chunk if wanted, or maintain
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

export const DiffBlock: React.FC<DiffBlockProps> = ({
  file,
  diff,
  lines: customLines,
  className = "",
  ...props
}) => {
  const parsed = diff ? parseDiff(diff) : { lines: customLines || [], adds: 0, dels: 0 };
  const lines = customLines || parsed.lines;
  const adds = customLines
    ? customLines.filter((l) => l.type === "add").length
    : parsed.adds;
  const dels = customLines
    ? customLines.filter((l) => l.type === "del").length
    : parsed.dels;

  return (
    <div className={`aui-diff ${className}`} {...props}>
      {file && (
        <div className="aui-diff-header">
          <div className="aui-diff-file">
            <FileIcon size={14} />
            <span>{file}</span>
          </div>
          <div className="aui-diff-stats">
            {adds > 0 && <span className="aui-diff-stat-add">+{adds}</span>}
            {dels > 0 && <span className="aui-diff-stat-del">-{dels}</span>}
          </div>
        </div>
      )}
      <div className="aui-diff-content">
        {lines.map((l, idx) => {
          let lineClass = "aui-diff-line-normal";
          let symbol = " ";
          if (l.type === "add") {
            lineClass = "aui-diff-line-add";
            symbol = "+";
          } else if (l.type === "del") {
            lineClass = "aui-diff-line-del";
            symbol = "-";
          } else if (l.type === "meta") {
            lineClass = "aui-diff-line-meta";
            symbol = "@";
          }

          return (
            <div key={idx} className={`aui-diff-line ${lineClass}`}>
              <span className="aui-diff-gutter">
                {l.oldNum ?? " "} {l.newNum ?? " "}
              </span>
              <span className="aui-diff-symbol">{symbol}</span>
              <span className="aui-diff-text">{l.content}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
