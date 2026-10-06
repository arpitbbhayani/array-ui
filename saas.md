# SaaS & Control Plane Component Requirements for Array UI (`aui`)

> **Target File:** `~/workspace/aui/saas.md`  
> **Purpose:** Detailed requirements, architectural specifications, TypeScript APIs, and design tokens for components needed to build enterprise cloud control planes (e.g., `px0-control`) under the **Strict Zero Custom CSS (0% CSS)** invariant.

---

## 1. Executive Summary & Design Invariants

To implement complex enterprise developer consoles and control plane frontends (such as `px0-control`) with **zero custom CSS**, Array UI must provide foundational primitives that cover not just documentation and landing pages, but dense operational SaaS workflows:

1. **Zero Custom CSS Constraint**:
   - Every component must be fully styled using Array UI CSS custom properties (`--aui-*`) and utility classes.
   - Consumers must never be forced to write page-level `<style>` blocks or ad-hoc `.css` files.
2. **Mathematical Density & Hairlines**:
   - 1px hairline borders (`#dfded9` light, `#2c2c38` dark).
   - Minimal elevation; flat tinted carbon/paper surfaces.
   - Space Grotesk / Plus Jakarta Sans headings, Assistant body (15px base), IBM Plex Mono code/identifiers.
3. **Registry Parity**:
   - Every component added to `src/react/` must also be available in the shadcn CLI registry (`https://ui.arpitbhayani.me/r/{name}.json`) so consumers can either `pnpm add array-ui` or `npx shadcn@latest add @aui/<name> -y`.

---

## 2. Missing Components Matrix

| Component | Priority | Key Use Case in Control Plane | Alternatives Today |
| :--- | :---: | :--- | :--- |
| **`Combobox`** (Searchable Select) | **P0** | Selecting Repositories, Branches, Pull Requests (100+ items) in workspace launch modals. | Native `<Select>` (no search or async). |
| **`Drawer` / `Sheet`** | **P0** | Slide-over panel to inspect workspace specs, container logs, and audit event JSON without leaving page. | `Modal` (blocks entire screen). |
| **`AlertDialog`** | **P0** | Destructive confirmation dialogs: tear down workspace, delete organization, revoke API token. | Generic `Modal` (requires manual wiring). |
| **`SecretInput` / `CopyInput`** | **P0** | Displaying newly minted API tokens and temporary user credentials with mask toggle and copy button. | Ad-hoc flex row with `Input` and `Button`. |
| **`Sidebar` (Enhanced)** | **P0** | App-level navigation shell with route icons, tenant switcher header, and user profile footer. | Existing `Sidebar` (no icon slot, text-only). |
| **`MultiSelect` / `TagInput`** | **P1** | Scoped permission selection for API tokens (`read:reviews`, `write:reviews`, `admin:members`). | Manual stack of `Checkbox` controls. |
| **`Slider`** | **P1** | Setting compute idle sleep timeouts (15m–24h) and volume quotas in organization settings. | Number `Input`. |
| **`Popover`** | **P1** | Generic anchor-positioned overlay for filter panels, action menus, and column selectors. | `Dropdown` (menu items only). |
| **`Charts` (Area, Line, Bar, Sparkline)** | **P1** | Telemetry and usage dashboard: active compute hours, container spend, provisioning velocity. | External charting library. |
| **`DatePicker` / `DateRangePicker`**| **P2** | Audit log timeline filtering and billing range inspection. | Native `<input type="date">`. |
| **`DataTable` (Enhanced Table)** | **P2** | Multi-row selection for bulk operations (bulk sleep/teardown) and integrated pagination. | `Table` + manual `Pagination`. |

---

## 3. Detailed Component Specifications

### 3.1. `Combobox` (Searchable Select / Autocomplete)

#### Problem
The existing `<Select>` is a native HTML `<select>` wrapper. When launching a review workspace, users must pick from hundreds of GitHub repos or PRs. A native `<select>` cannot be searched, cannot display PR author avatars or branch badges, and cannot load paginated items asynchronously.

#### Requirements
- Search input with debounce support.
- Keyboard navigation: Arrow Up/Down, Enter to select, Escape to close.
- Virtualized or scrollable dropdown container (max height ~280px).
- Custom option rendering slot (title, badge, subtitle/description, icon).
- Empty state message ("No repositories found").
- Loading state spinner for async searches.

#### Proposed API (`src/react/Combobox/Combobox.tsx`)
```tsx
export interface ComboboxOption<T = string> {
  value: T;
  label: string;
  description?: string;
  badge?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface ComboboxProps<T = string> {
  options: ComboboxOption<T>[];
  value?: T;
  onChange: (value: T) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  loading?: boolean;
  disabled?: boolean;
  onSearchChange?: (query: string) => void;
  renderOption?: (option: ComboboxOption<T>) => React.ReactNode;
  className?: string;
}
```

---

### 3.2. `Drawer` / `Sheet` (Slide-Over Panel)

