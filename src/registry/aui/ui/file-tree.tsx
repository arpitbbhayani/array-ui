"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface FileTreeNode {
  name: string;
  type?: "file" | "folder";
  children?: FileTreeNode[];
  badge?: string;
  defaultOpen?: boolean;
}

export interface FileTreeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  data: FileTreeNode[];
  onSelect?: (item: FileTreeNode) => void;
  selected?: string;
}

function FileTreeNodeItem({
  node,
  onSelect,
  selected,
}: {
  node: FileTreeNode;
  onSelect?: (item: FileTreeNode) => void;
  selected?: string;
}) {
  const isFolder = node.type === "folder" || Boolean(node.children && node.children.length > 0);
  const [isOpen, setIsOpen] = React.useState(node.defaultOpen ?? true);
  const isSelected = selected === node.name;

  return (
    <div className="text-xs font-mono select-none">
      <div
        className={cn(
          "flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer transition-colors",
          isSelected ? "bg-muted font-semibold text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        )}
        onClick={(e) => {
          e.stopPropagation();
          if (isFolder) setIsOpen(!isOpen);
          onSelect?.(node);
        }}
      >
        <span className="w-3 text-center text-[10px] text-muted-foreground">
          {isFolder ? (isOpen ? "▾" : "▸") : "•"}
        </span>
        <span className="flex-1">{node.name}</span>
        {node.badge && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
            {node.badge}
          </span>
        )}
      </div>
      {isFolder && isOpen && node.children && (
        <div className="pl-4 border-l border-border/60 ml-2 space-y-0.5 mt-0.5">
          {node.children.map((child, idx) => (
            <FileTreeNodeItem
              key={idx}
              node={child}
              onSelect={onSelect}
              selected={selected}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileTree({ data, onSelect, selected, className, ...props }: FileTreeProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-3 shadow-2xs space-y-0.5 my-4",
        className
      )}
      {...props}
    >
      {data.map((node, idx) => (
        <FileTreeNodeItem key={idx} node={node} onSelect={onSelect} selected={selected} />
      ))}
    </div>
  );
}
