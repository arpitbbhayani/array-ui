import React, { useState } from "react";
import {
  Button,
  Modal,
  Pagination,
  SegmentedControl,
  Toast,
  ToastStack,
  Input,
  Textarea,
  Select,
  Checkbox,
  Switch,
  Kbd,
  Table,
  SearchBox,
  Dropdown,
  DropdownChevron,
  VideoEmbed,
  Combobox,
  Drawer,
  AlertDialog,
  SecretInput,
  MultiSelect,
  Slider,
  Popover,
  AreaChart,
  BarChart,
  Sparkline,
  DatePicker,
  DateRangePicker,
  DataTable,
  ParamSandbox,
  Badge,
  StepNav,
  SplitPane,
  Stack,
  Row,
  Grid,
  Heading,
  Lead,
  ArchitectureCanvas,
  SideNav,
  TopNav,
  PlusIcon,
  ArrowRightIcon,
} from "../../../dist/react.js";

export function ButtonDemo() {
  const [loading, setLoading] = useState(false);

  const handleSimulate = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1800);
  };

  return (
    <div className="aui-btn-group">
      <Button variant="primary" size="sm" leftIcon={<PlusIcon />}>
        Create Cluster
      </Button>
      <Button variant="secondary" size="sm" rightIcon={<ArrowRightIcon />}>
        View Telemetry
      </Button>
      <Button
        variant="primary"
        size="sm"
        loading={loading}
        loadingText="Replicating..."
        onClick={handleSimulate}
      >
        Trigger Replicate
      </Button>
      <Button color="amber" size="sm">
        Explore Code →
      </Button>
      <Button variant="secondary" size="icon" icon={<PlusIcon />} aria-label="Add peer" />
    </div>
  );
}

export function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Delete cluster?"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={() => setOpen(false)}>
              Delete
            </Button>
          </>
        }
      >
        This permanently removes <code className="aui-code">prod-eu-1</code> and its 14 replicas. Press{" "}
        <Kbd>Esc</Kbd> to cancel.
      </Modal>
    </>
  );
}

export function PaginationDemo() {
  const [page, setPage] = useState(3);
  return <Pagination currentPage={page} totalPages={7} onPageChange={setPage} />;
}

export function SegmentedDemo() {
  const [view, setView] = useState("table");
  return (
    <div className="spec-col">
      <SegmentedControl
        value={view}
        onChange={setView}
        options={[
          { value: "table", label: "Table" },
          { value: "board", label: "Board" },
          { value: "graph", label: "Graph" },
        ]}
      />
      <span style={{ fontSize: "0.86rem", color: "var(--aui-text-muted)" }}>
        view = <code className="aui-code">{view}</code>
      </span>
    </div>
  );
}

export function ToastDemo() {
  const [toasts, setToasts] = useState<{ id: number; v: "success" | "error" | "info" }[]>([]);
  const push = (v: "success" | "error" | "info") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, v }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  };
  const copy = {
    success: ["Deployed to production", "build #4821 · 38s"],
    error: ["Build failed", "exit code 137 (OOM)"],
    info: ["Replica lag 240ms", "eu-west-1 is catching up"],
  } as const;
  return (
    <>
      <div className="spec-row">
        <Button size="sm" variant="secondary" onClick={() => push("success")}>Success</Button>
        <Button size="sm" variant="secondary" onClick={() => push("error")}>Error</Button>
        <Button size="sm" variant="secondary" onClick={() => push("info")}>Info</Button>
      </div>
      <ToastStack>
        {toasts.map((t) => (
          <Toast
            key={t.id}
            variant={t.v}
            title={copy[t.v][0]}
            description={copy[t.v][1]}
            onClose={() => setToasts((x) => x.filter((y) => y.id !== t.id))}
          />
        ))}
      </ToastStack>
    </>
  );
}

export function FormDemo() {
  return (
    <div className="spec-col" style={{ gap: 0 }}>
      <Input
        label="Search"
        placeholder="Search docs…"
        shortcut="⌘K"
        helperText="Fuzzy matches components and tokens"
      />
      <Input label="API key" defaultValue="sk_live_12" error="Key must be 32 characters" />
    </div>
  );
}

