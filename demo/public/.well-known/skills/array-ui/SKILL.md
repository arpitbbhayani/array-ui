---
name: array-ui
description: The Array UI (array-ui) design system, the arpitbhayani.me editorial systems engineering look (paper light #faf9f5, obsidian carbon #111113, Assistant body & headings, Lora quotes, IBM Plex Mono telemetry, 1px hairline borders, signature crimson #e5000f in light / #ff3344 in dark, and 0% custom CSS). Use when building, restyling, or auditing UI for personal portfolios, engineering blogs, SaaS dashboards, systems explainers, or when adding @aui components via the shadcn CLI.
---

# Array UI (`array-ui`)

The arpitbhayani.me look as an opinionated, high-density editorial systems design system.
Authority comes from precision: warm paper or obsidian carbon canvas, mathematical 1px hairline borders, dense `Assistant` typography, `Lora` engineering maxims, machined monospace telemetry, and signature crimson accents strictly reserved for primary actions.

The live registry is at **https://ui.arpitbhayani.me**, and **https://ui.arpitbhayani.me/llms.txt** lists every component. When a detail is not covered here, consult `references/components.md` and `references/recipes.md`.

---

## 1. Prime Invariants (Non-Negotiable)

### Invariant 1: 0% Custom CSS Rule
- **Custom CSS proportion MUST REMAIN 0% AT ALL TIMES.**
- **NEVER** create custom `.css` files.
- **NEVER** write `<style>` blocks or style tags in `.astro`, `.tsx`, `.jsx`, or `.html` files.
- **NEVER** inject arbitrary ad-hoc inline styles for margins, paddings, colors, or shadows.
- All layout, typography, blank spacing, telemetry, and interactive controls **MUST** be composed exclusively using native Array UI components (`PageShell`, `Navbar`, `Footer`, `Card`, `Button`, `Table`, `Badge`, `Terminal`, `PingStatus`, `DiffBlock`, `Gutter`, `Layout`, etc.) and system utility classes (`.aui-grid`, `.aui-stack`, `.aui-row`, `.aui-container`).

### Invariant 2: Mandatory Font Enforcement
When starting any project or scaffold, **YOU MUST FIRST ENSURE THE FONTS ARE LOADED**:
1. Google Fonts URL:
   `https://fonts.googleapis.com/css2?family=Assistant:wght@400;500;600;700;800&family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Lora:ital,wght@0,400..700;1,400..700&display=swap`
2. In `globals.css` (or main stylesheet):
   ```css
   @import url("https://fonts.googleapis.com/css2?family=Assistant:wght@400;500;600;700;800&family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Lora:ital,wght@0,400..700;1,400..700&display=swap");
   ```
3. Set base typography on `body`:
   ```css
   body {
     font-family: var(--font-sans, "Assistant", -apple-system, sans-serif);
     -webkit-font-smoothing: antialiased;
   }
   ```
   Or include `<ThemeScript fonts />` in the root layout's `<head>`. Never allow a page to render in system Arial / Inter.

### Invariant 3: Frame Every Page in `<PageShell>`
Never guess margins or write ad-hoc page wrappers. Wrap every page in:
```tsx
<PageShell navbar={<Navbar ... />} footer={<Footer ... />}>
  {children}
</PageShell>
```
This guarantees an automatic centered `max-w-6xl` column, proper horizontal padding, full viewport height, and clean boundaries.

### Invariant 4: Editorial Footer Discipline
The footer must match [arpitbhayani.me](https://arpitbhayani.me):
- Background is flat paper or obsidian carbon canvas (`bg-background` / `var(--aui-bg-primary)`).
- Hairline top border: `border-t border-border`.
- Links are inline with subtle monospace hints: `Projects (Open-source)` with crimson hover and subtle `translate-x`.
- Never stretch links with `justify-between` or render heavy boxed badge borders across the column.
- Disclaimer and bottom bar separated with hairlines (`border-t border-border/70`).
- Social handles rendered using tactile `<SocialPill>`s with tooltips.

### Invariant 5: Wrap Every Action & Status in `<Tooltip>`
- Every action button, icon trigger, theme toggle, copy button, and `<PingStatus>` **MUST** be wrapped in a `<Tooltip content="...">`.
- Communicate consequence, keyboard shortcuts, or live telemetry facts (e.g. `<Tooltip content="Toggle dark / light mode (⌘D)">`).

### Invariant 6: Anti-Card-Soup & Visual Rhythm
- **NEVER** stack identical layout blocks consecutively (e.g. never place two 3-card grids in a row).
- Alternate dense, machined telemetry (`Terminal`, `DiffBlock`, `ParamTable`) with airy, editorial moments (`Maxim`, pull quotes, `<Gutter size="xl" />`, `TakeawaysBox`).
- Prefer 2-column asymmetric splits (`SplitPane`, 60/40 layouts) over monotonous symmetric grids.

---

## 2. Palette & Materials

- **Canvas**:
  - Light mode: Warm paper (`#faf9f5` / `rgb(250, 249, 245)`)
  - Dark mode: Obsidian carbon (`#111113` / `rgb(17, 17, 19)`)
- **Hairline Borders**:
  - Exactly 1px subtle hairlines everywhere (`#dfded9` light, `#27272c` dark).
- **Signature Crimson**:
  - **Light mode**: `#e5000f`
  - **Dark mode**: `#ff3344`
  - Reserved strictly for primary action buttons, active navigation indicators, and key focus rings.
- **Semantic Accents**:
  - **Amber (`#cc9900`)**: Exclusively for engineering maxim quotes and warnings.
  - **Emerald (`#10b981`)**: Operational ping status, uptime, and diff additions.
  - **Rose (`#f43f5e`)**: Outages and diff deletions.
- **Surfaces**: Flat, tinted card surfaces (`bg-muted/30` or `var(--aui-bg-secondary)`). Zero heavy drop shadows.

---

## 3. Installation & Workflow

### Autonomous Execution Rule
- **Never ask the user which components to install.**
- Check `references/components.md` to see what is already built.
- Install components with `-y`:
  ```bash
  npx shadcn@latest add @aui/aui -y
  npx shadcn@latest add @aui/page-shell @aui/navbar @aui/footer @aui/button @aui/badge @aui/card @aui/terminal @aui/diff-block @aui/ping-status @aui/tooltip @aui/gutter @aui/layout -y
  ```
- Or import from `array-ui` (`import { PageShell, Button, Terminal } from "array-ui/nextjs"`).

---

## 4. References & Recipes

Consult the accompanying reference files for complete implementations:
- **`references/components.md`**: Complete API signatures and props of all shipped primitives.
- **`references/recipes.md`**: Foolproof copy-paste recipes for PageShell, Landing Pages, Deep-Dive Blogs, and Documentation.
- **`references/tokens.css`**: Raw CSS variables for both light and dark themes.
