"use client";

import React, { useState } from "react";
import { FolderIcon, FolderOpenIcon, FileIcon, ChevronRightIcon, ChevronDownIcon } from "../Icons";
import { cn } from "../../utils/cn";

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

const FileTreeNodeItem: React.FC<{
  node: FileTreeNode;
  onSelect?: (item: FileTreeNode) => void;
  selected?: string;
}> = ({ node, onSelect, selected }) => {
  const isFolder = node.type === "folder" || (node.children && node.children.length > 0);
  const [isOpen, setIsOpen] = useState(node.defaultOpen ?? true);
  const isSelected = selected === node.name;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFolder) {
      setIsOpen(!isOpen);
    }
    if (onSelect) {
      onSelect(node);
    }
  };

  return (
    <div className="aui-filetree-node">
      <div
        className={cn("aui-filetree-item", isSelected && "is-selected")}
        onClick={handleClick}
      >
        <span className="aui-filetree-icon">
          {isFolder ? (
            isOpen ? <ChevronDownIcon size={13} /> : <ChevronRightIcon size={13} />
          ) : (
            <span style={{ width: 13 }} />
          )}
        </span>
        <span className="aui-filetree-icon">
          {isFolder ? (
            isOpen ? <FolderOpenIcon size={14} /> : <FolderIcon size={14} />
          ) : (
            <FileIcon size={14} />
          )}
        </span>
        <span className="aui-filetree-name">{node.name}</span>
        {node.badge && <span className="aui-filetree-badge">{node.badge}</span>}
      </div>

      {isFolder && isOpen && node.children && (
        <div className="aui-filetree-children">
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
};

export const FileTree = React.forwardRef<HTMLDivElement, FileTreeProps>(
  ({ data, onSelect, selected, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("aui-filetree", className)} {...props}>
        {data.map((node, idx) => (
          <FileTreeNodeItem
            key={idx}
            node={node}
            onSelect={onSelect}
            selected={selected}
          />
        ))}
      </div>
    );
  }
);

FileTree.displayName = "FileTree";