export function SelectDemo() {
  const [region, setRegion] = useState("eu");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%", maxWidth: 360 }}>
      <Select
        label="Target Region"
        value={region}
        onChange={setRegion}
        options={[
          { label: "eu-west-1 (Ireland)", value: "eu", badge: "Primary" },
          { label: "us-east-1 (Virginia)", value: "us", badge: "Replica" },
          { label: "ap-south-1 (Mumbai)", value: "ap" },
        ]}
      />
      <Textarea label="Rollout Notes" placeholder="Specify release notes…" rows={3} />
    </div>
  );
}

export function SwitchCheckboxDemo() {
  return (
    <div className="spec-row" style={{ gap: "1.5rem", flexWrap: "wrap" }}>
      <Switch label="Auto-deploy" defaultChecked />
      <Switch label="Maintenance mode" />
      <Checkbox label="Run tests" defaultChecked />
      <Checkbox label="Lint" defaultChecked />
      <Checkbox label="Type-check" />
    </div>
  );
}

export function TableDemo({ rows }: { rows: { service: string; region: string; p99: string; status: string }[] }) {
  const [dense, setDense] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "0.5rem" }}>
        <button
          type="button"
          className={`aui-btn aui-btn-sm ${dense ? "aui-btn-primary" : "aui-btn-secondary"}`}
          onClick={() => setDense(!dense)}
        >
          {dense ? "Normal rows" : "Dense mode"}
        </button>
      </div>
      <Table
        dense={dense}
        data={rows}
        columns={[
          {
            header: "Service",
            accessor: "service",
            sortable: true,
            render: (r) => <code className="aui-code">{r.service}</code>,
          },
          { header: "Region", accessor: "region", sortable: true },
          { header: "p99", accessor: "p99", sortable: true },
          {
            header: "Status",
            accessor: "status",
            sortable: true,
            render: (r) => (
              <span
                className={`aui-badge aui-badge-${
                  r.status === "Down" ? "red" : r.status === "Degraded" ? "amber" : "green"
                }`}
              >
                {r.status}
              </span>
            ),
          },
        ]}
      />
    </div>
  );
}

export function SearchBoxDemo() {
  const [results, setResults] = useState<Array<{ title: string; url: string; description?: string }>>([]);
  const items = [
    { title: "Write-Ahead Logging in PostgreSQL", description: "Deep dive into WAL buffers, fsync, and crash recovery.", url: "#blog-article" },
    { title: "Distributed Consensus with Raft", description: "Leader election, log replication, and safety invariants.", url: "#cover-card" },
    { title: "Table of Contents Component", description: "Scroll-spy aware outline with depth indentation and active states.", url: "#toc" },
    { title: "Newsletter Callout", description: "Lead-capture box with email input and social subscription links.", url: "#newsletter" },
    { title: "Package Manager Switcher", description: "Multi-manager installer switcher with click-to-copy.", url: "#package-manager" },
  ];

  return (
    <div style={{ width: "100%", maxWidth: "480px" }}>
      <SearchBox
        placeholder="Type 'wal', 'raft', 'toc', 'news', 'pack'..."
        onSearch={(query) => {
          const q = query.toLowerCase();
          setResults(
            items.filter(
              (i) =>
                i.title.toLowerCase().includes(q) ||
                (i.description && i.description.toLowerCase().includes(q))
            )
          );
        }}
        results={results}
        onSelectResult={(item) => {
          const el = document.querySelector(item.url);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </div>
  );
}

export function DropdownDemo() {
  return (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <Dropdown
        trigger={
          <Button variant="secondary" size="sm">
            <span>Actions</span>
            <DropdownChevron />
          </Button>
        }
      >
        <div className="aui-dropdown-header">Manage Service</div>
        <button type="button" className="aui-dropdown-item">
          Deploy Revision
        </button>
        <button type="button" className="aui-dropdown-item">
          View Logs
        </button>
        <div className="aui-dropdown-divider" />
        <button type="button" className="aui-dropdown-item is-destructive">
          Terminate Service
        </button>
      </Dropdown>
    </div>
  );
}

export function ComboboxDemo() {
  const [val, setVal] = useState("repo-1");
  const options = [
    { value: "repo-1", label: "px0-control/engine", description: "Main consensus daemon", badge: "v2.4" },
    { value: "repo-2", label: "px0-control/ingress", description: "Edge gateway and TLS proxy", badge: "v1.9" },
    { value: "repo-3", label: "px0-control/wal", description: "Write-ahead log storage engine", badge: "v3.0" },
    { value: "repo-4", label: "px0-control/dashboard", description: "Next.js cloud control plane", badge: "v0.8" },
  ];
  return (
    <div style={{ maxWidth: 320 }}>
      <Combobox
        options={options}
        value={val}
        onChange={setVal}
        placeholder="Select repository..."
        searchPlaceholder="Filter repos..."
      />
    </div>
  );
}

export function DrawerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        Inspect Workspace Specs
      </Button>
      <Drawer
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Workspace Details: rev-4029"
        description="Active container telemetry and mount paths"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button variant="primary" size="sm" onClick={() => setOpen(false)}>
              Restart Pod
            </Button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <p style={{ margin: 0, color: "var(--aui-text-muted)", fontSize: "0.85rem" }}>
            Pod spec running on node <code className="aui-code">k8s-node-eu-04</code>.
          </p>
          <pre style={{ margin: 0, padding: "0.75rem", background: "var(--aui-bg-tertiary)", borderRadius: "var(--aui-radius-md)", fontSize: "0.8rem", fontFamily: "var(--aui-font-mono)" }}>
{`status: Running
memory_usage: 412MiB / 2048MiB
cpu_shares: 1024
restarts: 0
egress_ip: 198.51.100.42`}
          </pre>
        </div>
      </Drawer>
    </>
  );
}

