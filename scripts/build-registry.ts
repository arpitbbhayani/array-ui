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

const componentsConfig = [
  {
    name: "terminal",
    title: "Terminal",
    description: "Machined telemetry terminal with bash command dots and styled outputs.",
    file: "src/registry/aui/ui/terminal.tsx",
    target: "ui/terminal.tsx",
  },
  {
    name: "diff-block",
    title: "DiffBlock",
    description: "Git patch viewer with line gutters, additions, and deletions.",
    file: "src/registry/aui/ui/diff-block.tsx",
    target: "ui/diff-block.tsx",
  },
  {
    name: "ping-status",
    title: "PingStatus",
    description: "Live telemetry pulsing dot indicator with label.",
    file: "src/registry/aui/ui/ping-status.tsx",
    target: "ui/ping-status.tsx",
  },
  {
    name: "property-grid",
    title: "PropertyGrid",
    description: "Key-value metadata inspector with one-click copy functionality.",
    file: "src/registry/aui/ui/property-grid.tsx",
    target: "ui/property-grid.tsx",
  },
  {
    name: "package-manager",
    title: "PackageManager",
    description: "pnpm/npm/bun/yarn command switcher with copy button.",
    file: "src/registry/aui/ui/package-manager.tsx",
    target: "ui/package-manager.tsx",
  },
  {
    name: "maxim",
    title: "Maxim",
    description: "Editorial quote callout with amber left rail and citation.",
    file: "src/registry/aui/ui/maxim.tsx",
    target: "ui/maxim.tsx",
  },
  {
    name: "takeaways-box",
    title: "TakeawaysBox",
    description: "Key takeaways container with bulleted highlights.",
    file: "src/registry/aui/ui/takeaways-box.tsx",
    target: "ui/takeaways-box.tsx",
  },
  {
    name: "hero",
    title: "Hero",
    description: "Editorial profile hero section with avatar, heading, and bio.",
    file: "src/registry/aui/ui/hero.tsx",
    target: "ui/hero.tsx",
  },
  {
    name: "file-tree",
    title: "FileTree",
    description: "Directory explorer tree with collapsible folders and item selection.",
    file: "src/registry/aui/ui/file-tree.tsx",
    target: "ui/file-tree.tsx",
  },
  {
    name: "social-pill",
    title: "SocialPill",
    description: "Clean pill button with platform icon, handle, and follower count.",
    file: "src/registry/aui/ui/social-pill.tsx",
    target: "ui/social-pill.tsx",
  },
  {
    name: "course-card",
    title: "CourseCard",
    description: "Editorial course and project card with badges, tags, and CTA.",
    file: "src/registry/aui/ui/course-card.tsx",
    target: "ui/course-card.tsx",
  },
  {
    name: "stat-card",
    title: "StatCard",
    description: "Large key metric display card with optional trend indicator.",
    file: "src/registry/aui/ui/stat-card.tsx",
    target: "ui/stat-card.tsx",
  },
  {
    name: "empty-state",
    title: "EmptyState",
    description: "Dashed container for empty content and call-to-actions.",
    file: "src/registry/aui/ui/empty-state.tsx",
    target: "ui/empty-state.tsx",
  },
  {
    name: "footer",
    title: "Footer",
    description: "Editorial 4-column directory footer with category hints, highlights, disclaimer, and social pills.",
    file: "src/registry/aui/ui/footer.tsx",
    target: "ui/footer.tsx",
  },
  {
    name: "modal",
    title: "Modal",
    description: "Accessible dialog modal with backdrop blur, focus handling, and escape key dismissal.",
    file: "src/registry/aui/ui/modal.tsx",
    target: "ui/modal.tsx",
  },
  {
    name: "video-embed",
    title: "VideoEmbed",
    description: "Responsive 16:9 aspect ratio video embed wrapper with border hairline styling.",
    file: "src/registry/aui/ui/video-embed.tsx",
    target: "ui/video-embed.tsx",
  },
  {
    name: "dropdown",
    title: "Dropdown",
    description: "Minimal click-trigger dropdown menu with click outside dismissal and actions.",
    file: "src/registry/aui/ui/dropdown.tsx",
    target: "ui/dropdown.tsx",
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
npx shadcn@latest add @aui/terminal @aui/diff-block @aui/property-grid @aui/ping-status -y
\`\`\`

### Mode B: Direct GitHub Dependency (Next.js, Astro)
\`\`\`bash
npm install github:arpitbbhayani/aui
# Note: Not published on npm registry; install via GitHub or shadcn registry.
\`\`\`

## Machine-Readable Endpoints

- [shadcn Registry Index](${BASE_URL}/r/registry.json): JSON manifest of all available registry components.
- [Full LLM Documentation](${BASE_URL}/llms-full.txt): Comprehensive single-file reference with all component APIs, prop types, and TSX examples.
- [Theme Style](${BASE_URL}/r/aui.json): Theme CSS variables, fonts, and light/dark color tokens.
- [Agent Guide (AGENTS.md)](https://raw.githubusercontent.com/arpitbbhayani/aui/main/AGENTS.md): Repository AGENTS.md guide for AI coding assistants.

## Components

${componentsConfig
  .map(
    (c) =>
      `- [${c.title}](${BASE_URL}/r/${c.name}.json): ${c.description} Install: \`npx shadcn@latest add @aui/${c.name}\``
  )
  .join("\n")}

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

