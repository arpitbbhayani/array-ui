"use client";

import React, { useState } from "react";

export interface TabItem {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
  activeTabId?: string;
  onChange?: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTabId,
  activeTabId,
  onChange,
  className = "",
}) => {
  const [selectedId, setSelectedId] = useState(defaultTabId || (tabs[0] ? tabs[0].id : ""));
  const currentId = activeTabId !== undefined ? activeTabId : selectedId;

  const handleSelect = (id: string) => {
    if (activeTabId === undefined) {
      setSelectedId(id);
    }
    onChange?.(id);
  };

  return (
    <div className={`aui-tabs ${className}`}>
      <ul className="aui-tabs-list" role="tablist">
        {tabs.map((tab) => {
          const isActive = tab.id === currentId;
          return (
            <li key={tab.id}>
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`aui-tab-trigger ${isActive ? "is-active" : ""}`}
                onClick={() => handleSelect(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          );
        })}
      </ul>

      {tabs.map((tab) => {
        const isActive = tab.id === currentId;
        return (
          <div
            key={tab.id}
            role="tabpanel"
            className={`aui-tab-panel ${isActive ? "is-active" : ""}`}
          >
            {tab.content}
          </div>
        );
      })}
    </div>
  );
};
