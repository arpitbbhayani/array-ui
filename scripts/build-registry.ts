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
      background: "240 10% 3.9%",        /* #09090b */
      foreground: "240 5% 83%",          /* #cfcfd6 */
      card: "240 6% 7%",                 /* #111114 */
      "card-foreground": "240 5% 83%",
      popover: "240 6% 7%",
      "popover-foreground": "240 5% 83%",
      primary: "356 100% 45%",           /* #e5000f */
      "primary-foreground": "0 0% 100%",
      secondary: "240 6% 10%",           /* #17171c */
      "secondary-foreground": "240 14% 98%",
      muted: "240 6% 10%",
      "muted-foreground": "240 5% 58%",  /* #8b8b99 */
      accent: "240 6% 10%",
      "accent-foreground": "240 14% 98%",
      destructive: "0 63% 31%",          /* #7f1d1d */
      border: "240 6% 16%",              /* #24242c */
      input: "240 6% 16%",
      ring: "356 100% 45%",
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

  // Generate llms.txt for AI coding agents
  const llmsTxt = `# Array UI (aui) - shadcn Registry

> The arpitbhayani.me look as a shadcn registry: paper light & obsidian carbon themes, Plus Jakarta Sans & Lora typography, signature crimson accent (#e5000f), amber maxim callouts, machined telemetry terminals, and systems engineering developer primitives. Components are copied into your app with the shadcn CLI.

## Quick Installation

Add the registry to your \`components.json\`:
\`\`\`json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "registries": {
    "@aui": "${BASE_URL}/r/{name}.json"
  }
}
\`\`\`

Install the theme and any components:
\`\`\`bash
# 1. Install theme tokens, CSS variables & typography
npx shadcn@latest add @aui/aui

# 2. Install any component directly
npx shadcn@latest add @aui/terminal
npx shadcn@latest add @aui/diff-block
npx shadcn@latest add @aui/file-tree
npx shadcn@latest add @aui/ping-status
npx shadcn@latest add @aui/property-grid
npx shadcn@latest add @aui/package-manager
npx shadcn@latest add @aui/hero
npx shadcn@latest add @aui/maxim
npx shadcn@latest add @aui/takeaways-box
npx shadcn@latest add @aui/course-card
npx shadcn@latest add @aui/stat-card
npx shadcn@latest add @aui/social-pill
\`\`\`

Or add directly via URL without touching \`components.json\`:
\`\`\`bash
npx shadcn@latest add ${BASE_URL}/r/terminal.json
\`\`\`

## AI Coding Agent Setup (Cursor, Claude Code, Windsurf)

Teach your AI coding agent the Array UI aesthetic and component APIs by adding the following prompt to your \`.cursorrules\`, \`AGENTS.md\`, or system instructions:

\`\`\`markdown
# Design System: Array UI (@aui)
- Registry URL: ${BASE_URL}/r/{name}.json
- GitHub Repository: github:arpitbbhayani/aui (not on npm registry; install via GitHub or shadcn registry)
- Style: Editorial engineering aesthetic inspired by arpitbhayani.me.
- Colors:
  - Light mode: paper background (#f9f8f5), warm hairline borders (#dfded9), dark carbon text (#2b2a30).
  - Dark mode: obsidian background (#0a0a0c), crisp dark borders (#24242c), soft white text (#d4d4db).
  - Accents: Signature crimson (#e5000f) for primary actions; amber (#cc9900) for engineering maxims; emerald (#10b981) for online/ok.
- Typography:
  - Headings: Plus Jakarta Sans / Space Grotesk (bold, tight tracking).
  - Body: Assistant (clean, dense, 15px base size).
  - Pull quotes & Maxims: Lora italic serif.
  - Code & Telemetry: Geist Mono / system monospace.
- Rules:
  - Keep borders subtle (1px, single color).
  - Minimal elevation/shadows; use flat tinted card surfaces.
  - Prefer compact, information-dense components for developer dashboards and tools.
  - Always use \`cn()\` from \`@/lib/utils\` for className composition.
- Autonomous Execution:
  - Autonomously select and install any required components (e.g. \`npx shadcn@latest add @aui/<component> -y\`).
  - DO NOT pause or ask the user which components to install — immediately implement the requested interface.
\`\`\`

## Available Components:
${componentsConfig
  .map(
    (c) =>
      `- **${c.title}** (\`@aui/${c.name}\`): ${c.description}\n  Endpoint: \`${BASE_URL}/r/${c.name}.json\`\n  Install: \`npx shadcn@latest add @aui/${c.name}\``
  )
  .join("\n\n")}

- **Theme Style** (\`@aui/aui\`): Base CSS variables, typography, and color tokens.\n  Endpoint: \`${BASE_URL}/r/aui.json\`\n  Install: \`npx shadcn@latest add @aui/aui\`
`;

  fs.writeFileSync(path.resolve("demo/public/llms.txt"), llmsTxt);
  fs.writeFileSync(path.resolve("llms.txt"), llmsTxt);

  console.log(`Successfully built ${allItems.length} registry items into demo/public/r/ and dist/r/`);
}

buildRegistry().catch((err) => {
  console.error("Registry build error:", err);
  process.exit(1);
});
