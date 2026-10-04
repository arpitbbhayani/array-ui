import * as React from "react";
import { cn } from "@/lib/utils";

export type PackageManagerType = "pnpm" | "npm" | "bun" | "yarn";

export interface PackageManagerProps extends React.HTMLAttributes<HTMLDivElement> {
  pkg?: string;
  defaultManager?: PackageManagerType;
}

export function PackageManager({
  pkg = "github:arpitbbhayani/aui",
  defaultManager = "pnpm",
  className,
  ...props
}: PackageManagerProps) {
  const [manager, setManager] = React.useState<PackageManagerType>(defaultManager);
  const [copied, setCopied] = React.useState(false);

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
    <div
      className={cn(
        "rounded-lg border border-border bg-card text-card-foreground overflow-hidden shadow-xs my-4",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-3 py-1.5">
        <div className="flex items-center gap-1">
          {(["pnpm", "npm", "bun", "yarn"] as PackageManagerType[]).map((pm) => (
            <button
              key={pm}
              type="button"
              className={cn(
                "px-2.5 py-1 text-xs font-mono font-medium rounded-md transition-colors cursor-pointer",
                manager === pm
                  ? "bg-background text-foreground shadow-2xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setManager(pm)}
            >
              {pm}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-3 bg-[#09090b] text-[#ececf1]">
        <code className="font-mono text-sm">{command}</code>
        <button
          type="button"
          className="text-xs px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors cursor-pointer"
          onClick={handleCopy}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
