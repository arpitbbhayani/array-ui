# AGENTS.md — AI Coding Assistant Guide for Array UI (array-ui)

> **For AI Coding Assistants (Cursor, Claude Code, Windsurf, Codex, Antigravity):**
> This file contains the complete system prompt, rules, installation options, and component API reference for building interfaces with **Array UI** (`array-ui`).

---

## 1. Quick Identity & Design Rules

**Array UI (`array-ui`)** is an editorial, systems-engineering design system inspired by [arpitbhayani.me](https://arpitbhayani.me). It is designed for engineers who value mathematical precision, high information density, and editorial typography.

### Core Visual Principles
1. **Editorial Palette**:
   - **Light mode**: Paper canvas (`#f9f8f5`), warm hairline borders (`#dfded9` / `rgb(223, 222, 217)`), dark carbon text (`#2b2a30`).
   - **Dark mode**: Obsidian carbon (`#121215`), crisp border (`#2c2c38` / `rgb(44, 44, 56)`), soft readable white (`#dcdce5`).
   - **Accents**:
     - **Signature Crimson (`#e5000f` in light, `#ff3344` in dark)**: Reserved strictly for primary action buttons, active navigation indicators, and key focus rings.
     - **Amber (`#cc9900`)**: Used exclusively for engineering maxim quotes and warning callouts.
     - **Emerald (`#10b981`)**: Used for operational health, ping dots, and git diff additions.
     - **Rose (`#f43f5e`)**: Used for errors, outages, and git diff deletions.
2. **Typography**:
   - Headings: `Space Grotesk` or `Plus Jakarta Sans` (bold, relaxed tracking `-0.015em`).
   - Body: `Assistant` (dense, 15px base size).
   - Pull Quotes / Maxims: `Lora` (italic serif).
   - Code & Telemetry: `IBM Plex Mono` / system monospace.
3. **Density & Restraint**:
   - 1px hairline borders everywhere.
   - Minimal elevation/shadows; prefer flat, tinted card surfaces (`bg-muted/30` or `var(--aui-bg-secondary)`).
   - Information-dense layouts: compact margins, dense tables, machined telemetry.
   - **Never** inject arbitrary gradients, neon colors, or rounded bouncy buttons.
4. **Strict Zero Custom CSS Invariant (0% Custom CSS Rule)**:
   - **Custom CSS Proportion MUST ALWAYS REMAIN 0%**: When creating or modifying the landing page, documentation, or any application screen, **never** create custom `.css` files, and **never** write `<style>` blocks in `.astro`, `.tsx`, `.jsx`, or `.html` files.
   - **100% Component & Token Driven**: All layouts, responsive grids, typography, spacing, and telemetry must be built exclusively using native Array UI components (`Card`, `Button`, `Table`, `Badge`, `CodeBlock`, `Terminal`, `PingStatus`, `DiffBlock`, etc.) and system utility classes (`.aui-grid`, `.aui-stack`, `.aui-row`, `.aui-container`, `.aui-h1`, etc.).
   - **No ad-hoc page-level styles**: If a layout pattern or primitive is missing, expand or enhance the core design system in `src/` rather than hacking page-specific styles. Every page must remain 100% free of custom CSS.

---

## 2. Two Installation Modes

Determine whether the user is in a **shadcn/ui** project or a **direct package** project.

### Mode A: shadcn CLI Registry (Recommended for Next.js / Vite / Tailwind)
No package is required from npm. Pure Tailwind + TypeScript components are copied directly into the project:

1. Configure `components.json`:
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "registries": {
    "@aui": "https://ui.arpitbhayani.me/r/{name}.json"
  }
}
```

2. Install the design tokens:
```bash
npx shadcn@latest add @aui/aui
```

3. Add any component as needed:
```bash
npx shadcn@latest add @aui/button @aui/badge @aui/card @aui/terminal @aui/diff-block @aui/ping-status
```
*(Or install directly from URL: `npx shadcn@latest add https://ui.arpitbhayani.me/r/button.json`)*

