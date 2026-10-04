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

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`aui-theme-toggle ${className}`}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      {...props}
    >
      {isDark ? <MoonIcon size={size} /> : <SunIcon size={size} />}
    </button>
  );
};
