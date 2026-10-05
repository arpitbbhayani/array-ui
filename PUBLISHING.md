# Publishing Guide for Array UI (`array-ui`)

This document outlines the complete release procedure, architecture checks, and operational steps for publishing and maintaining the **`array-ui`** package on the public npm registry.

---

## 1. Package Overview & Architecture

* **npm Package**: [`array-ui`](https://www.npmjs.com/package/array-ui)
* **License**: MIT
* **Homepage**: [https://ui.arpitbhayani.me](https://ui.arpitbhayani.me)
* **GitHub Repository**: [https://github.com/arpitbbhayani/aui](https://github.com/arpitbbhayani/aui)
* **Dual Distribution**:
  1. **npm package**: Dual CJS + ESM JavaScript/TypeScript bundles, native Astro primitives, and standalone CSS stylesheets.
  2. **shadcn CLI registry**: Pure Tailwind + TypeScript components copied directly via `@aui` (`ui.arpitbhayani.me/r/{name}.json`).

### Export Map Summary
When consumers install `array-ui`, `package.json` maps these entry points:
- `array-ui` / `array-ui/react` / `array-ui/nextjs`: React & Next.js components (`dist/index.js`, `dist/react.js`, `dist/nextjs.js`).
- `array-ui/astro/*`: Native Astro primitives with zero client-side JavaScript (`dist/astro/*.astro`).
- `array-ui/tailwind`: Tailwind preset (`dist/tailwind.js`).
- `array-ui/shadcn`: shadcn token presets and theme adapters (`dist/shadcn.js`).
- `array-ui/styles.css`: Scoped CSS bundle wrapped in `@layer` (`dist/styles.css`).
- `array-ui/tokens.css` / `base.css` / `components.css`: Individual modular stylesheets.

---

## 2. First-Time Release (Initial Publish)

Follow these steps to claim the `array-ui` package name and publish version `0.1.0`.

### Step 1: Authenticate with npm
In your terminal, log in to your npm account (register at [npmjs.com](https://www.npmjs.com) if needed):

```bash
npm login
```
*You will be prompted for your username, password, email, and one-time 2FA authentication code.*

Verify your active session:
```bash
npm whoami
```

### Step 2: Build & Verify Artifacts
Run the production build:
```bash
npm run build
```
This automatically compiles:
- `tsup` bundles (CJS & ESM) into `dist/`
- TypeScript declarations (`.d.ts`) into `dist/`
- Bundled and modular CSS files into `dist/`
- Copies Astro components into `dist/astro/`
- Generates shadcn registry manifests and `llms.txt` / `llms-full.txt`

### Step 3: Inspect the Dry-Run Package
Test exactly what npm will package without uploading:
```bash
npm pack --dry-run
```
*Verify that only `dist/`, `src/`, `README.md`, and `package.json` are included, and no cache, demo build, or temporary files are present.*

### Step 4: Publish to the Public npm Registry
Run the publish command with public access:
```bash
npm publish --access public
```

*(Note: The `"prepublishOnly": "npm run build"` lifecycle hook defined in `package.json` will automatically ensure a fresh compilation before the package is uploaded).*

### Step 5: Verify the Live Package
Confirm the release is live on npm:
```bash
npm view array-ui
```
Or view the public page:
```
https://www.npmjs.com/package/array-ui
```

---

## 3. Subsequent Releases & Version Bumping

For future updates, follow semantic versioning (`major.minor.patch`):

### A. Bug Fixes / Minor Tweaks (Patch: `0.1.0` $\to$ `0.1.1`)
```bash
# Ensure working directory is clean
git status

# Bump patch version (automatically updates package.json and creates a git commit/tag)
npm version patch

# Publish to npm
npm publish

# Push git commits and version tags to GitHub
git push --follow-tags
```

### B. New Components / Features (Minor: `0.1.0` $\to$ `0.2.0`)
```bash
npm version minor
npm publish
git push --follow-tags
```

### C. Breaking Changes (Major: `0.1.0` $\to$ `1.0.0`)
```bash
npm version major
npm publish
git push --follow-tags
```

---

## 4. Release Checklist

Before running `npm publish`, verify the following invariants:

- [ ] **Clean Git Working Tree**: No unstaged experimental code or broken files (`git status`).
- [ ] **Zero Custom CSS Invariant**: Ensure no `<style>` blocks or ad-hoc page-level CSS files were introduced in `demo/` or `src/`.
- [ ] **Build Success**: `npm run build && npm run demo:build` completes with `0` errors.
- [ ] **shadcn Registry Sync**: Verify that `demo/public/r/registry.json` and `demo/public/llms.txt` match current component exports.
- [ ] **Dual Exports Validation**: Ensure `dist/styles.css` and `dist/astro/` are present and populated.

---

## 5. Automated Releases via GitHub Actions (Optional)

To publish automatically on GitHub release or git tag creation, create `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: 'https://registry.npmjs.org'

      - run: npm ci
      - run: npm run build
      - run: npm publish --provenance --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

> **Note**: To use provenance attestations, generate an automation token in npm with 2FA bypass and add it as an action secret named `NPM_TOKEN` in your GitHub repository settings.