Components are installed into `@/components/ui/` and imported as:
```tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Terminal } from "@/components/ui/terminal";
import { DiffBlock } from "@/components/ui/diff-block";
import { PingStatus } from "@/components/ui/ping-status";
```

#### Autonomous Workflow Rule for AI Agents
- **Do NOT ask the user which components to install.**
- When given a task or UI requirement, autonomously identify the required `@aui` components.
- Run the installation command with `-y` (e.g. `npx shadcn@latest add @aui/terminal @aui/ping-status -y`) and immediately implement the user's request.
- **Strictly Maintain 0% Custom CSS**: Never write page-level `<style>` blocks or create ad-hoc `.css` files. All layout, spacing, and styling MUST be driven exclusively by Array UI components and foundational utility classes.

#### Machine-Readable Endpoints for Autonomous Tools & LLMs
- **Standard Context**: `https://ui.arpitbhayani.me/llms.txt`
- **Full API Reference**: `https://ui.arpitbhayani.me/llms-full.txt`
- **shadcn Registry Index**: `https://ui.arpitbhayani.me/r/registry.json`
- **Component Schema**: `https://ui.arpitbhayani.me/r/{name}.json` (e.g. `terminal.json`, `diff-block.json`)

---

### Mode B: Direct Package Dependency (Next.js, Astro)
Install `array-ui` from npm:

```bash
# npm
npm install array-ui

# pnpm
pnpm add array-ui

# bun
bun add array-ui
```

Setup styles in root layout:
```tsx
import "array-ui/styles.css";
// Optional: import { ThemeProvider, ThemeScript } from "array-ui/nextjs";
```

Import components:
```tsx
// Next.js (App Router or Pages Router)
import { Button, Terminal, DiffBlock, PingStatus, Card } from "array-ui/nextjs";

// Astro (zero-JS client overhead)
import Terminal from "array-ui/astro/Terminal.astro";
import DiffBlock from "array-ui/astro/DiffBlock.astro";
import PingStatus from "array-ui/astro/PingStatus.astro";
```

---

## 3. Component Quick Reference & Props

### Core UI & Action Primitives

#### 1. `Button` (`@aui/button`)
Tactile action button with signature crimson primary, secondary, outline, ghost, and danger variants.
```tsx
<Button variant="primary" size="md">Deploy</Button>
<Button variant="secondary" size="md">Documentation</Button>
<Button variant="outline" size="sm">Small Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive" size="sm">Terminate</Button>
```
*Variants*: `primary` (signature crimson), `secondary`, `outline`, `ghost`, `destructive`, `link`.
*Sizes*: `sm`, `default`/`md`, `lg`, `icon`.

#### 2. `Badge` (`@aui/badge`)
Machined status pill with monospace typography and color variants.
```tsx
<Badge variant="green">Healthy</Badge>
<Badge variant="amber">Degraded</Badge>
<Badge variant="red">Outage</Badge>
<Badge variant="primary">Active</Badge>
<Badge variant="outline">v0.1.3</Badge>
```

#### 3. `Card` (`@aui/card`)
Flat card surface with 1px hairline border and structured subcomponents.
```tsx
<Card>
  <CardHeader>
    <CardTitle>Distributed Consensus</CardTitle>
    <CardDescription>Raft state machine replication</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Compaction occurs at 50,000 index increments.</p>
  </CardContent>
  <CardFooter className="justify-between">
    <span>Cluster: us-east-1</span>
    <Button size="sm">Inspect</Button>
  </CardFooter>
</Card>
```

#### 4. `Input` (`@aui/input`)
Machined text input with subtle focus ring and optional keyboard shortcut badge.
```tsx
<Input placeholder="Filter clusters..." shortcut="⌘K" />
```