export function AlertDialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
        Teardown Cluster
      </Button>
      <AlertDialog
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={async () => {
          setOpen(false);
        }}
        title="Teardown Cluster Confirmation"
        description="This action is irreversible. All persistent storage volumes and quorum state machines will be terminated."
        confirmationPhrase="teardown prod-cluster-01"
        confirmText="Teardown Cluster"
        variant="danger"
      />
    </>
  );
}

export function SecretInputDemo() {
  return (
    <div style={{ maxWidth: 380, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <SecretInput
        label="Organization API Key"
        value="px0_live_8f0a3b89c72e140d83b9281a94e0c1f5"
        helperText="Copy this token now. It will not be shown again."
      />
    </div>
  );
}

export function MultiSelectDemo() {
  const [selected, setSelected] = useState(["read:reviews", "write:reviews"]);
  const options = [
    { value: "read:reviews", label: "read:reviews", group: "Scopes", description: "View workspace diffs" },
    { value: "write:reviews", label: "write:reviews", group: "Scopes", description: "Approve and comment" },
    { value: "admin:members", label: "admin:members", group: "Admin", description: "Invite or remove users" },
    { value: "manage:billing", label: "manage:billing", group: "Admin", description: "Update credit card" },
  ];
  return (
    <div style={{ maxWidth: 360 }}>
      <MultiSelect
        label="Token Permissions"
        options={options}
        selected={selected}
        onChange={setSelected}
        placeholder="Assign scopes..."
      />
    </div>
  );
}

export function SliderDemo() {
  const [minutes, setMinutes] = useState(45);
  return (
    <div style={{ maxWidth: 320 }}>
      <Slider
        label="Idle Sleep Timeout"
        value={minutes}
        onChange={setMinutes}
        min={15}
        max={180}
        step={15}
        valueFormatter={(v) => `${v} minutes`}
      />
    </div>
  );
}

export function PopoverDemo() {
  return (
    <Popover
      trigger={
        <Button variant="secondary" size="sm">
          <span>Filter Status</span>
          <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>▾</span>
        </Button>
      }
    >
      <div style={{ width: 200, display: "flex", flexDirection: "column", gap: "0.65rem" }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: "0.82rem" }}>Filter Deployments</p>
        <Checkbox label="Operational" defaultChecked />
        <Checkbox label="Degraded" />
        <Checkbox label="Outages" />
      </div>
    </Popover>
  );
}

export function ChartsDemo() {
  const data = [
    { date: "09:00", active: 24, queued: 6 },
    { date: "10:00", active: 48, queued: 12 },
    { date: "11:00", active: 75, queued: 18 },
    { date: "12:00", active: 92, queued: 14 },
    { date: "13:00", active: 84, queued: 9 },
    { date: "14:00", active: 110, queued: 22 },
    { date: "15:00", active: 95, queued: 11 },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", width: "100%", maxWidth: 640 }}>
      <div>
        <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.85rem", fontWeight: 600 }}>AreaChart (Active Compute Hours)</p>
        <AreaChart
          data={data}
          index="date"
          categories={["active", "queued"]}
          colors={["primary", "emerald"]}
          height={180}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <span style={{ fontSize: "0.82rem", color: "var(--aui-text-muted)" }}>Throughput Sparkline:</span>
        <Sparkline data={[12, 19, 15, 27, 34, 42, 38, 55, 62]} color="primary" />
        <Sparkline data={[80, 75, 71, 65, 50, 42, 30, 25, 20]} color="emerald" />
      </div>
    </div>
  );
}

export function DatePickerDemo() {
  const [range, setRange] = useState({
    from: new Date(Date.now() - 7 * 86400000),
    to: new Date(),
  });
  return (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      <DateRangePicker
        value={range}
        onChange={setRange}
      />
    </div>
  );
}

export function DataTableDemo() {
  const rows = [
    { id: "rev-4021", branch: "feat/raft-wal", status: "Running", memory: "412 MB", spend: "$1.40" },
    { id: "rev-4022", branch: "fix/tls-handshake", status: "Sleeping", memory: "0 MB", spend: "$0.10" },
    { id: "rev-4023", branch: "perf/simd-crc32", status: "Running", memory: "640 MB", spend: "$2.15" },
    { id: "rev-4024", branch: "chore/deps-bump", status: "Terminated", memory: "0 MB", spend: "$0.00" },
  ];
  const columns = [
    { header: "Workspace", accessor: "id" as const, sortable: true },
    { header: "Branch", accessor: "branch" as const },
    { header: "Status", accessor: "status" as const, sortable: true },
    { header: "Memory", accessor: "memory" as const },
    { header: "Spend", accessor: "spend" as const, align: "right" as const },
  ];
  return (
    <div style={{ width: "100%", maxWidth: 640 }}>
      <DataTable
        data={rows}
        columns={columns}
        selectable
        pageSize={3}
        renderBulkActions={(selected) => (
          <Button size="sm" variant="outline">
            Sleep ({selected.length})
          </Button>
        )}
      />
    </div>
  );
}

export function ParamSandboxDemo() {
  return (
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
  );
}

export function StepNavDemo() {
  const [step, setStep] = useState(1);
  const total = 4;
  return (
    <div style={{ width: "100%", maxWidth: "560px" }}>
      <StepNav
        current={step}
        total={total}
        onPrev={() => setStep((s) => Math.max(1, s - 1))}
        onNext={() => setStep((s) => Math.min(total, s + 1))}
        badge={<Badge variant="primary">Core logic</Badge>}
        showKeyboardHints
      />
    </div>
  );
}

export function SplitPaneDemo() {
  return (
    <div style={{ width: "100%", border: "1px solid var(--aui-border-light)", borderRadius: "var(--aui-radius-sm)", overflow: "hidden" }}>
      <SplitPane
        ratio="1/1"
        aside={
          <div style={{ padding: "0.85rem", background: "var(--aui-bg-secondary)", height: "100%" }}>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--aui-text-muted)", fontFamily: "var(--aui-font-mono)", fontWeight: 500 }}>Sticky Aside</span>
            <p style={{ margin: "0.35rem 0 0", fontSize: "0.82rem", color: "var(--aui-text-muted)" }}>Architecture canvas or sticky file tree stays pinned while user scrolls walkthrough explanation.</p>
          </div>
        }
      >
        <div style={{ padding: "0.85rem", background: "var(--aui-card-bg)" }}>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--aui-text-muted)", fontFamily: "var(--aui-font-mono)", fontWeight: 500 }}>Main Walkthrough Column</span>
          <p style={{ margin: "0.35rem 0 0", fontSize: "0.82rem", color: "var(--aui-text-muted)" }}>Code diffs and step details stack cleanly on mobile viewports.</p>
        </div>
      </SplitPane>
    </div>
  );
}

