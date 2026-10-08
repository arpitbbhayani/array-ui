import * as React from "react";

export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var m=t||(d?'dark':'light');document.documentElement.setAttribute('data-theme',m);document.documentElement.classList.toggle('dark',m==='dark');}catch(e){}})();`;

export const GOOGLE_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Assistant:wght@400;500;600;700&family=Lora:ital,wght@0,400..700;1,400..700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap";

export interface ThemeScriptProps {
  /** Also load Array UI signature Google Fonts (Space Grotesk, Assistant, Lora, IBM Plex Mono). Default true. */
  fonts?: boolean;
}

export function ThemeFonts() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={GOOGLE_FONTS_HREF} />
    </>
  );
}

export function ThemeScript({ fonts = true }: ThemeScriptProps) {
  return (
    <>
      {fonts && <ThemeFonts />}
      <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
    </>
  );
}