#### 5. `Kbd` (`@aui/kbd`)
Machined monospace keyboard shortcut keycap.
```tsx
<Kbd keys={["⌘", "K"]} />
<Kbd keys={["Ctrl", "Shift", "P"]} />
```

#### 6. `Tooltip` (`@aui/tooltip`)
Accessible tooltip hint on hover and focus.
```tsx
<Tooltip content="Copy commit SHA to clipboard">
  <button className="text-xs font-mono">01hx98z</button>
</Tooltip>
```

#### 7. `Alert` (`@aui/alert`)
Status-tinted inline alert callout.
```tsx
<Alert variant="warning">
  <AlertTitle>Replication Lag Detected</AlertTitle>
  <AlertDescription>Replica eu-west-1b is 418ms behind primary ledger.</AlertDescription>
</Alert>
```

#### 8. `Tabs` (`@aui/tabs`)
Underline tab navigation with keyboard accessibility.
```tsx
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
```

#### 9. `Accordion` (`@aui/accordion`)
Collapsible hairline accordion sections.
```tsx
<Accordion type="single" defaultValue="item-1">
  <AccordionItem value="item-1">
    <AccordionTrigger>How does log compaction work?</AccordionTrigger>
    <AccordionContent>Snapshots discard prefix entries safely.</AccordionContent>
  </AccordionItem>
</Accordion>
```

#### 10. `Gutter` (`@aui/gutter`)
Whitespace blank spacing component between UI elements (e.g. space between navbar and first component). Eliminates ad-hoc external CSS margins and paddings.
```tsx
// Vertical blank space (e.g. between navbar and first section)
<Navbar brandName="Console" links={links} />
<Gutter size="lg" />
<main>...</main>

// Custom pixel/rem dimension or horizontal spacing in a row
<Gutter size={32} />
<Gutter orientation="horizontal" size="sm" />
```
*Sizes*: `none`, `2xs` (4px), `xs` (8px), `sm` (12px), `md` (24px, default), `lg` (36px), `xl` (48px), `2xl` (72px), `3xl` (96px), `4xl` (128px), or custom `number`/`string`.
*Orientations*: `vertical` (default), `horizontal` (or `axis="x" | "y"`).
*Alias*: `Spacer`

### Developer Primitives

#### 1. `Terminal`
Machined telemetry terminal with bash command dots and styled outputs.
```tsx
<Terminal
  title="~/cluster"
  lines={[
    "kubectl get pods -n prod",
    { text: "pod/api-server-79f9  1/1 Running", kind: "ok" },
    { text: "pod/worker-004       0/1 CrashLoop", kind: "err" },
    { text: "exit code 1", kind: "out" },
  ]}
/>
```
- Line types: `string` (defaults to command `$ `), or `{ text: string, kind?: "cmd" | "out" | "ok" | "err" }`.

#### 2. `DiffBlock`
Unified git patch inspector with line gutters, additions, and deletions.
```tsx
<DiffBlock
  file="migrations/0042_status.sql"
  diff={`@@ -12,4 +12,4 @@
-status: varchar(32) DEFAULT 'pending',
+status: cluster_status NOT NULL DEFAULT 'provisioning',`}
/>
```

#### 3. `PingStatus`
Pulsing heartbeat indicator with status and latency.
```tsx
<PingStatus
  status="operational" // "operational" | "degraded" | "outage" | "maintenance"
  label="Operational · 42ms"
  size="md" // "sm" | "md" | "lg"
/>
```

#### 4. `PropertyGrid`
Dense key-value metadata inspector for entities and systems, with one-click copy.
```tsx
<PropertyGrid
  items={[
    { label: "Cluster ID", value: "cls_01HX98Z", copyValue: "cls_01HX98Z" },
    { label: "Region", value: "eu-west-1 (Ireland)" },
    { label: "VPC CIDR", value: "10.140.0.0/16", copyValue: "10.140.0.0/16" },
  ]}
/>
```

