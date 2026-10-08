"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { SunIcon, MoonIcon } from "../Icons";

export interface ThemeToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  size?: number | string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = "",
  size = 20,
  ...props
}) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Before mount, render placeholder to avoid SSR mismatch
  if (!mounted) {
    return (
      <button
        type="button"
        className={`aui-theme-toggle ${className}`}
        aria-label="Toggle theme"
        title="Toggle theme"
        {...props}
      >
        <span style={{ width: size, height: size, display: "inline-block" }} />
      </button>
    );
  }

  const isDocDark =
    typeof window !== "undefined" &&
    (document.documentElement.classList.contains("dark") ||
      document.documentElement.getAttribute("data-theme") === "dark");
  const isDark = resolvedTheme ? resolvedTheme === "dark" : isDocDark;

  const handleToggle = () => {
    toggleTheme();
    setTick((t) => t + 1);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`aui-theme-toggle ${className}`}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      {...props}
    >
      {isDark ? <MoonIcon size={size} /> : <SunIcon size={size} />}
    </button>
  );
};
