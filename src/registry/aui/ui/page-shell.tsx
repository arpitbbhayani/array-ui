import * as React from "react";
import { cn } from "@/lib/utils";

export interface PageShellProps extends React.HTMLAttributes<HTMLDivElement> {
  navbar?: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "6xl" | "full";
  children: React.ReactNode;
}

const maxWidthMap = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
  "2xl": "max-w-7xl",
  "6xl": "max-w-6xl",
  full: "max-w-full",
};

export function PageShell({
  navbar,
  footer,
  maxWidth = "6xl",
  children,
  className,
  ...props
}: PageShellProps) {
  return (
    <div
      className={cn(
        "min-h-screen flex flex-col bg-background text-foreground font-sans antialiased selection:bg-primary/20 selection:text-foreground",
        className
      )}
      {...props}
    >
      {navbar}
      <main
        className={cn(
          "flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12",
          maxWidthMap[maxWidth]
        )}
      >
        {children}
      </main>
      {footer}
    </div>
  );
}