export function LayoutDemo() {
  return (
    <div style={{ width: "100%" }}>
      <Stack gap="sm">
        <Row justify="between" align="center" style={{ padding: "0.45rem 0.75rem", background: "var(--aui-bg-secondary)", border: "1px solid var(--aui-border-light)" }}>
          <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>Row (justify="between")</span>
          <Badge variant="green">Active</Badge>
        </Row>
        <Grid cols={3} gap="xs">
          <div style={{ padding: "0.45rem", background: "var(--aui-bg-secondary)", border: "1px solid var(--aui-border-light)", fontSize: "0.78rem", textAlign: "center" }}>Grid Col 1</div>
          <div style={{ padding: "0.45rem", background: "var(--aui-bg-secondary)", border: "1px solid var(--aui-border-light)", fontSize: "0.78rem", textAlign: "center" }}>Grid Col 2</div>
          <div style={{ padding: "0.45rem", background: "var(--aui-bg-secondary)", border: "1px solid var(--aui-border-light)", fontSize: "0.78rem", textAlign: "center" }}>Grid Col 3</div>
        </Grid>
      </Stack>
    </div>
  );
}

export function TypographyDemo() {
  return (
    <div style={{ width: "100%" }}>
      <Heading level={3}>PR Walkthrough: Core Engine</Heading>
      <Lead>A guided architectural walkthrough of storage engine changes across 4 files.</Lead>
    </div>
  );
}