#### 5. `FileTree`
Collapsible directory and file hierarchy tree.
```tsx
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
    { name: "package.json", type: "file", badge: "0.1.3" },
  ]}
/>
```

#### 6. `PackageManager`
Multi-manager install command switcher with instant click-to-copy.
```tsx
<PackageManager pkg="array-ui" defaultManager="pnpm" />
```

---

### Editorial & Content Primitives

#### 7. `Maxim`
Amber quotation callout box for engineering principles.
```tsx
<Maxim author="Arpit Bhayani" source="Asli Engineering" sourceUrl="https://arpitbhayani.me">
  Simplicity is a prerequisite for reliability. Complex systems always fail in complex ways.
</Maxim>
```

#### 8. `TakeawaysBox`
Crimson bulleted key takeaways callout.
```tsx
<TakeawaysBox
  title="Key Takeaways"
  items={[
    "A write-ahead log ensures crash recovery is sequential and deterministic.",
    "Storage engines trade write amplification for read latency.",
  ]}
/>
```

#### 9. `Hero`
Signature editorial portrait hero with bio and social pills.
```tsx
<Hero
  title="Hey, I am Arpit"
  subtitle="engineering, databases, and systems."
  avatarUrl="https://edge.arpitbhayani.me/img/arpit-6.jpg"
  avatarAlt="Arpit Bhayani"
>
  <p>Principal engineer writing about the internals of systems that scale.</p>
</Hero>
```

#### 10. `SocialPill`
Interactive platform pills for YouTube, X/Twitter, GitHub, LinkedIn.
```tsx
<SocialPill platform="github" href="https://github.com/arpitbbhayani" count="7k" />
<SocialPill platform="youtube" href="https://youtube.com/c/ArpitBhayani" count="210k" />
```

#### 11. `CourseCard`
Card for cohorts, courses, and open source projects.
```tsx
<CourseCard
  title="System Design Masterclass"
  description="Consensus, storage engines, sharding, and real-world architectures."
  href="https://arpitbhayani.me/courses"
  badge="Live Cohort"
  tags={["Distributed", "Architecture"]}
  ctaText="Explore →"
/>
```

#### 12. `StatCard`
Metric display card for dashboards and telemetry.
```tsx
<StatCard value="99.98%" label="Uptime" description="rolling 30 days" />
```

#### 13. `EmptyState`
Minimalist dashed container for empty states and zero-data screens.
```tsx
<EmptyState title="No clusters deployed" description="Create a cluster to begin telemetry.">
  <Button variant="primary" size="sm">New Cluster</Button>
</EmptyState>
```

#### 14. `Footer`
Editorial 4-column directory footer with category hints, highlights, disclaimer, and social pills.
```tsx
<Footer
  copyright={`© ${new Date().getFullYear()} Arpit Bhayani. Built for curious engineers.`}
  disclaimer="Masterclasses and educational programs are offered by Relog Deeptech Pvt. Ltd."
  socialPills={
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <SocialPill platform="youtube" href="https://youtube.com/c/ArpitBhayani" count="210k" />
      <SocialPill platform="twitter" href="https://twitter.com/arpit_bhayani" count="120k" />
      <SocialPill platform="linkedin" href="https://linkedin.com/in/arpitbhayani" count="280k" />
      <SocialPill platform="github" href="https://github.com/arpitbbhayani" count="7k" />
    </div>
  }
/>
```

#### 15. `Modal`
Accessible dialog modal with backdrop blur, focus trapping, and escape-key dismissal.
```tsx
// Next.js
<Modal isOpen={open} onClose={() => setOpen(false)} title="Confirmation" footer={<Button size="sm">Confirm</Button>}>
  Content goes here
</Modal>

// Astro
<Modal id="my-modal" title="Confirmation">
  <p>Modal body content</p>
  <div slot="footer">
    <Button size="sm" variant="secondary">Close</Button>
  </div>
</Modal>
```

