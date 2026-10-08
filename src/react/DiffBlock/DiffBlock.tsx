import React from "react";
import { FileIcon } from "../Icons";
import { cn } from "../../utils/cn";

export type DiffCoverage = "covered" | "uncovered" | "partial";
export type DiffView = "unified" | "split";

export interface DiffSegment {
  text: string;
  changed?: boolean;
}

export interface DiffLine {
  type: "add" | "del" | "normal" | "meta";
  content: string;
  oldNum?: number | string;
  newNum?: number | string;
  /** Test coverage of this line in the new file. Rendered when `showCoverage` is set. */
  coverage?: DiffCoverage;
  /** Pre-computed intra-line segments. Overrides automatic word highlighting. */
  segments?: DiffSegment[];
  /** Author or reviewer annotation rendered beneath the line. */
  note?: string;
}

export type DiffRow =
  | { kind: "line"; line: DiffLine }
  | { kind: "pair"; left?: DiffLine; right?: DiffLine }
  | { kind: "fold"; rows: DiffRow[]; count: number };

export type DiffFileStatus = "added" | "deleted" | "renamed" | "modified";

export interface DiffBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  file?: string;
  diff?: string;
  lines?: DiffLine[];
  /** File status badge shown in the header ('added' | 'deleted' | 'renamed' | 'modified'). */
  status?: DiffFileStatus;
  fileStatus?: DiffFileStatus;
  /** `unified` (default) or side-by-side `split`. */
  view?: DiffView;
  /** Keep N unchanged lines around each change and fold the rest. `false` shows everything. */
  collapseContext?: number | false;
  /** Paint a coverage rail from each line's `coverage` value. */
  showCoverage?: boolean;
  /** Highlight changed words inside paired deleted/added lines. Default true. */
  highlightWords?: boolean;
}

const HUNK_RE = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/;
const FILE_HEADER_RE = /^(diff --git |index |--- |\+\+\+ |new file mode|deleted file mode|similarity index|rename (from|to) )/;