export function ArchitectureCompactDemo() {
  return (
    <ArchitectureCanvas
      compact
      wrapLabels
      direction="LR"
      routing="bezier"
      title="Compact Walkthrough"
      subtitle="cubic bezier routing · visited step badges"
      nodes={[
        { id: "step1", label: "01. Auth Provider", visited: true, badge: "Done", description: "Configured OAuth provider." },
        { id: "step2", label: "02. Token Exchange", visited: true, badge: "Done", description: "JWT validation and parsing." },
        { id: "step3", label: "03. Session Store", badge: "Current", status: "warn", description: "Redis session caching." },
        { id: "step4", label: "04. Database Hook", badge: "Pending", description: "Postgres user upsert." },
      ]}
      connections={[
        { from: "step1", to: "step2", label: "token", status: "ok" },
        { from: "step2", to: "step3", label: "session", animated: true },
        { from: "step3", to: "step4", label: "upsert", variant: "dashed" },
      ]}
    />
  );
}

export function SideNavDemo() {
  const [side, setSide] = useState<"left" | "right">("left");
  const [activeTab, setActiveTab] = useState("overview");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const navItems = [
    { id: "overview", label: "Overview", icon: "⌂", active: activeTab === "overview", onClick: () => setActiveTab("overview") },
    { id: "clusters", label: "Quorum Clusters", icon: "◎", badge: "3", active: activeTab === "clusters", onClick: () => setActiveTab("clusters") },
    { id: "telemetry", label: "Live Telemetry", icon: "⚡", active: activeTab === "telemetry", onClick: () => setActiveTab("telemetry") },
    { id: "deployments", label: "Deployments", icon: "▲", active: activeTab === "deployments", onClick: () => setActiveTab("deployments") },
    { id: "security", label: "Credentials & Keys", icon: "⚿", active: activeTab === "security", onClick: () => setActiveTab("security") },
    { id: "settings", label: "Settings", icon: "⚙", active: activeTab === "settings", onClick: () => setActiveTab("settings") },
  ];

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.82rem", color: "var(--aui-text-muted)" }}>Dock Placement:</span>
          <Button
            size="sm"
            variant={side === "left" ? "primary" : "secondary"}
            onClick={() => setSide("left")}
          >
            Left Dock (side="left")
          </Button>
          <Button
            size="sm"
            variant={side === "right" ? "primary" : "secondary"}
            onClick={() => setSide("right")}
          >
            Right Dock (side="right")
          </Button>
        </div>
        {statusMessage && (
          <span style={{ fontSize: "0.8rem", color: "var(--aui-primary)", fontFamily: "var(--aui-font-mono)" }}>
            {statusMessage}
          </span>
        )}
      </div>

      <div
        style={{
          width: "100%",
          height: "440px",
          border: "1px solid var(--aui-border-color)",
          borderRadius: "var(--aui-radius-lg)",
          backgroundColor: "var(--aui-bg-primary)",
          display: "flex",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {side === "left" && (
          <SideNav
            side="left"
            brand={{
              logo: "A",
              name: "Array Console",
              subtitle: "us-east-1 · quorum v2.4",
              badge: "PRO",
              href: "#",
            }}
            items={navItems}
            user={{
              name: "Arpit Bhayani",
              email: "arpit@arpitbhayani.me",
              role: "Principal SRE",
            }}
            onLogout={() => {
              setStatusMessage("Logged out at " + new Date().toLocaleTimeString());
              setTimeout(() => setStatusMessage(null), 4000);
            }}
          />
        )}

        <div style={{ flex: 1, padding: "1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h4 style={{ margin: 0, fontSize: "1.1rem", fontFamily: "var(--aui-font-heading)", fontWeight: 700, color: "var(--aui-text-secondary)" }}>
              Workspace Content Area
            </h4>
            <Badge variant="green">Active Tab: {activeTab}</Badge>
          </div>
          <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--aui-text-muted)", lineHeight: 1.6 }}>
            The <code>SideNav</code> component renders a vertical navigation rail docked either to the <strong>left</strong> or <strong>right</strong> edge. It includes a brand identity header, vertical tabs with signature crimson indicators, and a user profile card with tactile logout trigger.
          </p>
        </div>

        {side === "right" && (
          <SideNav
            side="right"
            brand={{
              logo: "A",
              name: "Array Console",
              subtitle: "us-east-1 · quorum v2.4",
              badge: "PRO",
              href: "#",
            }}
            items={navItems}
            user={{
              name: "Arpit Bhayani",
              email: "arpit@arpitbhayani.me",
              role: "Principal SRE",
            }}
            onLogout={() => {
              setStatusMessage("Logged out at " + new Date().toLocaleTimeString());
              setTimeout(() => setStatusMessage(null), 4000);
            }}
          />
        )}
      </div>
    </div>
  );
}

export function TopNavDemo() {
  const [activeTab, setActiveTab] = useState("clusters");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1rem" }}>
      {statusMessage && (
        <div style={{ padding: "0.5rem 0.75rem", background: "var(--aui-bg-secondary)", border: "1px solid var(--aui-border-color)", borderRadius: "var(--aui-radius-md)", fontSize: "0.82rem", color: "var(--aui-primary)" }}>
          {statusMessage}
        </div>
      )}

      <div style={{ border: "1px solid var(--aui-border-color)", borderRadius: "var(--aui-radius-md)", overflow: "hidden", background: "var(--aui-bg-surface)" }}>
        <TopNav
          sticky={false}
          maxWidth="full"
          brand={{
            logo: "A",
            title: "Array Control Plane",
            subtitle: "us-east-1 · primary",
            badge: <Badge variant="green">Live</Badge>,
            href: "#",
          }}
          links={[
            {
              id: "clusters",
              label: "Quorum",
              active: activeTab === "clusters",
              onClick: () => setActiveTab("clusters"),
            },
            {
              id: "resources",
              label: "Resources",
              items: [
                { id: "docs", label: "Architecture Docs", description: "Consensus and Raft specifications", onClick: () => setStatusMessage("Navigated to Architecture Docs") },
                { id: "api", label: "REST / gRPC Reference", description: "Endpoints, parameters, and telemetry", onClick: () => setStatusMessage("Navigated to API Reference") },
                { divider: true, label: "" },
                { id: "status", label: "System Health Status", description: "Cluster uptime and node latency", onClick: () => setStatusMessage("Navigated to System Health") },
              ],
            },
            {
              id: "telemetry",
              label: "Telemetry",
              active: activeTab === "telemetry",
              onClick: () => setActiveTab("telemetry"),
            },
            {
              id: "deployments",
              label: "Deployments",
              badge: <Badge variant="cyan">v2.4</Badge>,
              active: activeTab === "deployments",
              onClick: () => setActiveTab("deployments"),
            },
          ]}
          rightActions={
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setStatusMessage("Created new cluster node!");
                setTimeout(() => setStatusMessage(null), 3000);
              }}
            >
              + New Node
            </Button>
          }
          user={{
            name: "Arpit Bhayani",
            email: "arpit@arpitbhayani.me",
            role: "Principal Engineer",
          }}
          userMenuItems={[
            { label: "Profile & Keys", onClick: () => setStatusMessage("Opened Profile & Keys") },
            { label: "Quorum Permissions", onClick: () => setStatusMessage("Opened Quorum Permissions") },
            { label: "Billing & Subscriptions", onClick: () => setStatusMessage("Opened Billing") },
          ]}
          onLogout={() => {
            setStatusMessage("Logged out at " + new Date().toLocaleTimeString());
            setTimeout(() => setStatusMessage(null), 4000);
          }}
          showThemeToggle={true}
        />

        <div style={{ padding: "1.75rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h4 style={{ margin: 0, fontSize: "1.05rem", fontFamily: "var(--aui-font-heading)", fontWeight: 700, color: "var(--aui-text-secondary)" }}>
              Header Viewport Sandbox
            </h4>
            <Badge variant="primary">Active: {activeTab}</Badge>
          </div>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--aui-text-muted)", lineHeight: 1.6 }}>
            The <code>TopNav</code> component renders an editorial navigation header bar with brand logo icon, title & subtitle, navigation links with multi-tier nested dropdown menus, actionable right-side triggers, tactile user profile avatar dropdown with logout, and an integrated theme switch selector.
          </p>
        </div>
      </div>
    </div>
  );
}
