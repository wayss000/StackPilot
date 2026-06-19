# StackPilot

StackPilot is a lightweight VS Code-compatible extension that detects the current project stack and guides developers to a focused editor profile.

It is designed for developers who switch between Java, Go, Python, Vue, React, Node.js, Rust, and AI Agent projects without wanting every extension enabled all the time.

## MVP Behavior

- Detect the active workspace stack.
- Recommend a `StackPilot <Stack>` profile.
- Show the recommended extension catalog.
- Open a bundled `.code-profile` template.
- Remember ignored projects and ignored stacks.

StackPilot does not silently install extensions, uninstall extensions, or switch profiles. Profile changes remain under the user's control.

## Development

### Prerequisites

- Node.js 20+ is recommended.
- pnpm is recommended for daily development.
- `vsce` is required if you want to package the extension into a `.vsix` file.

### Install Dependencies

```bash
pnpm install
```

### Compile Locally

```bash
pnpm run compile
```

After compilation, the extension entry file will be generated at `out/extension.js`.

If you want to recompile automatically while developing, run:

```bash
pnpm run watch
```

### One-Command Build Script

If you have finished making code changes and want to install dependencies, compile the extension, and package the `.vsix` in one step, run:

```bash
./build-extension.sh
```

This script will execute:

```bash
npm version patch --no-git-tag-version
pnpm install
pnpm run compare
npx @vscode/vsce package
```

Notes:

- `pnpm run compare` is provided as a compatibility alias and performs the same action as `pnpm run compile`.
- The script automatically bumps the patch version in `package.json` before packaging, so each generated `.vsix` uses a new version number.
- The packaging step uses `npx @vscode/vsce package`, so developers do not need to install `vsce` globally first.
- The build script is configured for non-interactive packaging, so it will auto-confirm common `vsce` prompts during local builds.

### Local Development and Debugging

This project is a standard VS Code-compatible extension.

1. Open this folder in VS Code or Cursor.
2. Run `pnpm install`.
3. Run `pnpm run compile` once, or keep `pnpm run watch` running.
4. Press `F5` (or start the `Run Extension` debug flow) to launch an Extension Development Host window.
5. In the new window, open any project folder and test StackPilot commands from the Command Palette, such as:
   - `StackPilot: Detect Current Project`
   - `StackPilot: Show Profile Recommendation`
   - `StackPilot: Open Profile Template`

Recommended daily workflow:

1. Keep `pnpm run watch` running while developing so TypeScript recompiles automatically.
2. Use `F5` to open an Extension Development Host for interactive testing.
3. After your changes are ready, run `./build-extension.sh` to auto-increment the patch version and generate the latest `.vsix` package.

### Package the Extension

To install this extension into your own editor, package it into a `.vsix` file first.

If you do not have `vsce` yet, you can use one of these options:

```bash
npm install -g @vscode/vsce
```

or:

```bash
pnpm dlx @vscode/vsce package
```

You can package the extension directly with:

```bash
npx @vscode/vsce package
```

This will generate a file like `stackpilot-0.0.1.vsix` in the project root.

### Install into VS Code

1. Open VS Code.
2. Go to the Extensions view.
3. Click the top-right `...` menu.
4. Choose `Install from VSIX...`.
5. Select the generated `stackpilot-0.0.1.vsix` file.
6. Reload VS Code if prompted.

### Install into Cursor

Cursor is compatible with VS Code extensions, so the installation flow is almost the same:

1. Open Cursor.
2. Go to the Extensions view.
3. Click the top-right `...` menu.
4. Choose `Install from VSIX...`.
5. Select the generated `stackpilot-0.0.1.vsix` file.
6. Reload Cursor if prompted.

### Verify the Installation

After installation, open any workspace and use the Command Palette to search for:

- `StackPilot: Detect Current Project`
- `StackPilot: Show Profile Recommendation`
- `StackPilot: Open Profile Template`

If these commands are available, the extension has been installed successfully.
