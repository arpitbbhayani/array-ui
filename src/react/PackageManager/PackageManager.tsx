import React, { useState } from "react";
import { CopyIcon, CheckIcon } from "../Icons";

export type PackageManagerType = "pnpm" | "npm" | "bun" | "yarn";

export interface PackageManagerProps extends React.HTMLAttributes<HTMLDivElement> {
  pkg?: string;
  defaultManager?: PackageManagerType;
}

export const PackageManager: React.FC<PackageManagerProps> = ({
  pkg = "github:arpitbbhayani/aui",
  defaultManager = "pnpm",
  className = "",
  ...props
}) => {
  const [manager, setManager] = useState<PackageManagerType>(defaultManager);
  const [copied, setCopied] = useState(false);

  const getCommand = (pm: PackageManagerType) => {
    switch (pm) {
      case "pnpm":
        return `pnpm add ${pkg}`;
      case "bun":
        return `bun add ${pkg}`;
      case "yarn":
        return `yarn add ${pkg}`;
      case "npm":
      default:
        return `npm install ${pkg}`;
    }
  };

  const command = getCommand(manager);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`aui-pm-switcher ${className}`} {...props}>
      <div className="aui-pm-header">
        <div className="aui-pm-tabs">
          {(["pnpm", "npm", "bun", "yarn"] as PackageManagerType[]).map((pm) => (
            <button
              key={pm}
              type="button"
              className={`aui-pm-tab ${manager === pm ? "is-active" : ""}`}
              onClick={() => setManager(pm)}
            >
              {pm}
            </button>
          ))}
        </div>
      </div>
      <div className="aui-pm-body">
        <code className="aui-pm-code">{command}</code>
        <button
          type="button"
          className={`aui-pm-copy-btn ${copied ? "is-copied" : ""}`}
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <CheckIcon size={12} strokeWidth={3} />
              <span>Copied</span>
            </>
          ) : (
            <>
              <CopyIcon size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
