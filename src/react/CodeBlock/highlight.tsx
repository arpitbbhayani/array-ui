import React from "react";

const KEYWORDS = new Set(
  (
    "import export from default as const let var function return if else for while do switch case break continue new class extends " +
    "async await try catch finally throw typeof instanceof in of interface type enum implements public private protected static readonly " +
    "def lambda pass raise with yield None True False self elif except is not and or " +
    "func go defer chan struct package range select map var nil " +
    "true false null undefined void " +
    "npm npx git cd ls echo cat grep curl sudo docker kubectl make"
  ).split(" ")
);

// Order matters: first alternative that matches at a position wins.
const TOKEN = new RegExp(
  [
    "(\\/\\*[\\s\\S]*?\\*\\/|<!--[\\s\\S]*?-->|\\/\\/[^\\n]*|(?<![\\w$])#[^\\n]*)", // 1 comment
    "(\"(?:\\\\.|[^\"\\\\\\n])*\"|'(?:\\\\.|[^'\\\\\\n])*'|`(?:\\\\.|[^`\\\\])*`)", // 2 string
    "(<\\/?[A-Za-z][\\w.-]*)", // 3 tag open
    "(\\b\\d+(?:\\.\\d+)?\\b)", // 4 number
    "([A-Za-z_$][\\w$]*)(?=\\s*\\()", // 5 function call
    "(\\b[A-Z][A-Za-z0-9]*\\b)", // 6 Type
    "([A-Za-z_$][\\w$-]*)(?==)", // 7 attribute
    "([A-Za-z_$][\\w$]*)", // 8 word
  ].join("|"),
  "g"
);

/** Lightweight, dependency-free highlighter good enough for docs snippets. */
export function highlight(code: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of code.matchAll(TOKEN)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(code.slice(last, idx));
    const [text, comment, str, tag, num, fn, type, attr, word] = m;
    let cls: string | null = null;
    if (comment) cls = "c";
    else if (str) cls = "s";
    else if (tag) cls = "t";
    else if (num) cls = "n";
    else if (fn) cls = KEYWORDS.has(fn) ? "k" : "f";
    else if (type) cls = "t";
    else if (attr) cls = "a";
    else if (word && KEYWORDS.has(word)) cls = "k";
    out.push(cls ? <span key={key++} className={`aui-tok-${cls}`}>{text}</span> : text);
    last = idx + text.length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}