#### 16. `VideoEmbed`
Responsive 16:9 media player container with hairline border and fallback loading slot.
```tsx
<VideoEmbed
  src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
  title="System Architecture Walkthrough"
  aspectRatio="16 / 9"
/>
```

#### 17. `Dropdown`
Accessible action menu with click-outside dismissal and keyboard escape support.
```tsx
// Next.js
<Dropdown trigger={<Button variant="secondary" size="sm">Actions ▼</Button>}>
  <div className="aui-dropdown-header">Options</div>
  <button type="button" className="aui-dropdown-item">Edit</button>
  <div className="aui-dropdown-divider" />
  <button type="button" className="aui-dropdown-item is-destructive">Delete</button>
</Dropdown>

// Astro
<Dropdown align="right">
  <Button slot="trigger" variant="secondary" size="sm">Actions ▼</Button>
  <div class="aui-dropdown-header">Options</div>
  <a href="/edit" class="aui-dropdown-item">Edit</a>
  <div class="aui-dropdown-divider"></div>
  <button type="button" class="aui-dropdown-item is-destructive">Delete</button>
</Dropdown>
```

### Technical Documentation Primitives

#### 18. `ApiEndpoint` (`@aui/api-endpoint`)
Machined HTTP/gRPC API specification block with method badges, copyable path & cURL commands, parameters, and status response tabs.
```tsx
<ApiEndpoint
  method="POST"
  path="/v1/clusters/{cluster_id}/replicate"
  description="Triggers immediate Raft log replication across active quorum peers."
  badge="Idempotent"
  params={[
    { name: "cluster_id", type: "string", required: true, description: "Unique target cluster identifier" },
    { name: "fsync", type: "boolean", required: false, description: "Block until disk sync completes" },
  ]}
  responses={[
    { status: 200, label: "OK", body: '{\n  "replicated_index": 45091,\n  "peers_acknowledged": 3\n}' },
    { status: 409, label: "Conflict", body: '{\n  "error": "LEADER_DEPOSED"\n}' },
  ]}
/>
```

#### 19. `DocStepper` (`@aui/doc-stepper`)
Connected numbered step walkthrough for tutorials, runbooks, and installation guides.
```tsx
<DocStepper
  steps={[
    { title: "Initialize Ledger", description: "Bootstrap root node on port 8080." },
    { title: "Join Quorum Peers", description: "Attach secondary voter replicas." },
    { title: "Verify Health", description: "Poll heartbeat ping status." },
  ]}
  activeStep={1}
/>
```

#### 20. `ParamTable` (`@aui/param-table`)
Dense configuration options and parameter reference table with types, required badges, and defaults.
```tsx
<ParamTable
  items={[
    { name: "--wal-dir", type: "string", required: true, description: "Directory path for write-ahead logs" },
    { name: "--sync-interval", type: "Duration", required: false, default: "100ms", description: "Disk sync frequency" },
  ]}
/>
```

#### 21. `FeatureMatrix` (`@aui/feature-matrix`)
Dense matrix comparison table comparing engines, editions, or versions with check/cross/partial indicators.
```tsx
<FeatureMatrix
  columns={[
    { key: "lsm", label: "LSM-Tree" },
    { key: "btree", label: "B+ Tree" },
  ]}
  rows={[
    { category: "Storage Characteristics" },
    { name: "Write Amplification", values: { lsm: "Low (Sequential)", btree: "High (Random I/O)" } },
    { name: "Point Lookups", values: { lsm: "partial", btree: true } },
  ]}
/>
```

#### 22. `VersionSelector` (`@aui/version-selector`)
Compact documentation version switcher and runtime environment selector.
```tsx
<VersionSelector
  label="API Version:"
  versions={[
    { label: "v2.4", value: "v2.4", badge: "Latest" },
    { label: "v2.3", value: "v2.3" },
    { label: "v1.9", value: "v1.9", badge: "LTS" },
  ]}
/>
```

