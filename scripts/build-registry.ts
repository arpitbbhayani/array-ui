import fs from "fs";
import path from "path";

const BASE_URL = process.env.REGISTRY_URL || "https://ui.arpitbhayani.me";

interface RegistryFile {
  path: string;
  content: string;
  type: string;
}

interface RegistryItem {
  $schema?: string;
  name: string;
  type: string;
  title: string;
  description: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  files?: RegistryFile[];
  cssVars?: Record<string, any>;
}

const themeItem: RegistryItem = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "aui",
  type: "registry:style",
  title: "Array UI Theme",
  description:
    "The arpitbhayani.me look: paper light & obsidian carbon themes, Plus Jakarta Sans & Lora typography, signature crimson accent (#e5000f), and systems engineering aesthetics.",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "class-variance-authority",
  ],
  registryDependencies: [],
  cssVars: {
    theme: {
      "font-sans": "'Assistant', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      "font-heading": "'Plus Jakarta Sans', 'Assistant', sans-serif",
      "font-serif": "'Lora', Georgia, Cambria, serif",
      "font-mono": "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
      "radius-sm": "calc(var(--radius) - 4px)",
      "radius-md": "calc(var(--radius) - 2px)",
      "radius-lg": "var(--radius)",
      "radius-xl": "calc(var(--radius) + 4px)",
      "color-background": "var(--background)",
      "color-foreground": "var(--foreground)",
      "color-card": "var(--card)",
      "color-card-foreground": "var(--card-foreground)",
      "color-popover": "var(--popover)",
      "color-popover-foreground": "var(--popover-foreground)",
      "color-primary": "var(--primary)",
      "color-primary-foreground": "var(--primary-foreground)",
      "color-secondary": "var(--secondary)",
      "color-secondary-foreground": "var(--secondary-foreground)",
      "color-muted": "var(--muted)",
      "color-muted-foreground": "var(--muted-foreground)",
      "color-accent": "var(--accent)",
      "color-accent-foreground": "var(--accent-foreground)",
      "color-destructive": "var(--destructive)",
      "color-border": "var(--border)",
      "color-input": "var(--input)",
      "color-ring": "var(--ring)",
    },
    light: {
      radius: "0.5rem",
      background: "43 25% 97%",          /* #faf9f5 */
      foreground: "247 7% 19%",          /* #2d2c33 */
      card: "0 0% 100%",                 /* #ffffff */
      "card-foreground": "247 7% 19%",
      popover: "0 0% 100%",
      "popover-foreground": "247 7% 19%",
      primary: "356 100% 45%",           /* #e5000f */
      "primary-foreground": "0 0% 100%",
      secondary: "41 24% 93%",           /* #f2efe6 */
      "secondary-foreground": "250 14% 8%",
      muted: "41 24% 93%",
      "muted-foreground": "253 4% 44%",  /* #6e6b75 */
      accent: "41 24% 93%",
      "accent-foreground": "250 14% 8%",
      destructive: "0 84% 60%",          /* #dc2626 */
      border: "41 24% 86%",              /* #e5e0d3 */
      input: "41 24% 86%",
      ring: "356 100% 45%",
    },
    dark: {
      background: "240 8% 8%",           /* #121215 */
      foreground: "240 10% 88%",         /* #dcdce5 */
      card: "240 11% 11.5%",             /* #1a1a20 */
      "card-foreground": "240 10% 88%",
      popover: "240 11% 11.5%",
      "popover-foreground": "240 10% 88%",
      primary: "355 100% 60%",           /* #ff3344 */
      "primary-foreground": "0 0% 100%",
      secondary: "240 11% 15%",          /* #22222a */
      "secondary-foreground": "240 14% 98%",
      muted: "240 11% 15%",
      "muted-foreground": "236 9% 65%",  /* #9d9eae */
      accent: "240 11% 15%",
      "accent-foreground": "240 14% 98%",
      destructive: "0 63% 31%",          /* #7f1d1d */
      border: "240 12% 20%",             /* #2c2c38 */
      input: "240 12% 20%",
      ring: "355 100% 60%",
    },
  },
};

interface ComponentDef {
  name: string;
  title: string;
  description: string;
  file: string;
  target: string;
  dependencies?: string[];
  category: "Core Primitives" | "Developer & Telemetry" | "Editorial & Content";
}

