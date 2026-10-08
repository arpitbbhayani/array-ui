import { defineConfig } from "tsup";
import fs from "fs";
import path from "path";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    react: "src/react/index.ts",
    nextjs: "src/react/index.ts",
    reactflow: "src/react/ReactFlow/index.ts",
    tokens: "src/tokens/index.ts",
    tailwind: "src/tailwind/index.ts",
    shadcn: "src/shadcn/index.ts",
    utils: "src/utils/index.ts",
    "lib/utils": "src/lib/utils.ts",
  },
  format: ["esm", "cjs"],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "astro", "@xyflow/react"],
  async onSuccess() {
    // Ensure dist directory exists
    if (!fs.existsSync("dist")) {
      fs.mkdirSync("dist", { recursive: true });
    }

    // Read CSS files
    const tokensCss = fs.readFileSync("src/styles/tokens.css", "utf-8");
    const baseCss = fs.readFileSync("src/styles/base.css", "utf-8");
    const componentsCss = fs.readFileSync("src/styles/components.css", "utf-8");
    const shadcnCss = fs.existsSync("src/styles/shadcn.css")
      ? fs.readFileSync("src/styles/shadcn.css", "utf-8")
      : "";

    // Extract @import rules so they remain at the very top of fullBundle (required by CSS specification)
    const importRegex = /@import\s+[^\n]+;/g;
    const imports = tokensCss.match(importRegex) || [];
    const tokensWithoutImports = tokensCss.replace(importRegex, "").trim();

    // Wrap in CSS Cascade Layers: ensures Tailwind's @layer utilities always overrides aui components cleanly
    const fullBundle = `/* aui Design System - Full CSS Bundle */\n${imports.join(
      "\n"
    )}\n\n@layer aui-tokens, aui-base, components;\n\n@layer aui-tokens {\n${tokensWithoutImports}\n}\n\n@layer aui-base {\n${baseCss}\n}\n\n@layer components {\n${componentsCss}\n}\n`;

    fs.writeFileSync("dist/styles.css", fullBundle);
    fs.writeFileSync(
      "dist/styles.unlayered.css",
      `/* aui Design System - Unlayered CSS Bundle */\n\n${tokensCss}\n\n${baseCss}\n\n${componentsCss}`
    );
    fs.writeFileSync("dist/tokens.css", tokensCss);
    fs.writeFileSync("dist/base.css", baseCss);
    fs.writeFileSync("dist/components.css", componentsCss);
    if (shadcnCss) {
      fs.writeFileSync("dist/shadcn.css", shadcnCss);
    }

    // Provide root d.ts shims for maximum bundler / TypeScript resolution compatibility
    fs.writeFileSync("dist/react.d.ts", 'export * from "./react/index";\n');
    fs.writeFileSync("dist/nextjs.d.ts", 'export * from "./react/index";\n');
    fs.writeFileSync("dist/next.d.ts", 'export * from "./react/index";\n');
    fs.writeFileSync("dist/reactflow.d.ts", 'export * from "./react/ReactFlow/index";\n');
    fs.writeFileSync("dist/tokens.d.ts", 'export * from "./tokens/index";\n');
    fs.writeFileSync("dist/tailwind.d.ts", 'export * from "./tailwind/index";\n');
    fs.writeFileSync("dist/shadcn.d.ts", 'export * from "./shadcn/index";\n');
    fs.writeFileSync("dist/utils.d.ts", 'export * from "./utils/index";\n');
    if (!fs.existsSync("dist/lib")) {
      fs.mkdirSync("dist/lib", { recursive: true });
    }
    fs.writeFileSync("dist/lib/utils.d.ts", 'export * from "../utils/index";\n');

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
