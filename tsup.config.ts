import { defineConfig } from "tsup";
import fs from "fs";
import path from "path";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    react: "src/react/index.ts",
    tokens: "src/tokens/index.ts",
    tailwind: "src/tailwind/index.ts",
  },
  format: ["esm", "cjs"],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "astro"],
  async onSuccess() {
    // Ensure dist directory exists
    if (!fs.existsSync("dist")) {
      fs.mkdirSync("dist", { recursive: true });
    }

    // Read and bundle all CSS into a single dist/styles.css
    const tokensCss = fs.readFileSync("src/styles/tokens.css", "utf-8");
    const baseCss = fs.readFileSync("src/styles/base.css", "utf-8");
    const componentsCss = fs.readFileSync("src/styles/components.css", "utf-8");

    const fullBundle = `/* aui Design System - Full CSS Bundle */\n\n${tokensCss}\n\n${baseCss}\n\n${componentsCss}`;
    fs.writeFileSync("dist/styles.css", fullBundle);
    fs.writeFileSync("dist/tokens.css", tokensCss);
    fs.writeFileSync("dist/base.css", baseCss);
    fs.writeFileSync("dist/components.css", componentsCss);

    // Provide root d.ts shims for maximum bundler / TypeScript resolution compatibility
    fs.writeFileSync("dist/react.d.ts", 'export * from "./react/index";\n');
    fs.writeFileSync("dist/tokens.d.ts", 'export * from "./tokens/index";\n');
    fs.writeFileSync("dist/tailwind.d.ts", 'export * from "./tailwind/index";\n');

    // Copy Astro files directly to dist/astro so they can be imported as aui/astro/*
    const astroDir = "src/astro";
    const distAstroDir = "dist/astro";
    if (fs.existsSync(astroDir)) {
      if (!fs.existsSync(distAstroDir)) {
        fs.mkdirSync(distAstroDir, { recursive: true });
      }
      const files = fs.readdirSync(astroDir);
      for (const file of files) {
        fs.copyFileSync(path.join(astroDir, file), path.join(distAstroDir, file));
      }
    }
  },
});
