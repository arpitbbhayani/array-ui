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
  return (
    <Table
      data={rows}
      columns={[
        { header: "Service", render: (r) => <code className="aui-code">{r.service}</code> },
        { header: "Region", accessor: "region" },
        { header: "p99", accessor: "p99" },
        {
          header: "Status",
          render: (r) => (
            <span className={`aui-badge aui-badge-${r.status === "Down" ? "red" : r.status === "Degraded" ? "amber" : "green"}`}>{r.status}</span>
          ),
        },
      ]}
    />
  );
}