#### 23. `Canvas` (`@aui/canvas`)
Engineering diagram frame with dotted coordinate grid and hairline border.
```tsx
<Canvas title="Storage Engine Architecture" variant="grid">
  <div>Technical diagram content...</div>
</Canvas>
```

### Interactive Concept Illustrations & Explorables ("Systems Explainer Kit")

#### 24. `MemoryLayout` (`@aui/memory-layout`)
Contiguous byte/memory layout visualizer with offsets, binary structs, and interactive field inspector.
```tsx
<MemoryLayout
  title="TCP Header Segment (20 Bytes)"
  segments={[
    { name: "Source Port", bytes: 2, offset: "0x00 - 0x01", type: "uint16", color: "crimson" },
    { name: "Destination Port", bytes: 2, offset: "0x02 - 0x03", type: "uint16", color: "emerald" },
    { name: "Sequence Number", bytes: 4, offset: "0x04 - 0x07", type: "uint32", color: "blue" },
    { name: "Acknowledgment", bytes: 4, offset: "0x08 - 0x0B", type: "uint32", color: "amber" },
  ]}
/>
```

#### 25. `PipelineFlow` (`@aui/pipeline-flow`)
Multi-stage data pipeline flow visualizer with throughput metrics and animated pulse lines.
```tsx
<PipelineFlow
  stages={[
    { title: "Ingress", badge: "HTTP", metric: "62k req/s" },
    { title: "WAL Log", badge: "Disk", metric: "fsync 0.4ms", active: true },
    { title: "MemTable", badge: "RAM", metric: "SkipList" },
    { title: "SSTable", badge: "Storage", metric: "Level-0" },
  ]}
/>
```

#### 26. `BenchmarkDelta` (`@aui/benchmark-delta`)
Comparative system performance delta block showing baseline vs candidate metrics.
```tsx
<BenchmarkDelta
  benchmarks={[
    {
      name: "Throughput (ops/sec)",
      baselineValue: 42000,
      baselineDisplay: "42,000 ops/s",
      candidateValue: 98000,
      candidateDisplay: "98,000 ops/s",
      delta: "+133%",
      better: "higher",
    },
    {
      name: "Heap Allocations",
      baselineValue: 120,
      baselineDisplay: "120 MB",
      candidateValue: 34,
      candidateDisplay: "34 MB",
      delta: "-71%",
      better: "lower",
    },
  ]}
/>
```

#### 27. `LatencyDistribution` (`@aui/latency-distribution`)
Percentile latency distribution bar (p50, p75, p90, p99, p99.9) with color thresholds and SLA lines.
```tsx
<LatencyDistribution
  title="Gateway Latency"
  sla="Target: p99 < 50ms"
  percentiles={[
    { label: "p50", value: 1.2, display: "1.2ms", color: "emerald" },
    { label: "p90", value: 4.8, display: "4.8ms", color: "blue" },
    { label: "p99", value: 18.5, display: "18.5ms", color: "amber" },
    { label: "p99.9", value: 84.1, display: "84.1ms", color: "rose" },
  ]}
/>
```


#### 29. `ClusterState` (`@aui/cluster-state`)
Distributed consensus cluster topology visualizer (Leader, Followers, Candidates, Quorum status).
```tsx
<ClusterState
  title="Raft Consensus Cluster"
  nodes={[
    { id: "node-01", role: "leader", term: 4, latency: "0.2ms" },
    { id: "node-02", role: "follower", term: 4, latency: "1.4ms" },
    { id: "node-03", role: "follower", term: 4, latency: "1.1ms" },
    { id: "node-04", role: "follower", term: 4, latency: "2.3ms" },
    { id: "node-05", role: "offline", term: 3 },
  ]}
/>
```

