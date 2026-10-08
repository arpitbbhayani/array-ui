import * as React from "react";
import { cn } from "@/lib/utils";

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

const LINE_STYLE: Record<DiffLine["type"], string> = {
  add: "bg-emerald-950/40 text-emerald-300 border-l-2 border-emerald-500",
  del: "bg-rose-950/40 text-rose-300 border-l-2 border-rose-500",
  meta: "text-cyan-400 bg-cyan-950/20 font-semibold",
  normal: "text-zinc-300 hover:bg-zinc-800/40",
};

const WORD_STYLE: Record<DiffLine["type"], string> = {
  add: "bg-emerald-500/30 rounded-xs",
  del: "bg-rose-500/30 rounded-xs",
  meta: "",
  normal: "",
};

const COVERAGE_STYLE: Record<DiffCoverage, string> = {
  covered: "bg-emerald-500",
  uncovered: "bg-rose-500",
  partial: "bg-amber-400",
};

function renderText(l: DiffLine) {
  if (!l.segments) return l.content;
  return l.segments.map((s, i) =>
    s.changed ? (
      <span key={i} className={WORD_STYLE[l.type]}>
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
      className={cn("self-stretch w-[3px] mr-2 rounded-xs flex-shrink-0", coverage && COVERAGE_STYLE[coverage])}
      title={coverage ? `Coverage: ${coverage}` : undefined}
      aria-label={coverage ? `Coverage: ${coverage}` : undefined}
    />
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="pl-[4.25rem] pr-3.5 py-1.5 bg-amber-950/25 border-l-2 border-amber-400 text-xs text-zinc-300 font-sans leading-snug">
      {children}
    </div>
  );
}

function UnifiedLine({ l, showCoverage }: { l: DiffLine; showCoverage: boolean }) {
  if (l.type === "meta") {
    return (
      <>
        <div className="flex items-center px-4 py-1 text-xs italic text-zinc-500 bg-[#121217]/60 border-y border-[#24242c]/50 font-mono select-none">
          <span>{renderText(l)}</span>
        </div>
        {l.note && <Note>{l.note}</Note>}
      </>
    );
  }
  return (
    <>
      <div className={cn("flex items-start px-2 py-0.5 rounded-xs transition-colors whitespace-pre", LINE_STYLE[l.type])}>
        <CoverageRail coverage={l.coverage} show={showCoverage} />
        <span className="flex gap-2 pr-3 select-none text-[0.72rem] text-zinc-600 flex-shrink-0">
          <span className="min-w-[3ch] text-right">{l.oldNum ?? ""}</span>
          <span className="min-w-[3ch] text-right">{l.newNum ?? ""}</span>
        </span>
        <span className="w-4 select-none text-zinc-500 font-semibold flex-shrink-0">{SYMBOLS[l.type]}</span>
        <span className="flex-1">{renderText(l)}</span>
      </div>
      {l.note && <Note>{l.note}</Note>}
    </>
  );
}

function SplitHalf({ l, side, showCoverage }: { l?: DiffLine; side: "left" | "right"; showCoverage: boolean }) {
  if (!l) return <div className="bg-zinc-900/60" />;
  if (l.type === "meta") {
    return (
      <div className="flex items-center px-4 py-1 text-xs italic text-zinc-500 bg-[#121217]/60 border-y border-[#24242c]/50 font-mono select-none">
        <span>{renderText(l)}</span>
      </div>
    );
  }
  return (
    <div
      className={cn(
        "flex items-start min-w-0 px-2 py-0.5 whitespace-pre",
        side === "right" && "border-l border-[#24242c]",
        LINE_STYLE[l.type]
      )}
    >
      {side === "right" && <CoverageRail coverage={l.coverage} show={showCoverage} />}
      <span className="pr-3 select-none text-[0.72rem] text-zinc-600 min-w-[3ch] text-right flex-shrink-0">
        {(side === "left" ? l.oldNum : l.newNum) ?? ""}
      </span>
      <span className="w-4 select-none text-zinc-500 font-semibold flex-shrink-0">{SYMBOLS[l.type]}</span>
      <span className="flex-1">{renderText(l)}</span>
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
              <div className="grid grid-cols-[minmax(20rem,1fr)_minmax(20rem,1fr)]">
                <SplitHalf l={row.left} side="left" showCoverage={showCoverage} />
                <SplitHalf l={row.right} side="right" showCoverage={showCoverage} />
              </div>
              {note && <Note>{note}</Note>}
            </React.Fragment>
          );
        }
        return (
          <details key={idx} className="group">
            <summary className="cursor-pointer list-none px-3.5 py-1 bg-[#121217] border-y border-[#24242c] text-xs italic text-zinc-500 hover:text-zinc-300 select-none [&::-webkit-details-marker]:hidden group-open:not-italic">
              {row.count} unchanged lines
            </summary>
            <Rows rows={row.rows} showCoverage={showCoverage} />
          </details>
        );
      })}
    </>
  );
}

export function DiffBlock({
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
}: DiffBlockProps) {
  const parsed = React.useMemo(
    () => (diff ? parseDiff(diff) : { lines: customLines || [], adds: 0, dels: 0 }),
    [diff, customLines]
  );
  const lines = customLines || parsed.lines;
  const adds = customLines ? customLines.filter((l) => l.type === "add").length : parsed.adds;
  const dels = customLines ? customLines.filter((l) => l.type === "del").length : parsed.dels;
  const rows = React.useMemo(
    () => buildDiffRows(lines, { view, collapseContext, highlightWords }),
    [lines, view, collapseContext, highlightWords]
  );
  const effectiveStatus = status || fileStatus;

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
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-zinc-300 font-medium truncate">{file}</span>
            {effectiveStatus && (
              <span
                className={cn(
                  "text-[0.68rem] font-mono uppercase px-1.5 py-0.5 rounded-xs font-medium tracking-wider",
                  effectiveStatus === "added" && "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
                  effectiveStatus === "deleted" && "bg-rose-500/15 text-rose-400 border border-rose-500/30",
                  effectiveStatus === "renamed" && "bg-amber-500/15 text-amber-400 border border-amber-500/30",
                  effectiveStatus === "modified" && "bg-zinc-700/30 text-zinc-400 border border-zinc-700/50"
                )}
              >
                {effectiveStatus === "added" ? "+ added" : effectiveStatus === "deleted" ? "− deleted" : effectiveStatus}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 font-mono text-[0.75rem] shrink-0">
            {adds > 0 && <span className="text-emerald-400">+{adds}</span>}
            {dels > 0 && <span className="text-rose-400">-{dels}</span>}
          </div>
        </div>
      )}
      <div className="py-2 overflow-x-auto leading-relaxed">
        <Rows rows={rows} showCoverage={showCoverage} />
      </div>
    </div>
  );
}