Install components:
\`\`\`bash
npx shadcn@latest add @aui/terminal @aui/diff-block @aui/property-grid @aui/ping-status -y
\`\`\`

Components are installed into \`@/components/ui/\` and imported as:
\`\`\`tsx
import { Terminal } from "@/components/ui/terminal";
import { DiffBlock } from "@/components/ui/diff-block";
import { PropertyGrid } from "@/components/ui/property-grid";
import { PingStatus } from "@/components/ui/ping-status";
\`\`\`

### Mode B: Direct GitHub Dependency (Next.js, Astro)
aui is NOT published on the npm registry. Install directly from GitHub:
\`\`\`bash
npm install github:arpitbbhayani/aui
# or: pnpm add github:arpitbbhayani/aui / bun add github:arpitbbhayani/aui
\`\`\`

Setup styles in root layout:
\`\`\`tsx
import "aui/styles.css";
\`\`\`

Import components:
\`\`\`tsx
// Next.js (App Router or Pages Router)
import { Button, Terminal, DiffBlock, PingStatus, Card } from "aui/nextjs";

// Astro
import Terminal from "aui/astro/Terminal.astro";
import DiffBlock from "aui/astro/DiffBlock.astro";
import PingStatus from "aui/astro/PingStatus.astro";
\`\`\`

### Autonomous Agent Workflow Rules:
- Autonomously select and install required components (\`npx shadcn@latest add @aui/<component> -y\`).
- DO NOT pause or ask the user which components to install — immediately implement the requested interface.
- Always use \`cn()\` from \`@/lib/utils\` for className composition.

---

## 3. Component Reference & APIs

### 1. Terminal (\`@aui/terminal\`)
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

### 2. DiffBlock (\`@aui/diff-block\`)
Unified git patch inspector with line gutters, additions, and deletions.
- Endpoint: \`${BASE_URL}/r/diff-block.json\`
- Props:
  - \`file?: string\`
  - \`diff: string\` (git diff format or unified diff string)
\`\`\`tsx
<DiffBlock
  file="migrations/0042_status.sql"
  diff={\`@@ -12,4 +12,4 @@
-status: varchar(32) DEFAULT 'pending',
+status: cluster_status NOT NULL DEFAULT 'provisioning',\`}
/>
\`\`\`

### 3. PingStatus (\`@aui/ping-status\`)
Pulsing heartbeat indicator with status and latency.
- Endpoint: \`${BASE_URL}/r/ping-status.json\`
- Props:
  - \`status: "operational" | "degraded" | "outage" | "maintenance"\`
  - \`label?: string\` (e.g. "Operational · 42ms")
  - \`size?: "sm" | "md" | "lg"\`
\`\`\`tsx
<PingStatus status="operational" label="Operational · 42ms" size="md" />
\`\`\`

### 4. PropertyGrid (\`@aui/property-grid\`)
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

### 5. FileTree (\`@aui/file-tree\`)
Collapsible directory and file hierarchy tree.
- Endpoint: \`${BASE_URL}/r/file-tree.json\`
- Props:
  - \`data: FileTreeNode[]\` where FileTreeNode is:
    \`{ name: string; type: "file" | "folder"; children?: FileTreeNode[]; defaultOpen?: boolean; badge?: string }\`
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

### 6. PackageManager (\`@aui/package-manager\`)
Multi-manager install command switcher with instant click-to-copy.
- Endpoint: \`${BASE_URL}/r/package-manager.json\`
- Props:
  - \`pkg: string\` (e.g. "github:arpitbbhayani/aui" or "@aui/terminal")
  - \`defaultManager?: "pnpm" | "npm" | "bun" | "yarn"\`
\`\`\`tsx
<PackageManager pkg="github:arpitbbhayani/aui" defaultManager="pnpm" />
\`\`\`

### 7. Maxim (\`@aui/maxim\`)
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

### 8. TakeawaysBox (\`@aui/takeaways-box\`)
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

### 9. Hero (\`@aui/hero\`)
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

### 10. SocialPill (\`@aui/social-pill\`)
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

### 11. CourseCard (\`@aui/course-card\`)
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

### 12. StatCard (\`@aui/stat-card\`)
Metric display card for dashboards and telemetry.
- Endpoint: \`${BASE_URL}/r/stat-card.json\`
- Props:
  - \`value: string | number\`
  - \`label: string\`
  - \`description?: string\`
  - \`trend?: { direction: "up" | "down" | "flat"; label: string }\`
\`\`\`tsx
<StatCard value="99.98%" label="Uptime" description="rolling 30 days" />
\`\`\`

### 13. EmptyState (\`@aui/empty-state\`)
Minimalist dashed container for empty states and zero-data screens.
- Endpoint: \`${BASE_URL}/r/empty-state.json\`
- Props:
  - \`title: string\`
  - \`description?: string\`
  - \`children?: ReactNode\`
\`\`\`tsx
<EmptyState title="No clusters deployed" description="Create a cluster to begin telemetry.">
  <button className="aui-btn aui-btn-primary aui-btn-sm">New Cluster</button>
</EmptyState>
\`\`\`

### 14. Footer (\`@aui/footer\`)
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

### 15. Modal (\`@aui/modal\`)
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
<Modal isOpen={open} onClose={() => setOpen(false)} title="Confirmation" footer={<button className="aui-btn aui-btn-sm">Confirm</button>}>
  <p>Modal body content</p>
</Modal>
\`\`\`

### 16. VideoEmbed (\`@aui/video-embed\`)
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

### 17. Dropdown (\`@aui/dropdown\`)
Accessible action menu with click-outside dismissal and keyboard escape support.
- Endpoint: \`${BASE_URL}/r/dropdown.json\`
- Props:
  - \`trigger: ReactNode\`
  - \`children: ReactNode\`
  - \`align?: "left" | "right"\`
\`\`\`tsx
<Dropdown trigger={<button className="aui-btn aui-btn-secondary aui-btn-sm">Actions ▼</button>}>
  <div className="aui-dropdown-header">Options</div>
  <button type="button" className="aui-dropdown-item">Edit</button>
  <div className="aui-dropdown-divider" />
  <button type="button" className="aui-dropdown-item is-destructive">Delete</button>
</Dropdown>
\`\`\`

---

## 4. UI Actions & Layout Classes

### Buttons (\`Button\`)
Variants: \`primary\` (crimson), \`secondary\`, \`outline\`, \`ghost\`, \`light\`, \`danger\`.
Sizes: \`sm\`, \`md\`, \`lg\`.

### Badges (\`Badge\`)
Variants: \`green\` (operational), \`amber\` (degraded), \`red\` (outage), \`primary\` (crimson), \`light\`.

### Keyboard Keys (\`Kbd\`)
\`\`\`tsx
<Kbd keys={["⌘", "K"]} />
\`\`\`

### Layout Classes:
- \`.aui-container\`: Max-width 1280px standard container with responsive padding.
- \`.aui-container-md\`: Intermediate max-width 900px container for reading and forms.
- \`.aui-theatre-grid\`: Responsive 2-column player layout (\`minmax(0, 1fr) 340px\`).
- \`.aui-prose-app\` / \`.aui-prose-compact\`: Dense 15px prose typography for UI tab panels and cards.
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

