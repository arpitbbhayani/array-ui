import React, { useState } from "react";
import {
  Button,
  Modal,
  Pagination,
  SegmentedControl,
  Toast,
  ToastStack,
  Input,
  Kbd,
  Table,
  SearchBox,
  Dropdown,
  VideoEmbed,
} from "../../../dist/react.js";

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
            <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>▼</span>
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