#### 30. `ParamSandbox` (`@aui/param-sandbox`)
Interactive slider sandbox for mathematical formulas and live reactive system calculations.
```tsx
<ParamSandbox
  formula="Quorum Q = floor(N / 2) + 1, Max Tolerable Failures F = floor((N - 1) / 2)"
  inputs={[
    { id: "nodes", label: "Cluster Nodes (N)", min: 3, max: 11, step: 2, defaultValue: 5 },
  ]}
  outputs={[
    { label: "Required Quorum (Q)", compute: (v) => Math.floor(v.nodes / 2) + 1 },
    { label: "Tolerable Failures (F)", compute: (v) => Math.floor((v.nodes - 1) / 2) },
  ]}
/>
```

### SaaS & Control Plane Primitives

#### 31. `Combobox` (`@aui/combobox`)
Searchable autocomplete select with keyboard navigation, empty states, and badge support.
```tsx
<Combobox
  options={[
    { value: "main", label: "main", description: "Default production branch", badge: "protected" },
    { value: "feat/wal", label: "feat/wal", description: "Storage engine compaction" },
  ]}
  value={selected}
  onChange={setSelected}
  placeholder="Select branch..."
/>
```

#### 32. `Drawer` / `Sheet` (`@aui/drawer`)
Slide-over drawer panel for deep inspection of telemetry, configurations, and logs.
```tsx
<Drawer isOpen={open} onClose={() => setOpen(false)} title="Workspace Specs" size="md">
  <p>Container specs and runtime diffs...</p>
</Drawer>
```

#### 33. `AlertDialog` (`@aui/alert-dialog`)
Destructive action confirmation modal with danger styling, autofocus on Cancel, and optional confirmation phrase.
```tsx
<AlertDialog
  isOpen={open}
  onClose={() => setOpen(false)}
  onConfirm={handleTeardown}
  title="Teardown Cluster"
  description="This will destroy all volumes and replicas."
  confirmationPhrase="teardown prod-01"
  confirmText="Teardown"
/>
```

#### 34. `SecretInput` (`@aui/secret-input`)
Masked credential display input with reveal toggle and one-click copy feedback.
```tsx
<SecretInput
  label="API Secret Key"
  value="px0_live_8f0a3b89c72e140d83b9281a94e0c1f5"
  helperText="Copy this token now. It will not be shown again."
/>
```

#### 35. `MultiSelect` (`@aui/multi-select`)
Scoped multi-select tag picker with badge pills, search filter, and batch actions.
```tsx
<MultiSelect
  label="Assigned Permissions"
  options={[
    { value: "read:reviews", label: "read:reviews" },
    { value: "write:reviews", label: "write:reviews" },
  ]}
  selected={scopes}
  onChange={setScopes}
/>
```

#### 36. `Slider` (`@aui/slider`)
Precision range slider with filled accent bar, tactile thumb, and value readout.
```tsx
<Slider
  label="Idle Sleep Timeout"
  value={timeout}
  onChange={setTimeout}
  min={15}
  max={180}
  step={15}
  valueFormatter={(v) => `${v} minutes`}
/>
```

#### 37. `Popover` (`@aui/popover`)
Floating anchor-positioned overlay container with collision awareness for custom forms and filter cards.
```tsx
<Popover trigger={<Button size="sm">Filter Clusters</Button>}>
  <div>Filter checklist content...</div>
</Popover>
```

#### 38. `Charts` (`@aui/charts`)
Lightweight SVG-based telemetry charts (`AreaChart`, `BarChart`, `Sparkline`) styled 100% with Array UI design tokens.
```tsx
<AreaChart
  data={telemetry}
  index="timestamp"
  categories={["active", "queued"]}
  colors={["primary", "emerald"]}
  height={220}
/>
<Sparkline data={[12, 18, 25, 34, 42, 55]} color="primary" />
```

#### 39. `DatePicker` & `DateRangePicker` (`@aui/date-picker`)
Calendar date picker and date range picker with monospace display and quick range presets.
```tsx
<DateRangePicker value={range} onChange={setRange} />
```

