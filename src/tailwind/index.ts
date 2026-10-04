/**
 * aui - Tailwind CSS Preset
 * Automatically maps aui design tokens to Tailwind theme config
 */

export const auiTailwindPreset = {
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        aui: {
          primary: {
            DEFAULT: "var(--aui-primary)",
            hover: "var(--aui-primary-hover)",
            active: "var(--aui-primary-active)",
            accent: "var(--aui-primary-accent)",
          },
          bg: {
            primary: "var(--aui-bg-primary)",
            secondary: "var(--aui-bg-secondary)",
            tertiary: "var(--aui-bg-tertiary)",
          },
          text: {
            primary: "var(--aui-text-primary)",
            secondary: "var(--aui-text-secondary)",
            muted: "var(--aui-text-muted)",
          },
          border: {
            DEFAULT: "var(--aui-border-color)",
            light: "var(--aui-border-light)",
          },
          accent: {
            yellow: "var(--aui-accent-yellow)",
            orange: "var(--aui-accent-orange)",
            blue: "var(--aui-accent-blue)",
          },
        },
      },
      fontFamily: {
        sans: ["var(--aui-font-sans)"],
        serif: ["var(--aui-font-serif)"],
        mono: ["var(--aui-font-mono)"],
      },
      boxShadow: {
        aui: "var(--aui-box-shadow)",
        "aui-hover": "var(--aui-box-shadow-hover)",
      },
    },
  },
};

export default auiTailwindPreset;
