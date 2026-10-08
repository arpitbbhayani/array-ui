import React from "react";

export const themeScriptSnippet = `
(function() {
  try {
    var storedTheme = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = storedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();
`.trim();

export const GOOGLE_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Assistant:wght@400;500;600;700&family=Lora:ital,wght@0,400..700;1,400..700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap";

export function ThemeFonts() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={GOOGLE_FONTS_HREF} />
    </>
  );
}

export interface ThemeScriptProps {
  fonts?: boolean;
}

export const ThemeScript: React.FC<ThemeScriptProps> = ({ fonts = true }) => {
  return (
    <>
      {fonts && <ThemeFonts />}
      <script
        dangerouslySetInnerHTML={{
          __html: themeScriptSnippet,
        }}
      />
    </>
  );
};