#### Problem
In modern developer control planes, navigating away from the workspace table to inspect container logs, environment variables, or audit diffs disrupts the workflow. A right-docked sliding drawer allows deep inspection while maintaining spatial context.

#### Requirements
- Slides in smoothly from the edge (`right` by default; supports `left`, `bottom`).
- Hairline border separating the sheet from the canvas.
- Backdrop overlay with blur (`bg-black/55 backdrop-blur-[3px]`).
- Traps focus; dismisses on Escape or backdrop click.
- Sub-components: `DrawerHeader`, `DrawerTitle`, `DrawerDescription`, `DrawerContent`, `DrawerFooter`.
- Standard widths: `sm` (384px), `md` (512px), `lg` (640px), `xl` (768px), `full`.

#### Proposed API (`src/react/Drawer/Drawer.tsx`)
```tsx
export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  side?: "left" | "right" | "bottom";
  size?: "sm" | "md" | "lg" | "xl" | "full";
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}
```

---

### 3.3. `AlertDialog` (Destructive Action Confirmation)

#### Problem
Destructive actions (tearing down a running container, deleting an organization, revoking active API keys) need a stricter UX contract than standard informational modals: autofocus should be on "Cancel", the primary action must carry danger semantics, and high-consequence operations need string confirmation (e.g. typing the workspace sequence).

#### Requirements
- Danger/warning styling: subtle rose border accent (`border-rose-500/20`), rose alert badge.
- Explicit confirm/cancel button layout.
- Autofocus placed on "Cancel" button by default to prevent accidental `Enter` execution.
- Optional `confirmationPhrase` prop: submit button remains disabled until the user types the exact matching phrase (e.g., `teardown rev-42`).

#### Proposed API (`src/react/AlertDialog/AlertDialog.tsx`)
```tsx
export interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning";
  confirmationPhrase?: string; // If set, user must type this exact string to enable confirm button
  loading?: boolean;
}
```

---

### 3.4. `SecretInput` / `CopyInput` (Token & Credential Display)

#### Problem
When creating API tokens (`/tokens`) or onboarding new members with auto-generated passwords (`/members`), the secret key is shown once. Consumers currently have to glue together an `Input`, a stateful copy icon, a show/hide toggle, and a toast.

#### Requirements
- Password masking (`••••••••••••••••`) by default with reveal/hide eye toggle button.
- Built-in one-click copy button with transient feedback state (check icon + "Copied!").
- Read-only by default, monospaced font, subtle hairline border.
- Optional warning hint ("Copy this key now. It will not be shown again.").

#### Proposed API (`src/react/SecretInput/SecretInput.tsx`)
```tsx
export interface SecretInputProps {
  value: string;
  label?: string;
  helperText?: string;
  maskByDefault?: boolean;
  allowCopy?: boolean;
  onCopy?: () => void;
  className?: string;
}
```

---

### 3.5. `Sidebar` (Enhanced for Application Shells)

#### Problem
Array UI's existing `<Sidebar>` component only accepts:
```ts
interface SidebarLinkItem { label: string; href: string; active?: boolean; badge?: React.ReactNode; }
```
It **lacks an icon slot**, has no header slot for a tenant/organization selector, and has no footer slot for the authenticated user profile. Consequently, consumers cannot use `<Sidebar>` for a SaaS console without writing custom markup.

#### Requirements
- Add `icon?: React.ComponentType<{ className?: string }> | React.ReactNode` to `SidebarLinkItem`.
- Add `header?: React.ReactNode` slot (for tenant branding, org switcher dropdown).
- Add `footer?: React.ReactNode` slot (for user avatar, role badge, sign-out button).
- Collapsible collapse-to-icon state support (`collapsed?: boolean; onToggleCollapse?: () => void`).
- Maintain existing 1px hairline styling and keyboard accessibility.

#### Proposed API Extension (`src/react/Sidebar/Sidebar.tsx`)
```tsx
export interface SidebarLinkItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode;
  active?: boolean;
  badge?: React.ReactNode;
  external?: boolean;
}

export interface SidebarGroupData {
  title?: string;
  links: SidebarLinkItem[];
}

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  groups?: SidebarGroupData[];
  header?: React.ReactNode;
  footer?: React.ReactNode;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}
```

---

### 3.6. `MultiSelect` / `TagInput`

#### Problem
In `/tokens` (Mint API Token modal) and `/settings` (allowed repository policies), users must pick multiple scoped tags from a list. A plain series of checkboxes takes up too much vertical space in modals.

#### Requirements
- Renders selected values as compact dismissable badges (`<Badge variant="outline">`).
- Search input to quickly filter available tags/scopes.
- Multi-select dropdown checklist with checkbox indicators.
- "Select All" / "Clear All" convenience actions.

#### Proposed API (`src/react/MultiSelect/MultiSelect.tsx`)
```tsx
export interface MultiSelectOption {
  value: string;
  label: string;
  group?: string;
  description?: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  maxDisplayedBadges?: number;
}
```

