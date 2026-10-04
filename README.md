# aui

> A typography-led, minimal, and responsive design system extracted and refined from [arpitbhayani.me](https://arpitbhayani.me).
> Includes light & dark themes, CSS custom properties, and dual component targets: **React (for Next.js, Remix, Vite)** and **Astro (for zero-JS static sites)**.

---

## Features

- **Themes**: First-class Light and Dark themes with zero-flash anti-FOUC script, `localStorage` persistence, and system preference detection. Compatible with `data-theme="dark"` and Tailwind's `.dark` class.
- **Multi-Framework**:
  - **React Components** (`aui/react`): Ready for Next.js App Router (Next.js 13/14/15), Pages Router, Vite, and Remix.
  - **Astro Components** (`aui/astro`): Native `.astro` components for zero-JS client bundle overhead.
  - **Standalone CSS** (`aui/styles.css`): Pure CSS tokens and class utilities for any project (HTML, Svelte, Vue).
  - **Tailwind Preset** (`aui/tailwind`): Effortlessly map all tokens into Tailwind CSS.
- **Signature Aesthetic**:
  - 40px grid background pattern with subtle gradients.
  - Editorial typography: `Assistant` (sans) for headings and UI, paired with `Lora` (italic serif) for editorial flair.
  - Signature crimson accent (`#fa0000`), amber maxim callouts (`#cc9900`), and dark card elevation.
- **Complete Component Suite**: Navbar, Footer, Hero, Buttons, Cards, Social Pills, Maxim Quote, Takeaways Box, Decks Notice Box, Badges, Breadcrumbs, Pricing Card, Course Cards, Newsletter, and Theme Toggles.

---

## Installation

Install directly from the GitHub repository into any project:

```bash
# npm
npm install github:arpitbbhayani/aui

# pnpm
pnpm add github:arpitbbhayani/aui

# bun
bun add github:arpitbbhayani/aui

# yarn
yarn add github:arpitbbhayani/aui
```

You can also pin to a specific branch, release tag, or commit hash:

```bash
# Pin to a specific branch
npm install github:arpitbbhayani/aui#main

# Pin to a specific tag
npm install github:arpitbbhayani/aui#v1.0.0
```

Alternatively, add it directly to your `package.json`:

```json
{
  "dependencies": {
    "aui": "github:arpitbbhayani/aui#main"
  }
}
```

---

## Theme & Styling Setup

### 1. Import Global Styles

Import `aui/styles.css` into your root layout or global stylesheet:

```ts
import 'aui/styles.css';
```

### 2. Prevent Flash of Wrong Theme (FOUC)

Drop the anti-FOUC script into your document `<head>`:

#### In Next.js App Router (`app/layout.tsx`):
```tsx
import 'aui/styles.css';
import { ThemeProvider, ThemeScript, Navbar, Footer } from 'aui/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="aui-body">
        <ThemeProvider defaultTheme="light">
          <Navbar brand={{ name: "Arpit Bhayani", href: "/" }} />
          <main className="aui-container">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

#### In Astro (`src/layouts/Layout.astro`):
```astro
---
import 'aui/styles.css';
import ThemeScript from 'aui/astro/ThemeScript.astro';
import Navbar from 'aui/astro/Navbar.astro';
import Footer from 'aui/astro/Footer.astro';

const { title = "My Project" } = Astro.props;
---
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <ThemeScript />
  </head>
  <body class="aui-body">
    <Navbar brandName="Arpit Bhayani" />
    <main class="aui-container">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

---

## Components Overview

### 1. Hero
Signature editorial hero section with portrait avatar, italic heading, and integrated social handles.

**React / Next.js:**
```tsx
import { Hero, SocialPill, Button } from 'aui/react';

<Hero
  title="Hey, I am Arpit"
  subtitle="engineering, databases, and systems. always building."
  avatarUrl="https://edge.arpitbhayani.me/img/arpit-6.jpg"
  bio={<p>I am a software engineer and engineering leader passionate about applied AI and databases.</p>}
  actions={<Button href="/blogs">Read Essays →</Button>}
  socialLinks={
    <div className="aui-social-pill-group">
      <SocialPill platform="youtube" href="https://youtube.com/c/ArpitBhayani" count="210k" />
      <SocialPill platform="twitter" href="https://twitter.com/arpit_bhayani" count="120k" />
      <SocialPill platform="github" href="https://github.com/arpitbbhayani" count="7k" />
    </div>
  }
/>
```

**Astro:**
```astro
---
import Hero from 'aui/astro/Hero.astro';
import SocialPill from 'aui/astro/SocialPill.astro';
import Button from 'aui/astro/Button.astro';
---
<Hero
  title="Hey, I am Arpit"
  subtitle="engineering, databases, and systems. always building."
  avatarUrl="https://edge.arpitbhayani.me/img/arpit-6.jpg"
>
  <p>I am a software engineer and engineering leader passionate about applied AI and databases.</p>
  <div slot="actions">
    <Button href="/blogs">Read Essays →</Button>
  </div>
  <div slot="socials">
    <SocialPill platform="youtube" href="https://youtube.com/c/ArpitBhayani" count="210k" />
  </div>
</Hero>
```

---

### 2. Buttons
Variants: `primary`, `secondary`, `light`, `outline`, `ghost`.
Sizes: `sm`, `md`, `lg`.

```tsx
import { Button } from 'aui/react';

<Button variant="primary">Primary Button</Button>
<Button variant="secondary" href="/projects">As Link</Button>
<Button variant="outline" size="sm">Small Outline</Button>
```

---

### 3. Callout & Maxim (Quotes & Takeaways)
The signature amber maxim box and the crimson takeaways callout box.

```tsx
import { Maxim, TakeawaysBox } from 'aui/react';

<Maxim author="Arpit Bhayani" source="Asli Engineering">
  "Simplicity is prerequisite for reliability. Complex systems always fail in complex ways."
</Maxim>

<TakeawaysBox
  title="Key Takeaways"
  items={[
    "Consensus algorithms handle network partitions gracefully.",
    "Storage engines trade write amplification for read latency.",
  ]}
/>
```

---

### 4. Notice Box (Decks / Notes / Resources)
Resource box for presentations, lecture notes, Google Drive folders, and file formats.

```tsx
import { NoticeBox } from 'aui/react';

<NoticeBox
  title="Access presentation decks and notes in"
  driveUrl="https://drive.google.com/..."
  driveLabel="this Google Drive folder"
/>
```

---

### 5. Social Pills
Pill buttons for social accounts with subscriber/follower counts and hover animations.

```tsx
import { SocialPill, SocialPillGroup } from 'aui/react';

<SocialPillGroup>
  <SocialPill platform="youtube" href="https://youtube.com/..." count="210k" />
  <SocialPill platform="twitter" href="https://twitter.com/..." count="120k" />
  <SocialPill platform="linkedin" href="https://linkedin.com/in/..." count="280k" />
  <SocialPill platform="github" href="https://github.com/..." count="7k" />
</SocialPillGroup>
```

---

### 6. Course & Project Cards
Rich interactive cards with tags, descriptions, and action buttons.

```tsx
import { CourseCard } from 'aui/react';

<CourseCard
  title="System Design Masterclass"
  description="Master distributed systems, consensus algorithms, and high-scale architecture."
  href="/courses/system-design"
  badge="Live Cohort"
  tags={["Distributed Systems", "Architecture", "Scaling"]}
/>
```

---

### 7. Pricing Card
Full pricing tier card with curriculum benefits checklist, INR/USD currency display, and enrollment CTA.

```tsx
import { PricingCard } from 'aui/react';

<PricingCard
  title="System Design Fellowship"
  duration="8 Weeks"
  cohortDate="Starts Next Month"
  cohortTimings="Saturdays & Sundays, 7:00 PM IST"
  benefits={[
    "Live interactive weekend classes with real-time Q&A",
    "Lifetime recordings and slides",
  ]}
  valueProposition={[
    "Verified LinkedIn certificate",
    "Hands-on architectural capstone project",
  ]}
  priceInr="₹29,999"
  priceUsd="$420"
  ctaText="Enroll Now →"
  ctaHref="https://arpitbhayani.me"
/>
```

---

### 8. Newsletter
Newsletter box with avatar, reader stats, and LinkedIn / Substack subscription CTAs.

```tsx
import { Newsletter } from 'aui/react';

<Newsletter
  title="Arpit's Newsletter"
  subtitle="Newsletter for the curious engineers"
  statsText="Read by 40,000+ engineers"
  avatarUrl="https://edge.arpitbhayani.me/img/arpit-6.jpg"
/>
```

---

### 9. Form Controls (Input, Textarea, Select, Switch, Checkbox)
```tsx
import { Input, Switch, Checkbox, Select, Textarea } from 'aui/react';

<Input
  label="Search Query"
  placeholder="Search databases, notes, algorithms..."
  shortcut="⌘K"
  helperText="Press ⌘K anytime to open search"
/>

<Switch label="Dark Mode Sync" defaultChecked />
<Checkbox label="System Design" defaultChecked />
```

---

### 10. CodeBlock (with 1-Click Copy)
```tsx
import { CodeBlock } from 'aui/react';

<CodeBlock
  language="typescript"
  filename="consensus.ts"
  code={`async function acquireLock(key: string, ttl: number) { ... }`}
/>
```

---

### 11. Tabs
```tsx
import { Tabs } from 'aui/react';

<Tabs
  tabs={[
    { id: 'next', label: 'Next.js', content: <p>Setup for Next.js</p> },
    { id: 'astro', label: 'Astro', content: <p>Setup for Astro</p> },
  ]}
/>
```

---

### 12. Accordion (FAQs & Syllabus)
```tsx
import { Accordion } from 'aui/react';

<Accordion
  items={[
    { id: 'q1', title: 'What are the prerequisites?', content: 'Knowledge of backend systems.' },
    { id: 'q2', title: 'Are recordings included?', content: 'Yes, lifetime access is provided.' },
  ]}
/>
```

---

### 13. Modal / Dialog
```tsx
import { Modal, Button } from 'aui/react';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Enroll in Masterclass"
  footer={<Button onClick={() => setIsOpen(false)}>Close</Button>}
>
  <p>Cohort details and payment information.</p>
</Modal>
```

---

### 14. Alert
```tsx
import { Alert } from 'aui/react';

<Alert variant="info" title="Application Notice">
  Applications close this Sunday at midnight.
</Alert>
```

---

### 15. StatCard & Timeline
```tsx
import { StatCard, Timeline } from 'aui/react';

<StatCard value="250+" label="YouTube Videos" description="Deep-dive systems engineering" />

<Timeline
  events={[
    { date: "2024 — Present", title: "Principal Engineer II at Razorpay" },
    { date: "2021 — 2024", title: "Staff Engineer at Google" },
  ]}
/>
```

---

## Tailwind CSS Integration

If you use Tailwind CSS in Next.js or Astro, add the `aui` preset to your `tailwind.config.mjs` (or `tailwind.config.js`):

```js
import auiTailwindPreset from 'aui/tailwind';

export default {
  presets: [auiTailwindPreset],
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}',
    './node_modules/aui/**/*.{js,ts,jsx,tsx,astro}',
  ],
  theme: {
    extend: {},
  },
};
```

This makes tokens like `bg-aui-bg-primary`, `text-aui-primary`, `font-serif`, etc., available directly in Tailwind classes!

---

## Local Showcase & Live Preview

Run the built-in Astro showcase to preview all components with live light and dark mode toggling:

```bash
# In the aui directory:
npm run dev
```

Visit `http://localhost:4321` in your browser.

To build the static documentation:
```bash
npm run build
npm run demo:build
```

---

## License

MIT © [Arpit Bhayani](https://arpitbhayani.me)

## Developer components (new)

Compact, dense building blocks for dashboards and dev tools. Each exists in `aui/react`; the static ones also ship as `aui/astro/*.astro`.

| Component | React | Astro | CSS class |
| --- | --- | --- | --- |
| Kbd | `<Kbd keys={["⌘","K"]} />` | `Kbd.astro` | `.aui-kbd` |
| Tooltip | `<Tooltip content="…">` | `Tooltip.astro` | `.aui-tooltip` |
| Progress | `<Progress value={72} showValue />` | `Progress.astro` | `.aui-progress` |
| Spinner | `<Spinner size="lg" />` | `Spinner.astro` | `.aui-spinner` |
| Divider | `<Divider label="or" />` | `Divider.astro` | `.aui-divider` |
| EmptyState | `<EmptyState title="…" />` | `EmptyState.astro` | `.aui-empty` |
| SegmentedControl | `<SegmentedControl options={…} />` | – | `.aui-segmented` |
| Toast | `<Toast variant="success" title="…" />` | `Toast.astro` | `.aui-toast` |
| Terminal | `<Terminal lines={[…]} />` | `Terminal.astro` | `.aui-terminal` |
| Sidebar | `<Sidebar groups={…} />` | `Sidebar.astro` | `.aui-sidebar` |

The base font size is 15px, so every `rem`-based size is compact by default.

## Design principles

- **One border colour**, flat surfaces, minimal shadow. Brand red is reserved for primary actions and the active nav/tab state.
- **Two contexts, one system.** Use compact components for product UI; wrap long-form content in `.aui-prose` (17px, 70ch measure, generous rhythm) for blogs and docs.
- Headings use Space Grotesk (`--aui-font-heading`), body is Assistant, code is the system mono stack. Lora is kept for pull quotes.
- Status colours (`--aui-success`, `--aui-warning`, `--aui-danger`, `--aui-info`) drive alerts and tinted `Badge` variants (`green | amber | red | blue | violet | pink | cyan`).
- `CodeBlock` syntax-colours snippets (`highlight={false}` to disable). Links are blue and underlined everywhere, including inside prose.
- The demo's **Patterns** section shows a blog article and a SaaS dashboard built from the same components.