#### 40. `DataTable` (`@aui/data-table`)
Dense SaaS data table with search filtering, multi-row selection, sorting, and pagination.
```tsx
<DataTable
  data={workspaces}
  columns={columns}
  selectable
  pageSize={10}
  renderBulkActions={(selected) => <Button size="sm">Sleep ({selected.length})</Button>}
/>
```

### Layout & Utility Classes

- `.aui-container-md`: Intermediate max-width (900px) container for forms, reading, and account pages.
- `.aui-prose-compact` / `.aui-prose-app`: Compact 15px prose typography scale tuned for tab panels, cards, and modal dialogs (unlike editorial long-form `.aui-prose` which is 18px).
- `.aui-theatre-grid`: Responsive 2-column player layout (`minmax(0, 1fr) 340px`) with sticky right sidebar that collapses on mobile screens (`< 900px`).
- `.aui-input-row`: Flex row for inline inputs with adjacent action buttons.
- `.aui-form-hint`: Subtle helper text beneath inputs.
- `.aui-canvas-grid`: Dotted coordinate grid (20px pitch) for engineering diagrams and explorables.
- `.aui-canvas-ruled`: Ruled engineering coordinate grid (24px pitch).
- `.aui-canvas-frame`: Subtle corner tick marks (`+`) for machined architectural diagrams.

---

## 4. Complete Native Component Library (72+ Components)

In addition to the shadcn registry CLI, the direct repository package (`array-ui`) exports 72+ native components for React (`array-ui/nextjs`, `array-ui/react`) and Astro (`array-ui/astro/*`):
- **Inputs & Forms**: `Button`, `Input`, `Select`, `Textarea`, `Switch`, `Checkbox`, `SearchBox`, `SegmentedControl`, `VersionSelector`, `Combobox`, `SecretInput`, `MultiSelect`, `Slider`
- **Navigation**: `Breadcrumbs`, `Tabs`, `Pagination`, `Accordion`, `TableOfContents`, `Sidebar`, `Navbar`
- **Feedback & Loading**: `Alert`, `AlertDialog`, `Toast`, `Progress`, `Spinner`, `Skeleton`, `EmptyState`, `Modal`, `Drawer`, `Tooltip`, `Popover`
- **Data Display & Tables**: `Table`, `DataTable`, `Timeline`, `StatCard`, `DiffBlock`, `Terminal`, `PropertyGrid`, `FileTree`, `Avatar`, `AvatarGroup`, `Badge`, `Kbd`, `Divider`, `Gutter`, `DatePicker`, `DateRangePicker`
- **Telemetry & Charts**: `AreaChart`, `BarChart`, `Sparkline`, `LatencyDistribution`, `BenchmarkDelta`
- **Technical Documentation**: `ApiEndpoint`, `DocStepper`, `ParamTable`, `FeatureMatrix`, `Canvas`
- **Interactive Systems Explorables**: `MemoryLayout`, `PipelineFlow`, `StepScrubber`, `ClusterState`, `ParamSandbox`
- **Editorial & Media**: `Hero`, `Maxim`, `TakeawaysBox`, `NoticeBox`, `Newsletter`, `Card`, `CoverCard`, `CourseCard`, `SocialPill`, `Footer`, `VideoEmbed`


---

## 5. Summary Checklist for AI Agents
- [ ] Is **custom CSS proportion strictly 0%**? (Zero custom `.css` files, zero `<style>` blocks in application/landing pages; 100% driven by native Array UI components and foundational utility classes).
- [ ] Are you using **`@aui` components** via shadcn (`components/ui/`) or direct package imports (`array-ui/nextjs` / `array-ui/astro`)?
- [ ] Did you install required components autonomously without pausing to ask the user?
- [ ] Did you preserve the **editorial hairline border** (1px) aesthetic?
- [ ] Is **crimson (`#e5000f`)** used strictly for primary actions, not plastered across entire surfaces?
- [ ] Did you remember that the package name is **`array-ui`**?