---

### 3.7. `Slider` (Range Input)

#### Problem
In tenant settings (`/settings`), configuring compute idle timeouts (15 minutes to 24 hours), workspace volume sizes (10GB to 500GB), or max active review quotas requires a slider control.

#### Requirements
- Styled hairline track, filled bar in crimson or amber accent, and tactile thumb.
- Step intervals and snap marks.
- Value readout tooltip on drag or static readout label.
- Keyboard accessible (Arrow Left/Right, Home, End).

#### Proposed API (`src/react/Slider/Slider.tsx`)
```tsx
export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  valueFormatter?: (value: number) => string;
  disabled?: boolean;
  className?: string;
}
```

---

### 3.8. `Popover` (Anchor-Positioned Overlay)

#### Problem
`Dropdown` is restricted to menu items (`.aui-dropdown-item`). It cannot house complex filter cards (combining date picker + status pills + user search) or custom mini-forms.

#### Requirements
- Floating anchor positioning with collision detection (flips when close to viewport edge).
- Supports arbitrary children (custom search filters, forms, date pickers).
- Traps clicks, handles outside click dismissal and Escape key.

#### Proposed API (`src/react/Popover/Popover.tsx`)
```tsx
export interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}
```

---

### 3.9. Telemetry & Analytics Charts (`AreaChart`, `BarChart`, `Sparkline`)

#### Problem
In `/dashboard` (Analytics & Usage), the console reports metered compute hours, provisioning velocity, and cloud cost attribution. Currently, Array UI has `StatCard` for single numbers, but **zero charting primitives**. Consumers are forced to import third-party libraries that break the zero custom CSS and theme consistency invariants.

#### Requirements
- Lightweight SVG-based chart primitives styled 100% with Array UI design tokens:
  - Primary metric line/area: `--aui-primary` (Signature Crimson) or `--aui-c-cyan`
  - Success/healthy line: `--aui-c-green` (`#10b981`)
  - Warning/degraded: `--aui-c-amber` (`#d97706`)
  - Gridlines: 1px hairline (`var(--aui-border-color)`)
  - Monospace font for axes and legend values
- Interactive hover crosshair with formatted tooltip box.
- Compact `Sparkline` component for embedding inside `StatCard` or table cells.

#### Proposed API (`src/react/Charts/`)
```tsx
export interface DataPoint {
  date: string;
  [key: string]: string | number;
}

export interface AreaChartProps {
  data: DataPoint[];
  categories: string[];
  index: string; // Key for X-axis (e.g. "date")
  colors?: ("primary" | "emerald" | "amber" | "rose" | "cyan")[];
  valueFormatter?: (value: number) => string;
  height?: number; // default 240
  showGrid?: boolean;
  showLegend?: boolean;
}

export interface SparklineProps {
  data: number[];
  color?: "primary" | "emerald" | "amber" | "rose";
  height?: number; // default 32
  width?: number;  // default 96
}
```

---

### 3.10. `DatePicker` & `DateRangePicker`

#### Problem
Audit logs (`/audit`) and usage reports require filtering across custom date windows (e.g., `2026-09-01` to `2026-10-01`). Today, consumers must use native browser `<input type="date">` which renders with inconsistent OS styles and lacks range selection.

#### Requirements
- Two-month or single-month calendar view with month/year navigation.
- Preset shortcuts ("Today", "Last 24h", "Last 7d", "Last 30d", "Month to Date").
- Monospace date display badge (`YYYY-MM-DD`).
- Hairline border styling aligned with Obsidian dark mode.

#### Proposed API (`src/react/DatePicker/DateRangePicker.tsx`)
```tsx
export interface DateRange {
  from?: Date;
  to?: Date;
}

export interface DateRangePickerProps {
  value?: DateRange;
  onChange: (range: DateRange) => void;
  presets?: Array<{ label: string; range: DateRange }>;
  placeholder?: string;
  className?: string;
}
```

---

## 4. Registry & Distribution Checklist

To maintain full parity between package distribution and the shadcn CLI registry:

1. **Add Missing Primitives to Shadcn Registry (`src/registry/`)**:
   - Register `select`, `textarea`, `switch`, `checkbox`, `table`, `toast`, `spinner`, `skeleton`, and `searchbox`.
   - Register newly specified SaaS components: `combobox`, `drawer`, `alert-dialog`, `secret-input`, `multi-select`, `slider`, `popover`, `charts`, `date-picker`.
2. **Re-generate Registry Manifest (`scripts/build-registry.ts`)**:
   - Ensure `ui.arpitbhayani.me/r/registry.json` and `ui.arpitbhayani.me/r/{name}.json` expose valid schemas and dependencies.
3. **Verify Zero Custom CSS Invariant**:
   - Run build tests with `0% custom CSS` checks: no ad-hoc `.css` files, all styles driven by `@layer aui-tokens, aui-base, components`.