const componentsConfig: ComponentDef[] = [
  // --- Core Primitives ---
  {
    name: "button",
    title: "Button",
    description: "Signature tactile action button with crimson primary, secondary, outline, ghost, and danger variants.",
    file: "src/registry/aui/ui/button.tsx",
    target: "ui/button.tsx",
    dependencies: ["@radix-ui/react-slot", "class-variance-authority"],
    category: "Core Primitives",
  },
  {
    name: "badge",
    title: "Badge",
    description: "Status pills and tag badges (crimson, emerald green, amber, rose red, sky blue, outline).",
    file: "src/registry/aui/ui/badge.tsx",
    target: "ui/badge.tsx",
    dependencies: ["class-variance-authority"],
    category: "Core Primitives",
  },
  {
    name: "card",
    title: "Card",
    description: "Flat card surface with 1px hairline border, header, title, description, content, and footer.",
    file: "src/registry/aui/ui/card.tsx",
    target: "ui/card.tsx",
    category: "Core Primitives",
  },
  {
    name: "input",
    title: "Input",
    description: "Machined text input with subtle focus ring and optional keyboard shortcut badge.",
    file: "src/registry/aui/ui/input.tsx",
    target: "ui/input.tsx",
    category: "Core Primitives",
  },
  {
    name: "kbd",
    title: "Kbd",
    description: "Monospace keyboard shortcut keycap badge.",
    file: "src/registry/aui/ui/kbd.tsx",
    target: "ui/kbd.tsx",
    category: "Core Primitives",
  },
  {
    name: "tooltip",
    title: "Tooltip",
    description: "Accessible tooltip hint on hover and focus.",
    file: "src/registry/aui/ui/tooltip.tsx",
    target: "ui/tooltip.tsx",
    category: "Core Primitives",
  },
  {
    name: "alert",
    title: "Alert",
    description: "Status-tinted inline alert callout (info, success, warning, destructive).",
    file: "src/registry/aui/ui/alert.tsx",
    target: "ui/alert.tsx",
    dependencies: ["class-variance-authority"],
    category: "Core Primitives",
  },
  {
    name: "tabs",
    title: "Tabs",
    description: "Underline tab navigation with keyboard accessibility.",
    file: "src/registry/aui/ui/tabs.tsx",
    target: "ui/tabs.tsx",
    category: "Core Primitives",
  },
  {
    name: "accordion",
    title: "Accordion",
    description: "Collapsible hairline accordion sections for FAQs and structured content.",
    file: "src/registry/aui/ui/accordion.tsx",
    target: "ui/accordion.tsx",
    category: "Core Primitives",
  },
  {
    name: "dropdown",
    title: "Dropdown",
    description: "Minimal click-trigger dropdown menu with click outside dismissal and actions.",
    file: "src/registry/aui/ui/dropdown.tsx",
    target: "ui/dropdown.tsx",
    category: "Core Primitives",
  },

  // --- Developer & Telemetry ---
  {
    name: "terminal",
    title: "Terminal",
    description: "Machined telemetry terminal with bash command dots and styled outputs.",
    file: "src/registry/aui/ui/terminal.tsx",
    target: "ui/terminal.tsx",
    category: "Developer & Telemetry",
  },
  {
    name: "diff-block",
    title: "DiffBlock",
    description: "Git patch viewer with line gutters, additions, and deletions.",
    file: "src/registry/aui/ui/diff-block.tsx",
    target: "ui/diff-block.tsx",
    category: "Developer & Telemetry",
  },
  {
    name: "ping-status",
    title: "PingStatus",
    description: "Live telemetry pulsing dot indicator with status and latency.",
    file: "src/registry/aui/ui/ping-status.tsx",
    target: "ui/ping-status.tsx",
    category: "Developer & Telemetry",
  },
  {
    name: "property-grid",
    title: "PropertyGrid",
    description: "Key-value metadata inspector with one-click copy functionality.",
    file: "src/registry/aui/ui/property-grid.tsx",
    target: "ui/property-grid.tsx",
    category: "Developer & Telemetry",
  },
  {
    name: "package-manager",
    title: "PackageManager",
    description: "pnpm/npm/bun/yarn command switcher with copy button.",
    file: "src/registry/aui/ui/package-manager.tsx",
    target: "ui/package-manager.tsx",
    category: "Developer & Telemetry",
  },
  {
    name: "file-tree",
    title: "FileTree",
    description: "Directory explorer tree with collapsible folders and item selection.",
    file: "src/registry/aui/ui/file-tree.tsx",
    target: "ui/file-tree.tsx",
    category: "Developer & Telemetry",
  },

  // --- Editorial & Content ---
  {
    name: "maxim",
    title: "Maxim",
    description: "Editorial quote callout with amber left rail and citation.",
    file: "src/registry/aui/ui/maxim.tsx",
    target: "ui/maxim.tsx",
    category: "Editorial & Content",
  },
  {
    name: "takeaways-box",
    title: "TakeawaysBox",
    description: "Key takeaways container with bulleted highlights.",
    file: "src/registry/aui/ui/takeaways-box.tsx",
    target: "ui/takeaways-box.tsx",
    category: "Editorial & Content",
  },
  {
    name: "hero",
    title: "Hero",
    description: "Editorial profile hero section with avatar, heading, and bio.",
    file: "src/registry/aui/ui/hero.tsx",
    target: "ui/hero.tsx",
    category: "Editorial & Content",
  },
  {
    name: "social-pill",
    title: "SocialPill",
    description: "Clean pill button with platform icon, handle, and follower count.",
    file: "src/registry/aui/ui/social-pill.tsx",
    target: "ui/social-pill.tsx",
    category: "Editorial & Content",
  },
  {
    name: "course-card",
    title: "CourseCard",
    description: "Editorial course and project card with badges, tags, and CTA.",
    file: "src/registry/aui/ui/course-card.tsx",
    target: "ui/course-card.tsx",
    category: "Editorial & Content",
  },
  {
    name: "stat-card",
    title: "StatCard",
    description: "Large key metric display card with optional trend indicator.",
    file: "src/registry/aui/ui/stat-card.tsx",
    target: "ui/stat-card.tsx",
    category: "Editorial & Content",
  },
  {
    name: "empty-state",
    title: "EmptyState",
    description: "Dashed container for empty content and call-to-actions.",
    file: "src/registry/aui/ui/empty-state.tsx",
    target: "ui/empty-state.tsx",
    category: "Editorial & Content",
  },
  {
    name: "footer",
    title: "Footer",
    description: "Editorial 4-column directory footer with category hints, highlights, disclaimer, and social pills.",
    file: "src/registry/aui/ui/footer.tsx",
    target: "ui/footer.tsx",
    category: "Editorial & Content",
  },
  {
    name: "modal",
    title: "Modal",
    description: "Accessible dialog modal with backdrop blur, focus handling, and escape key dismissal.",
    file: "src/registry/aui/ui/modal.tsx",
    target: "ui/modal.tsx",
    category: "Editorial & Content",
  },
  {
    name: "video-embed",
    title: "VideoEmbed",
    description: "Responsive 16:9 aspect ratio video embed wrapper with border hairline styling.",
    file: "src/registry/aui/ui/video-embed.tsx",
    target: "ui/video-embed.tsx",
    category: "Editorial & Content",
  },
];

