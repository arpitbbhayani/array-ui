/**
 * aui - Tailwind CSS Preset & shadcn/ui Preset
 * Automatically maps aui design tokens to Tailwind theme config
 */

export const auiTailwindColors = {
  aui: {
    primary: {
      DEFAULT: "var(--aui-primary)",
      hover: "var(--aui-primary-hover)",
      active: "var(--aui-primary-active)",
      accent: "var(--aui-primary-accent)",
      soft: "var(--aui-primary-soft)",
      text: "var(--aui-primary-text)",
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
      strong: "var(--aui-border-strong)",
    },
    accent: {
      yellow: "var(--aui-accent-yellow)",
      orange: "var(--aui-accent-orange)",
      blue: "var(--aui-accent-blue)",
    },
  },
};

export const auiTailwindPreset = {
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: auiTailwindColors,
      fontFamily: {
        sans: ["var(--aui-font-sans)", "Assistant", "-apple-system", "sans-serif"],
        heading: ["var(--aui-font-heading)", "Plus Jakarta Sans", "Assistant", "sans-serif"],
        serif: ["var(--aui-font-serif)", "Lora", "Georgia", "serif"],
        mono: ["var(--aui-font-mono)", "IBM Plex Mono", "Geist Mono", "monospace"],
      },
      boxShadow: {
        aui: "var(--aui-box-shadow)",
        "aui-hover": "var(--aui-box-shadow-hover)",
        "aui-lg": "var(--aui-box-shadow-lg)",
      },
      borderRadius: {
        "aui-sm": "var(--aui-radius-sm)",
        "aui-md": "var(--aui-radius-md)",
        "aui-lg": "var(--aui-radius-lg)",
        "aui-xl": "var(--aui-radius-xl)",
      },
    },
  },
};

/**
 * Drop-in preset for projects using shadcn/ui.
 * Configures both shadcn's core color tokens (background, foreground, primary, border, etc.)
 * and aui's signature design system tokens.
 */
export const auiShadcnPreset = {
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        ...auiTailwindColors,
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "var(--aui-primary-hover, hsl(var(--primary) / 0.9))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--aui-font-sans)", "Assistant", "-apple-system", "sans-serif"],
        heading: ["var(--aui-font-heading)", "Plus Jakarta Sans", "Assistant", "sans-serif"],
        serif: ["var(--aui-font-serif)", "Lora", "Georgia", "serif"],
        mono: ["var(--aui-font-mono)", "IBM Plex Mono", "Geist Mono", "monospace"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
};

export default auiTailwindPreset;
