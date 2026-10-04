import React, { useState } from "react";
import { CopyIcon, CheckIcon } from "../Icons";

export interface PropertyItem {
  label: string;
  value: React.ReactNode;
  copyable?: boolean;
  copyValue?: string;
}

export interface PropertyGridProps extends React.HTMLAttributes<HTMLDivElement> {
  items: PropertyItem[];
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({
  items,
  className = "",
  ...props
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <div className={`aui-property-grid ${className}`} {...props}>
      {items.map((item, idx) => {
        const strVal = item.copyValue ?? (typeof item.value === "string" ? item.value : undefined);
        const isCopied = copiedKey === item.label;

        return (
          <div key={idx} className="aui-property-row">
            <span className="aui-property-key">{item.label}</span>
            <div className="aui-property-val">
              <span>{item.value}</span>
              {item.copyable !== false && strVal && (
                <button
                  type="button"
                  className="aui-property-copy-btn"
                  title="Copy value"
                  onClick={() => handleCopy(item.label, strVal)}
                >
                  {isCopied ? <CheckIcon size={13} strokeWidth={3} /> : <CopyIcon size={13} />}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