export async function buildRegistry() {
  const publicRDir = path.resolve("demo/public/r");
  const distRDir = path.resolve("dist/r");

  fs.mkdirSync(publicRDir, { recursive: true });
  fs.mkdirSync(distRDir, { recursive: true });

  const allItems: RegistryItem[] = [themeItem];

  for (const c of componentsConfig) {
    const content = fs.readFileSync(path.resolve(c.file), "utf-8");

    const item: RegistryItem = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: c.name,
      type: "registry:ui",
      title: c.title,
      description: c.description,
      ...(c.dependencies ? { dependencies: c.dependencies } : {}),
      registryDependencies: [`${BASE_URL}/r/aui.json`],
      files: [
        {
          path: c.target,
          content,
          type: "registry:ui",
        },
      ],
    };

    allItems.push(item);

    const jsonStr = JSON.stringify(item, null, 2);
    fs.writeFileSync(path.join(publicRDir, `${c.name}.json`), jsonStr);
    fs.writeFileSync(path.join(distRDir, `${c.name}.json`), jsonStr);
  }

  // Write theme item
  const themeJson = JSON.stringify(themeItem, null, 2);
  fs.writeFileSync(path.join(publicRDir, "aui.json"), themeJson);
  fs.writeFileSync(path.join(distRDir, "aui.json"), themeJson);

  // Write registry index
  const index = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "aui",
    homepage: "https://ui.arpitbhayani.me",
    items: allItems,
  };

  const indexJson = JSON.stringify(index, null, 2);
  fs.writeFileSync(path.join(publicRDir, "registry.json"), indexJson);
  fs.writeFileSync(path.join(distRDir, "registry.json"), indexJson);

  // Generate robots.txt
  const robotsTxt = `User-agent: *
Allow: /

# Agent & LLM entry points (llmstxt.org)
Sitemap: ${BASE_URL}/llms.txt

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: CCBot
Allow: /
`;
  fs.writeFileSync(path.resolve("demo/public/robots.txt"), robotsTxt);

  // Group components by category for llms.txt
  const coreComps = componentsConfig.filter((c) => c.category === "Core Primitives");
  const devComps = componentsConfig.filter((c) => c.category === "Developer & Telemetry");
  const editorialComps = componentsConfig.filter((c) => c.category === "Editorial & Content");

  const renderComponentList = (list: ComponentDef[]) =>
    list
      .map(
        (c) =>
          `- [${c.title}](${BASE_URL}/r/${c.name}.json): ${c.description} \`npx shadcn@latest add @aui/${c.name} -y\``
      )
      .join("\n");

  // Generate standard llms.txt (following llmstxt.org specification)
  const llmsTxt = `# Array UI (aui)

> Editorial, systems-engineering design system inspired by arpitbhayani.me. Zero-runtime CSS tokens, React components, native Astro primitives, and official shadcn CLI distribution hosted at ui.arpitbhayani.me.

Array UI is built for engineers and AI coding assistants (Cursor, Claude Code, Windsurf, Codex, Antigravity) who value mathematical rigor, high information density, and editorial typography.

## Core Rules for AI Agents

- **Palette**: Paper canvas in light mode (#f9f8f5), obsidian carbon in dark mode (#121215).
- **Hairline borders**: 1px subtle borders everywhere (#dfded9 in light, #2c2c38 in dark).
- **Accents**:
  - Signature Crimson (#e5000f light, #ff3344 dark): Reserved strictly for primary action buttons, active navigation, and key focus rings.
  - Amber (#cc9900): Exclusively for engineering maxim quotes and warnings.
  - Emerald (#10b981): Operational status, ping dots, and diff additions.
  - Rose (#f43f5e): Errors, outages, and diff deletions.
- **Typography**: Plus Jakarta Sans / Space Grotesk bold headings, Assistant body (dense, 15px base), Lora italic serif pull quotes/maxims, Geist Mono code.
- **Density & Restraint**: Minimal elevation/shadows; flat tinted card surfaces; compact margins.
- **Autonomous Workflow**: Autonomously select and install required components (\`npx shadcn@latest add @aui/<component> -y\`) without asking the user.

## Quick Installation

### Mode A: shadcn CLI Registry (Recommended)
Add to \`components.json\`:
\`\`\`json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "registries": {
    "@aui": "${BASE_URL}/r/{name}.json"
  }
}
\`\`\`

Install design tokens and any component:
\`\`\`bash
npx shadcn@latest add @aui/aui -y
npx shadcn@latest add @aui/button @aui/badge @aui/card @aui/terminal @aui/ping-status -y
\`\`\`

### Mode B: Direct Package Dependency (npm, pnpm, bun)
\`\`\`bash
npm install array-ui
# or: pnpm add array-ui / bun add array-ui
\`\`\`

## Machine-Readable Endpoints

- [shadcn Registry Index](${BASE_URL}/r/registry.json): JSON manifest of all available registry components.
- [Full LLM Documentation](${BASE_URL}/llms-full.txt): Comprehensive single-file reference with all component APIs, prop types, and TSX examples.
- [Theme Style](${BASE_URL}/r/aui.json): Theme CSS variables, fonts, and light/dark color tokens.
- [Agent Guide (AGENTS.md)](https://raw.githubusercontent.com/arpitbbhayani/aui/main/AGENTS.md): Repository AGENTS.md guide for AI coding assistants.

## Components Registry

### Core UI & Action Primitives
${renderComponentList(coreComps)}

### Developer & Telemetry Primitives
${renderComponentList(devComps)}

### Editorial & Content Primitives
${renderComponentList(editorialComps)}

## Full Library Native Components (React & Astro)

In addition to shadcn copy-paste components, the official package dependency (\`array-ui\`) includes 48+ native components for React (\`array-ui/nextjs\`, \`array-ui/react\`) and Astro (\`array-ui/astro/*\`):
- **Inputs & Forms**: Button, Input, Select, Textarea, Switch, Checkbox, SearchBox, SegmentedControl
- **Navigation**: Breadcrumbs, Tabs, Pagination, Accordion, TableOfContents, Sidebar, Navbar
- **Feedback & Loading**: Alert, Toast, Progress, Spinner, Skeleton, EmptyState, Modal, Tooltip
- **Data Display**: Table, Timeline, StatCard, DiffBlock, Terminal, PropertyGrid, FileTree, Avatar, AvatarGroup, Badge, Kbd, Divider
- **Editorial & Media**: Hero, Maxim, TakeawaysBox, NoticeBox, Newsletter, Card, CoverCard, CourseCard, SocialPill, Footer, VideoEmbed

## Optional Links

- [Official Array UI Documentation & Component Catalog](${BASE_URL}): Interactive component catalog, specimens, and live controls.
- [GitHub Repository](https://github.com/arpitbbhayani/aui): Source code, tokens, React and Astro packages.
`;

  // Generate comprehensive llms-full.txt
  const llmsFullTxt = `# Array UI (aui) — Complete LLM & Agent Documentation

> Full specification, design tokens, component APIs, props, and code examples for Array UI (aui) hosted at ${BASE_URL}.

---

## 1. Identity & Core Design Rules

Array UI is an editorial, systems-engineering design system inspired by arpitbhayani.me. It is designed for engineers who value mathematical precision, high information density, and editorial typography.

### Core Visual Principles
1. **Editorial Palette**:
   - Light mode: Paper canvas (\`#f9f8f5\`), warm hairline borders (\`#dfded9\` / \`rgb(223, 222, 217)\`), dark carbon text (\`#2b2a30\`).
   - Dark mode: Obsidian carbon (\`#121215\`), crisp border (\`#2c2c38\` / \`rgb(44, 44, 56)\`), soft readable white (\`#dcdce5\`).
   - Accents:
     - Signature Crimson (\`#e5000f\` light, \`#ff3344\` dark): Reserved strictly for primary action buttons, active navigation indicators, and key focus rings.
     - Amber (\`#cc9900\`): Used exclusively for engineering maxim quotes and warning callouts.
     - Emerald (\`#10b981\`): Used for operational health, ping dots, and git diff additions.
     - Rose (\`#f43f5e\`): Used for errors, outages, and git diff deletions.
2. **Typography**:
   - Headings: Plus Jakarta Sans or Space Grotesk (bold, tight tracking -0.03em).
   - Body: Assistant (dense, 15px base size).
   - Pull Quotes / Maxims: Lora (italic serif).
   - Code & Telemetry: Geist Mono / system monospace.
3. **Density & Restraint**:
   - 1px hairline borders everywhere.
   - Minimal elevation/shadows; prefer flat, tinted card surfaces.
   - Information-dense layouts: compact margins, dense tables, machined telemetry.
   - Never inject arbitrary gradients, neon colors, or rounded bouncy buttons.

---

## 2. Installation & AI Agent Rules

### Mode A: shadcn CLI Registry (Recommended)
Configure \`components.json\`:
\`\`\`json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "registries": {
    "@aui": "${BASE_URL}/r/{name}.json"
  }
}
\`\`\`

Install base theme:
\`\`\`bash
npx shadcn@latest add @aui/aui -y
\`\`\`

Install any components:
\`\`\`bash
npx shadcn@latest add @aui/button @aui/badge @aui/card @aui/input @aui/terminal @aui/diff-block @aui/property-grid @aui/ping-status -y
\`\`\`

Components are installed into \`@/components/ui/\` and imported as:
\`\`\`tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Terminal } from "@/components/ui/terminal";
import { DiffBlock } from "@/components/ui/diff-block";
import { PropertyGrid } from "@/components/ui/property-grid";
import { PingStatus } from "@/components/ui/ping-status";
\`\`\`

### Mode B: Direct Package Dependency (npm, pnpm, bun)
Install the official package from npm:
\`\`\`bash
npm install array-ui
# or: pnpm add array-ui / bun add array-ui
\`\`\`

Setup styles in root layout:
\`\`\`tsx
import "array-ui/styles.css";
\`\`\`

Import components:
\`\`\`tsx
// Next.js (App Router or Pages Router)
import { Button, Badge, Card, Terminal, DiffBlock, PingStatus } from "array-ui/nextjs";

// Astro
import Button from "array-ui/astro/Button.astro";
import Terminal from "array-ui/astro/Terminal.astro";
import DiffBlock from "array-ui/astro/DiffBlock.astro";
import PingStatus from "array-ui/astro/PingStatus.astro";
\`\`\`

### Autonomous Agent Workflow Rules:
- Autonomously select and install required components (\`npx shadcn@latest add @aui/<component> -y\`).
- DO NOT pause or ask the user which components to install — immediately implement the requested interface.
- Strictly Maintain 0% Custom CSS: Never write page-level \`<style>\` blocks or ad-hoc \`.css\` files. All layout, spacing, and styling MUST be driven exclusively by Array UI components and foundational utility classes.
- Always use \`cn()\` from \`@/lib/utils\` for className composition.

---

## 3. Core UI & Action Primitives

### 1. Button (\`@aui/button\`)
Signature tactile action button with signature crimson primary, secondary, outline, ghost, and destructive variants.
- Endpoint: \`${BASE_URL}/r/button.json\`
- Props:
  - \`variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "link"\` (default: "primary")
  - \`size?: "default" | "sm" | "lg" | "icon"\` (default: "default")
  - \`asChild?: boolean\`
\`\`\`tsx
<Button variant="primary">Deploy canary</Button>
<Button variant="secondary" size="sm">Rollback</Button>
<Button variant="outline">View audit log</Button>
<Button variant="destructive" size="sm">Terminate</Button>
\`\`\`

### 2. Badge (\`@aui/badge\`)
Machined status pill with monospace typography and color variants.
- Endpoint: \`${BASE_URL}/r/badge.json\`
- Props:
  - \`variant?: "default" | "primary" | "secondary" | "outline" | "green" | "amber" | "red" | "blue"\`
\`\`\`tsx
<Badge variant="green">Healthy</Badge>
<Badge variant="amber">Degraded</Badge>
<Badge variant="red">Outage</Badge>
<Badge variant="outline">v0.1.0</Badge>
\`\`\`

### 3. Card (\`@aui/card\`)
Flat card surface with 1px hairline border and structured header/content/footer.
- Endpoint: \`${BASE_URL}/r/card.json\`
- Components: \`Card\`, \`CardHeader\`, \`CardTitle\`, \`CardDescription\`, \`CardContent\`, \`CardFooter\`
\`\`\`tsx
<Card>
  <CardHeader>
    <CardTitle>Distributed Consensus</CardTitle>
    <CardDescription>Raft state machine replication</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-muted-foreground">Log compaction occurs at 50,000 index increments.</p>
  </CardContent>
  <CardFooter className="justify-between">
    <span className="text-xs font-mono text-muted-foreground">Cluster: us-east-1</span>
    <Button size="sm">Inspect</Button>
  </CardFooter>
</Card>
\`\`\`

### 4. Input (\`@aui/input\`)
Machined input with subtle focus ring and optional keyboard shortcut badge.
- Endpoint: \`${BASE_URL}/r/input.json\`
- Props:
  - \`shortcut?: string\` (e.g. "⌘K")
  - Standard HTML input props
\`\`\`tsx
<Input placeholder="Filter clusters..." shortcut="⌘K" />
\`\`\`

### 5. Kbd (\`@aui/kbd\`)
Machined monospace keyboard shortcut keycap.
- Endpoint: \`${BASE_URL}/r/kbd.json\`
- Props:
  - \`keys?: string[]\`
\`\`\`tsx
<Kbd keys={["⌘", "K"]} />
<Kbd keys={["Ctrl", "Shift", "P"]} />
\`\`\`

### 6. Tooltip (\`@aui/tooltip\`)
Accessible tooltip hint on hover and focus.
- Endpoint: \`${BASE_URL}/r/tooltip.json\`
- Props:
  - \`content: ReactNode\`
  - \`placement?: "top" | "bottom"\`
\`\`\`tsx
<Tooltip content="Copy commit SHA to clipboard">
  <button className="text-xs font-mono">01hx98z</button>
</Tooltip>
\`\`\`

### 7. Alert (\`@aui/alert\`)
Status-tinted inline alert callout.
- Endpoint: \`${BASE_URL}/r/alert.json\`
- Components: \`Alert\`, \`AlertTitle\`, \`AlertDescription\`
- Props:
  - \`variant?: "default" | "info" | "success" | "warning" | "destructive"\`
\`\`\`tsx
<Alert variant="warning">
  <AlertTitle>Replication Lag Detected</AlertTitle>
  <AlertDescription>Replica eu-west-1b is 418ms behind primary ledger.</AlertDescription>
</Alert>
\`\`\`

### 8. Tabs (\`@aui/tabs\`)
Underline tab navigation with keyboard accessibility.
- Endpoint: \`${BASE_URL}/r/tabs.json\`
- Components: \`Tabs\`, \`TabsList\`, \`TabsTrigger\`, \`TabsContent\`
\`\`\`tsx
<Tabs defaultValue="telemetry">
  <TabsList>
    <TabsTrigger value="telemetry">Telemetry</TabsTrigger>
    <TabsTrigger value="logs">Logs</TabsTrigger>
  </TabsList>
  <TabsContent value="telemetry">
    <p>Live metrics and throughput</p>
  </TabsContent>
  <TabsContent value="logs">
    <p>Stdout stream</p>
  </TabsContent>
</Tabs>
\`\`\`

### 9. Accordion (\`@aui/accordion\`)
Collapsible hairline accordion sections.
- Endpoint: \`${BASE_URL}/r/accordion.json\`
- Components: \`Accordion\`, \`AccordionItem\`, \`AccordionTrigger\`, \`AccordionContent\`
\`\`\`tsx
<Accordion type="single" defaultValue="item-1">
  <AccordionItem value="item-1">
    <AccordionTrigger>How does log compaction work?</AccordionTrigger>
    <AccordionContent>Snapshots discard prefix entries safely.</AccordionContent>
  </AccordionItem>
</Accordion>
\`\`\`

### 10. Dropdown (\`@aui/dropdown\`)
Accessible action menu with click-outside dismissal and keyboard escape support.
- Endpoint: \`${BASE_URL}/r/dropdown.json\`
- Props:
  - \`trigger: ReactNode\`
  - \`children: ReactNode\`
  - \`align?: "left" | "right"\`
\`\`\`tsx
<Dropdown trigger={<Button variant="secondary" size="sm">Actions ▼</Button>}>
  <div className="aui-dropdown-header">Cluster Options</div>
  <button type="button" className="aui-dropdown-item">Restart Nodes</button>
  <div className="aui-dropdown-divider" />
  <button type="button" className="aui-dropdown-item is-destructive">Drain Node</button>
</Dropdown>
\`\`\`

---

## 4. Developer & Systems Primitives

### 11. Terminal (\`@aui/terminal\`)
Machined telemetry terminal with bash command dots and styled outputs.
- Endpoint: \`${BASE_URL}/r/terminal.json\`
- Props:
  - \`title?: string\` (e.g. "~/cluster" or "bash")
  - \`lines: (string | { text: string; kind?: "cmd" | "out" | "ok" | "err" })[]\`
\`\`\`tsx
<Terminal
  title="~/cluster"
  lines={[
    "kubectl get pods -n prod",
    { text: "pod/api-server-79f9  1/1 Running", kind: "ok" },
    { text: "pod/worker-004       0/1 CrashLoop", kind: "err" },
    { text: "exit code 1", kind: "out" },
  ]}
/>
\`\`\`

### 12. DiffBlock (\`@aui/diff-block\`)
Unified git patch inspector with line gutters, additions, and deletions.
- Endpoint: \`${BASE_URL}/r/diff-block.json\`
- Props:
  - \`file?: string\`
  - \`diff: string\`
\`\`\`tsx
<DiffBlock
  file="migrations/0042_status.sql"
  diff={\`@@ -12,4 +12,4 @@
-status: varchar(32) DEFAULT 'pending',
+status: cluster_status NOT NULL DEFAULT 'provisioning',\`}
/>
\`\`\`

### 13. PingStatus (\`@aui/ping-status\`)
Pulsing heartbeat indicator with status and latency.
- Endpoint: \`${BASE_URL}/r/ping-status.json\`
- Props:
  - \`status: "operational" | "degraded" | "outage" | "maintenance"\`
  - \`label?: string\`
  - \`size?: "sm" | "md" | "lg"\`
\`\`\`tsx
<PingStatus status="operational" label="Operational · 42ms" size="md" />
\`\`\`

### 14. PropertyGrid (\`@aui/property-grid\`)
Dense key-value metadata inspector for entities and systems, with one-click copy.
- Endpoint: \`${BASE_URL}/r/property-grid.json\`
- Props:
  - \`items: { label: string; value: string; copyValue?: string }[]\`
\`\`\`tsx
<PropertyGrid
  items={[
    { label: "Cluster ID", value: "cls_01HX98Z", copyValue: "cls_01HX98Z" },
    { label: "Region", value: "eu-west-1 (Ireland)" },
    { label: "VPC CIDR", value: "10.140.0.0/16", copyValue: "10.140.0.0/16" },
  ]}
/>
\`\`\`

### 15. FileTree (\`@aui/file-tree\`)
Collapsible directory and file hierarchy tree.
- Endpoint: \`${BASE_URL}/r/file-tree.json\`
- Props:
  - \`data: FileTreeNode[]\`
  - \`onSelect?: (node: FileTreeNode) => void\`
\`\`\`tsx
<FileTree
  data={[
    {
      name: "src",
      type: "folder",
      defaultOpen: true,
      children: [
        { name: "index.ts", type: "file", badge: "TS" },
        { name: "Button.tsx", type: "file", badge: "React" },
      ],
    },
    { name: "package.json", type: "file", badge: "0.1.0" },
  ]}
/>
\`\`\`

### 16. PackageManager (\`@aui/package-manager\`)
Multi-manager install command switcher with instant click-to-copy.
- Endpoint: \`${BASE_URL}/r/package-manager.json\`
- Props:
  - \`pkg: string\`
  - \`defaultManager?: "pnpm" | "npm" | "bun" | "yarn"\`
\`\`\`tsx
<PackageManager pkg="array-ui" defaultManager="pnpm" />
\`\`\`

---

## 5. Editorial & Content Primitives

### 17. Maxim (\`@aui/maxim\`)
Amber quotation callout box for engineering principles.
- Endpoint: \`${BASE_URL}/r/maxim.json\`
- Props:
  - \`author?: string\`
  - \`source?: string\`
  - \`sourceUrl?: string\`
  - \`children: ReactNode\`
\`\`\`tsx
<Maxim author="Arpit Bhayani" source="Asli Engineering" sourceUrl="https://arpitbhayani.me">
  Simplicity is a prerequisite for reliability. Complex systems always fail in complex ways.
</Maxim>
\`\`\`

### 18. TakeawaysBox (\`@aui/takeaways-box\`)
Crimson bulleted key takeaways callout.
- Endpoint: \`${BASE_URL}/r/takeaways-box.json\`
- Props:
  - \`title?: string\` (default: "Key Takeaways")
  - \`items: string[]\`
\`\`\`tsx
<TakeawaysBox
  title="Key Takeaways"
  items={[
    "A write-ahead log ensures crash recovery is sequential and deterministic.",
    "Storage engines trade write amplification for read latency.",
  ]}
/>
\`\`\`

### 19. Hero (\`@aui/hero\`)
Signature editorial portrait hero with bio and social pills.
- Endpoint: \`${BASE_URL}/r/hero.json\`
- Props:
  - \`title: string\`
  - \`subtitle?: string\`
  - \`avatarUrl?: string\`
  - \`avatarAlt?: string\`
  - \`children?: ReactNode\`
\`\`\`tsx
<Hero
  title="Hey, I am Arpit"
  subtitle="engineering, databases, and systems."
  avatarUrl="https://edge.arpitbhayani.me/img/arpit-6.jpg"
  avatarAlt="Arpit Bhayani"
>
  <p>Principal engineer writing about the internals of systems that scale.</p>
</Hero>
\`\`\`

### 20. SocialPill (\`@aui/social-pill\`)
Interactive platform pills for YouTube, X/Twitter, GitHub, LinkedIn.
- Endpoint: \`${BASE_URL}/r/social-pill.json\`
- Props:
  - \`platform: "youtube" | "twitter" | "x" | "github" | "linkedin" | "substack" | "rss"\`
  - \`href: string\`
  - \`count?: string | number\`
  - \`label?: string\`
\`\`\`tsx
<SocialPill platform="github" href="https://github.com/arpitbbhayani" count="7k" />
<SocialPill platform="youtube" href="https://youtube.com/c/ArpitBhayani" count="210k" />
\`\`\`

### 21. CourseCard (\`@aui/course-card\`)
Card for cohorts, courses, and open source projects.
- Endpoint: \`${BASE_URL}/r/course-card.json\`
- Props:
  - \`title: string\`
  - \`description: string\`
  - \`href: string\`
  - \`badge?: string\`
  - \`tags?: string[]\`
  - \`ctaText?: string\`
\`\`\`tsx
<CourseCard
  title="System Design Masterclass"
  description="Consensus, storage engines, sharding, and real-world architectures."
  href="https://arpitbhayani.me/courses"
  badge="Live Cohort"
  tags={["Distributed", "Architecture"]}
  ctaText="Explore →"
/>
\`\`\`

### 22. StatCard (\`@aui/stat-card\`)
Metric display card for dashboards and telemetry.
- Endpoint: \`${BASE_URL}/r/stat-card.json\`
- Props:
  - \`value: string | number\`
  - \`label: string\`
  - \`description?: string\`
  - \`trend?: ReactNode\`
\`\`\`tsx
<StatCard value="99.98%" label="Uptime" description="rolling 30 days" />
\`\`\`

### 23. EmptyState (\`@aui/empty-state\`)
Minimalist dashed container for empty states and zero-data screens.
- Endpoint: \`${BASE_URL}/r/empty-state.json\`
- Props:
  - \`title: string\`
  - \`description?: string\`
  - \`children?: ReactNode\`
\`\`\`tsx
<EmptyState title="No clusters deployed" description="Create a cluster to begin telemetry.">
  <Button variant="primary" size="sm">New Cluster</Button>
</EmptyState>
\`\`\`

### 24. Footer (\`@aui/footer\`)
Editorial 4-column directory footer with category hints, highlights, disclaimer, and social pills.
- Endpoint: \`${BASE_URL}/r/footer.json\`
- Props:
  - \`copyright?: string\`
  - \`disclaimer?: string\`
  - \`socialPills?: ReactNode\`
  - \`columns?: FooterColumn[]\`
\`\`\`tsx
<Footer
  copyright={\`© \${new Date().getFullYear()} Arpit Bhayani. Built for curious engineers.\`}
  disclaimer="Masterclasses and educational programs are offered by Relog Deeptech Pvt. Ltd."
  socialPills={
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <SocialPill platform="youtube" href="https://youtube.com/c/ArpitBhayani" count="210k" />
      <SocialPill platform="github" href="https://github.com/arpitbbhayani" count="7k" />
    </div>
  }
/>
\`\`\`

### 25. Modal (\`@aui/modal\`)
Accessible dialog modal with backdrop blur, focus trapping, and escape-key dismissal.
- Endpoint: \`${BASE_URL}/r/modal.json\`
- Props:
  - \`isOpen: boolean\`
  - \`onClose: () => void\`
  - \`title?: string\`
  - \`description?: string\`
  - \`children: ReactNode\`
  - \`footer?: ReactNode\`
  - \`size?: "sm" | "md" | "lg" | "xl"\`
\`\`\`tsx
<Modal isOpen={open} onClose={() => setOpen(false)} title="Confirmation" footer={<Button size="sm">Confirm</Button>}>
  <p>Modal body content</p>
</Modal>
\`\`\`

### 26. VideoEmbed (\`@aui/video-embed\`)
Responsive 16:9 media player container with hairline border and fallback loading slot.
- Endpoint: \`${BASE_URL}/r/video-embed.json\`
- Props:
  - \`src: string\`
  - \`title?: string\`
  - \`aspectRatio?: string\` (default: "16 / 9")
\`\`\`tsx
<VideoEmbed
  src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
  title="System Architecture Walkthrough"
  aspectRatio="16 / 9"
/>
\`\`\`

---

## 6. Layout & Utility Classes

- \`.aui-container\`: Max-width 1280px standard container with responsive padding.
- \`.aui-container-md\`: Intermediate max-width 900px container for reading and forms.
- \`.aui-theatre-grid\`: Responsive 2-column player layout (\`minmax(0, 1fr) 340px\`).
- \`.aui-prose-app\` / \`.aui-prose-compact\`: Dense 15px prose typography for UI tab panels and cards.
- \`.aui-input-row\`: Flex row for inline inputs with adjacent action buttons.
- \`.aui-form-hint\`: Subtle helper text beneath inputs.
`;

  fs.writeFileSync(path.resolve("demo/public/llms.txt"), llmsTxt);
  fs.writeFileSync(path.resolve("llms.txt"), llmsTxt);
  fs.writeFileSync(path.resolve("demo/public/llms-full.txt"), llmsFullTxt);
  fs.writeFileSync(path.resolve("llms-full.txt"), llmsFullTxt);

  console.log(`Successfully built ${allItems.length} registry items into demo/public/r/ and dist/r/`);
  console.log(`Successfully generated demo/public/llms.txt, demo/public/llms-full.txt, and demo/public/robots.txt`);
}

buildRegistry().catch((err) => {
  console.error("Registry build error:", err);
  process.exit(1);
});