export function parseDiff(raw: string): { lines: DiffLine[]; adds: number; dels: number } {
  const rawLines = raw.replace(/\s+$/, "").replace(/^\n+/, "").split("\n");
  const hasHunks = rawLines.some((l) => l.startsWith("@@"));
  const lines: DiffLine[] = [];
  let adds = 0;
  let dels = 0;
  let oldIndex = 1;
  let newIndex = 1;
  let inHunk = false;

  for (const line of rawLines) {
    if (line.startsWith("@@")) {
      const m = HUNK_RE.exec(line);
      if (m) {
        oldIndex = parseInt(m[1], 10);
        newIndex = parseInt(m[2], 10);
      }
      inHunk = true;
      lines.push({ type: "meta", content: line, oldNum: "...", newNum: "..." });
    } else if (hasHunks && !inHunk && FILE_HEADER_RE.test(line)) {
      continue;
    } else if (line.startsWith("\\")) {
      lines.push({ type: "meta", content: line });
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

function tokenize(s: string): string[] {
  return s.match(/\s+|[A-Za-z0-9_]+|[^\sA-Za-z0-9_]/g) ?? [];
}

function wordSegments(oldText: string, newText: string): [DiffSegment[], DiffSegment[]] | null {
  const a = tokenize(oldText);
  const b = tokenize(newText);
  let p = 0;
  while (p < a.length && p < b.length && a[p] === b[p]) p++;
  let s = 0;
  while (s < a.length - p && s < b.length - p && a[a.length - 1 - s] === b[b.length - 1 - s]) s++;
  if (p === 0 && s === 0) return null;
  if (p + s >= a.length && p + s >= b.length) return null;

  const build = (t: string[]): DiffSegment[] => {
    const segs: DiffSegment[] = [];
    const pre = t.slice(0, p).join("");
    const mid = t.slice(p, t.length - s).join("");
    const suf = t.slice(t.length - s).join("");
    if (pre) segs.push({ text: pre });
    if (mid) segs.push({ text: mid, changed: true });
    if (suf) segs.push({ text: suf });
    return segs;
  };
  return [build(a), build(b)];
}

/** Splits lines into [delRun, addRun] groups (either may be empty) and passthrough singles. */
function groupRuns(lines: DiffLine[]): { dels: DiffLine[]; adds: DiffLine[]; single?: DiffLine }[] {
  const groups: { dels: DiffLine[]; adds: DiffLine[]; single?: DiffLine }[] = [];
  let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (l.type === "del" || l.type === "add") {
      const dels: DiffLine[] = [];
      const adds: DiffLine[] = [];
      while (i < lines.length && lines[i].type === "del") dels.push(lines[i++]);
      while (i < lines.length && lines[i].type === "add") adds.push(lines[i++]);
      groups.push({ dels, adds });
    } else {
      groups.push({ dels: [], adds: [], single: l });
      i++;
    }
  }
  return groups;
}

function annotateWords(lines: DiffLine[]): DiffLine[] {
  const out = lines.map((l) => ({ ...l }));
  const byRef = new Map<DiffLine, DiffLine>(lines.map((l, i) => [l, out[i]]));
  for (const g of groupRuns(lines)) {
    const n = Math.min(g.dels.length, g.adds.length);
    for (let k = 0; k < n; k++) {
      const d = byRef.get(g.dels[k])!;
      const a = byRef.get(g.adds[k])!;
      if (d.segments || a.segments) continue;
      const segs = wordSegments(d.content, a.content);
      if (segs) {
        d.segments = segs[0];
        a.segments = segs[1];
      }
    }
  }
  return out;
}

function rowIsChanged(row: DiffRow): boolean {
  if (row.kind === "line") return row.line.type === "add" || row.line.type === "del";
  if (row.kind === "pair") return [row.left, row.right].some((l) => l && l.type !== "normal");
  return false;
}

function rowIsPinned(row: DiffRow): boolean {
  if (row.kind === "line") return row.line.type === "meta" || Boolean(row.line.note);
  if (row.kind === "pair") return [row.left, row.right].some((l) => l && l.note);
  return true;
}

export function buildDiffRows(
  inputLines: DiffLine[],
  opts: { view?: DiffView; collapseContext?: number | false; highlightWords?: boolean } = {}
): DiffRow[] {
  const { view = "unified", collapseContext = false, highlightWords = true } = opts;
  const lines = highlightWords ? annotateWords(inputLines) : inputLines;

  let rows: DiffRow[];
  if (view === "split") {
    rows = [];
    for (const g of groupRuns(lines)) {
      if (g.single) {
        rows.push(
          g.single.type === "meta"
            ? { kind: "line", line: g.single }
            : { kind: "pair", left: g.single, right: g.single }
        );
        continue;
      }
      const n = Math.max(g.dels.length, g.adds.length);
      for (let k = 0; k < n; k++) rows.push({ kind: "pair", left: g.dels[k], right: g.adds[k] });
    }
  } else {
    rows = lines.map((line) => ({ kind: "line", line }));
  }

  if (collapseContext === false || collapseContext < 0) return rows;

  const keep = rows.map(rowIsPinned);
  rows.forEach((r, i) => {
    if (!rowIsChanged(r)) return;
    for (let k = Math.max(0, i - collapseContext); k <= Math.min(rows.length - 1, i + collapseContext); k++) {
      keep[k] = true;
    }
  });

  const out: DiffRow[] = [];
  let i = 0;
  while (i < rows.length) {
    if (keep[i]) {
      out.push(rows[i++]);
      continue;
    }
    const start = i;
    while (i < rows.length && !keep[i]) i++;
    const hidden = rows.slice(start, i);
    if (hidden.length >= 2) out.push({ kind: "fold", rows: hidden, count: hidden.length });
    else out.push(...hidden);
  }
  return out;
}

const SYMBOLS: Record<DiffLine["type"], string> = { add: "+", del: "-", meta: "@", normal: " " };

const LINE_CLASS: Record<DiffLine["type"], string> = {
  add: "aui-diff-line-add",
  del: "aui-diff-line-del",
  meta: "aui-diff-line-meta",
  normal: "aui-diff-line-normal",
};

function renderText(l: DiffLine) {
  if (!l.segments) return l.content;
  return l.segments.map((s, i) =>
    s.changed ? (
      <span key={i} className="aui-diff-word">
        {s.text}
      </span>
    ) : (
      <React.Fragment key={i}>{s.text}</React.Fragment>
    )
  );
}

function CoverageRail({ coverage, show }: { coverage?: DiffCoverage; show: boolean }) {
  if (!show) return null;
  return (
    <span
      className={cn("aui-diff-cov", coverage && `aui-diff-cov-${coverage}`)}
      title={coverage ? `Coverage: ${coverage}` : undefined}
      aria-label={coverage ? `Coverage: ${coverage}` : undefined}
    />
  );
}

function UnifiedLine({ l, showCoverage }: { l: DiffLine; showCoverage: boolean }) {
  if (l.type === "meta") {
    return (
      <>
        <div className="aui-diff-line-meta-row select-none">
          <span>{renderText(l)}</span>
        </div>
        {l.note && <div className="aui-diff-note">{l.note}</div>}
      </>
    );
  }
  return (
    <>
      <div className={cn("aui-diff-line", LINE_CLASS[l.type])}>
        <CoverageRail coverage={l.coverage} show={showCoverage} />
        <span className="aui-diff-gutter">
          <span className="aui-diff-num">{l.oldNum ?? ""}</span>
          <span className="aui-diff-num">{l.newNum ?? ""}</span>
        </span>
        <span className="aui-diff-symbol">{SYMBOLS[l.type]}</span>
        <span className="aui-diff-text">{renderText(l)}</span>
      </div>
      {l.note && <div className="aui-diff-note">{l.note}</div>}
    </>
  );
}

function SplitHalf({ l, side, showCoverage }: { l?: DiffLine; side: "left" | "right"; showCoverage: boolean }) {
  if (!l) return <div className="aui-diff-half aui-diff-half-empty" />;
  if (l.type === "meta") {
    return (
      <div className="aui-diff-line-meta-row select-none">
        <span>{renderText(l)}</span>
      </div>
    );
  }
  return (
    <div className={cn("aui-diff-half", LINE_CLASS[l.type])}>
      {side === "right" && <CoverageRail coverage={l.coverage} show={showCoverage} />}
      <span className="aui-diff-gutter">
        <span className="aui-diff-num">{side === "left" ? l.oldNum ?? "" : l.newNum ?? ""}</span>
      </span>
      <span className="aui-diff-symbol">{SYMBOLS[l.type]}</span>
      <span className="aui-diff-text">{renderText(l)}</span>
    </div>
  );
}

function Rows({ rows, showCoverage }: { rows: DiffRow[]; showCoverage: boolean }) {
  return (
    <>
      {rows.map((row, idx) => {
        if (row.kind === "line") return <UnifiedLine key={idx} l={row.line} showCoverage={showCoverage} />;
        if (row.kind === "pair") {
          const note = row.right?.note ?? row.left?.note;
          return (
            <React.Fragment key={idx}>
              <div className="aui-diff-row-split">
                <SplitHalf l={row.left} side="left" showCoverage={showCoverage} />
                <SplitHalf l={row.right} side="right" showCoverage={showCoverage} />
              </div>
              {note && <div className="aui-diff-note">{note}</div>}
            </React.Fragment>
          );
        }
        return (
          <details key={idx} className="aui-diff-fold">
            <summary>{row.count} unchanged lines</summary>
            <Rows rows={row.rows} showCoverage={showCoverage} />
          </details>
        );
      })}
    </>
  );
}

export const DiffBlock = React.forwardRef<HTMLDivElement, DiffBlockProps>(
  (
    {
      file,
      status,
      fileStatus,
      diff,
      lines: customLines,
      view = "unified",
      collapseContext = false,
      showCoverage = false,
      highlightWords = true,
      className,
      ...props
    },
    ref
  ) => {
    const parsed = diff ? parseDiff(diff) : { lines: customLines || [], adds: 0, dels: 0 };
    const lines = customLines || parsed.lines;
    const adds = customLines ? customLines.filter((l) => l.type === "add").length : parsed.adds;
    const dels = customLines ? customLines.filter((l) => l.type === "del").length : parsed.dels;
    const rows = buildDiffRows(lines, { view, collapseContext, highlightWords });
    const effectiveStatus = status || fileStatus;

    return (
      <div
        ref={ref}
        className={cn("aui-diff", view === "split" && "aui-diff-split", className)}
        {...props}
      >
        {file && (
          <div className="aui-diff-header">
            <div className="aui-diff-file">
              <FileIcon size={14} />
              <span>{file}</span>
              {effectiveStatus && (
                <span className={cn("aui-diff-status-badge", `is-${effectiveStatus}`)}>
                  {effectiveStatus === "added" ? "+ added" : effectiveStatus === "deleted" ? "− deleted" : effectiveStatus}
                </span>
              )}
            </div>
            <div className="aui-diff-stats">
              {adds > 0 && <span className="aui-diff-stat-add">+{adds}</span>}
              {dels > 0 && <span className="aui-diff-stat-del">-{dels}</span>}
            </div>
          </div>
        )}
        <div className="aui-diff-content">
          <Rows rows={rows} showCoverage={showCoverage} />
        </div>
      </div>
    );
  }
);

DiffBlock.displayName = "DiffBlock";
