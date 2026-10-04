import * as React from "react";
import { cn } from "@/lib/utils";

export interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  trigger: React.ReactNode;
  align?: "left" | "right";
  children: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Dropdown({
  trigger,
  align = "right",
  children,
  className,
  isOpen: controlledOpen,
  onOpenChange,
  ...props
}: DropdownProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const containerRef = React.useRef<HTMLDivElement>(null);

  const toggle = () => {
    const next = !open;
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  const close = () => {
    if (!isControlled) setUncontrolledOpen(false);
    onOpenChange?.(false);
  };

  React.useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }
    };
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-flex", className)}
      {...props}
    >
      <div
        className="inline-flex items-center gap-1 cursor-pointer"
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {trigger}
      </div>
      {open && (
        <div
          className={cn(
            "absolute top-[calc(100%+0.35rem)] min-w-[180px] bg-card border border-border rounded-md shadow-lg p-1.5 z-50 flex flex-col animate-in fade-in-0 zoom-in-95",
            align === "left" ? "left-0" : "right-0"
          )}
          role="menu"
        >
          {children}
        </div>
      )}
    </div>
  );
}

export interface DropdownItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  destructive?: boolean;
}

export function DropdownItem({
  destructive,
  className,
  children,
  ...props
}: DropdownItemProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex items-center gap-2 w-full px-3 py-1.5 text-sm font-medium text-left rounded cursor-pointer transition-colors text-foreground hover:bg-muted focus:bg-muted outline-none",
        destructive && "text-red-500 hover:text-red-500 hover:bg-red-500/10 focus:bg-red-500/10",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function DropdownDivider({ className }: { className?: string }) {
  return <div className={cn("h-px bg-border my-1", className)} />;
}
