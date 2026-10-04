import React, { useState, useEffect, useRef } from "react";
import { SearchIcon, Kbd, CloseIcon, ArrowUpRightIcon } from "..";

export interface CommandItem {
  id: string;
  label: string;
  category: string;
  shortcut?: string;
  href?: string;
  action?: () => void;
}

export interface CommandPaletteProps {
  items?: CommandItem[];
  isOpen?: boolean;
  onClose?: () => void;
  enableGlobalShortcut?: boolean;
}

const defaultCommandItems: CommandItem[] = [
  // Actions
  { id: "toggle-theme", label: "Toggle Dark / Light Theme", category: "Actions", shortcut: "⌘D", action: () => {
    const btn = document.getElementById("aui-theme-toggle");
    if (btn) btn.click();
  }},
  { id: "copy-install", label: "Copy Install Command", category: "Actions", action: () => {
    navigator.clipboard.writeText("npm install github:arpitbbhayani/aui");
  }},
  { id: "github", label: "Open GitHub Repository", category: "Actions", href: "https://github.com/arpitbbhayani/aui" },

  // Foundations
  { id: "colors", label: "Colors & Tokens", category: "Foundations", href: "#colors" },
  { id: "typography", label: "Typography & Fonts", category: "Foundations", href: "#typography" },
  { id: "elevation", label: "Radius & Elevation", category: "Foundations", href: "#elevation" },

  // Developer Components
  { id: "ping", label: "PingStatus (Live Status Dot)", category: "Developer Components", href: "#ping-status" },
  { id: "diff", label: "DiffBlock (Git Patch Viewer)", category: "Developer Components", href: "#diff-block" },
  { id: "property", label: "PropertyGrid (Metadata Inspector)", category: "Developer Components", href: "#property-grid" },
  { id: "filetree", label: "FileTree (Directory Explorer)", category: "Developer Components", href: "#file-tree" },

  // UI Components
  { id: "buttons", label: "Button", category: "Actions", href: "#buttons" },
  { id: "segmented", label: "Segmented Control", category: "Actions", href: "#segmented" },
  { id: "modal", label: "Modal / Dialog", category: "Feedback", href: "#modal" },
  { id: "toast", label: "Toast Notifications", category: "Feedback", href: "#toast" },
  { id: "table", label: "Table", category: "Data Display", href: "#table" },
  { id: "codeblock", label: "Code Block", category: "Data Display", href: "#codeblock" },
  { id: "terminal", label: "Terminal", category: "Data Display", href: "#terminal" },
  { id: "statcard", label: "Stat Card", category: "Data Display", href: "#stat" },
  { id: "kbd", label: "Kbd (Keyboard Shortcut)", category: "Actions", href: "#kbd" },
  { id: "tooltip", label: "Tooltip", category: "Actions", href: "#tooltip" },
  { id: "input", label: "Input & Forms", category: "Forms", href: "#input" },
  { id: "breadcrumbs", label: "Breadcrumbs", category: "Navigation", href: "#breadcrumbs" },
  { id: "tabs", label: "Tabs", category: "Navigation", href: "#tabs" },
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  items = defaultCommandItems,
  isOpen: controlledOpen,
  onClose: controlledClose,
  enableGlobalShortcut = true,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const close = () => {
    if (controlledClose) controlledClose();
    setInternalOpen(false);
    setQuery("");
  };

  useEffect(() => {
    if (!enableGlobalShortcut) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setInternalOpen((prev) => !prev);
      } else if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setInternalOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enableGlobalShortcut]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredItems = items.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (item: CommandItem) => {
    close();
    if (item.action) {
      item.action();
    } else if (item.href) {
      if (item.href.startsWith("http")) {
        window.open(item.href, "_blank");
      } else {
        window.location.hash = item.href;
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredItems[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="aui-command-backdrop" onClick={close}>
      <div className="aui-command-dialog" onClick={(e) => e.stopPropagation()} onKeyDown={handleKeyDown}>
        <div className="aui-command-input-wrapper">
          <SearchIcon size={18} />
          <input
            ref={inputRef}
            className="aui-command-input"
            placeholder="Search components, tokens, actions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="button"
            onClick={close}
            style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--aui-text-muted)" }}
          >
            <CloseIcon size={16} />
          </button>
        </div>

        <div className="aui-command-list">
          {filteredItems.length === 0 ? (
            <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--aui-text-muted)", fontSize: "0.9rem" }}>
              No matching results found for "{query}"
            </div>
          ) : (
            filteredItems.map((item, idx) => (
              <div
                key={item.id}
                className={`aui-command-item ${idx === selectedIndex ? "is-selected" : ""}`}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--aui-text-muted)", textTransform: "uppercase" }}>
                    {item.category}
                  </span>
                  <span>·</span>
                  <span style={{ fontWeight: 500 }}>{item.label}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  {item.shortcut && <Kbd>{item.shortcut}</Kbd>}
                  {item.href?.startsWith("http") && <ArrowUpRightIcon size={12} />}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="aui-command-footer">
          <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
            <span><Kbd>↑</Kbd> <Kbd>↓</Kbd> navigate</span>
            <span><Kbd>↵</Kbd> select</span>
            <span><Kbd>esc</Kbd> close</span>
          </div>
          <span style={{ color: "var(--aui-primary)", fontWeight: 600 }}>aui</span>
        </div>
      </div>
    </div>
  );
};
