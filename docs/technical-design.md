# StackPilot Technical Design

## Product Positioning

StackPilot is a lightweight profile guide for VS Code-compatible editors.

It detects the current workspace stack, recommends a focused IDE profile, and helps users import or switch to that profile manually.

## Product Principles

- Do not silently install extensions.
- Do not silently uninstall extensions.
- Do not silently switch the current IDE profile.
- Keep the user in control of profile creation, import, and association.
- Prefer stable VS Code extension APIs over internal commands.

## Why Manual Profile Guidance

VS Code profiles can be associated with folders and workspaces. After a user selects a profile for a workspace, VS Code remembers that association and applies it when the workspace is opened again.

VS Code also supports profile import/export through the Profiles UI and `.code-profile` files. However, the public extension API does not currently expose a stable first-class API for silently creating, importing, or switching profiles from an extension.

StackPilot therefore treats profile operations as guided user actions.

## MVP Scope

- Detect Java, Go, Python, Vue, React, Node.js, Rust, and AI Agent projects.
- Recommend a `StackPilot <Stack>` profile.
- Show a recommended extension catalog for the detected stack.
- Open the bundled profile template.
- Record ignored projects and ignored stacks in VS Code global state.

## Out of Scope

- Automatic profile switching.
- Automatic extension install or uninstall.
- Team profile sync.
- Cloud configuration.
- Marketplace integration.

## Architecture

- `src/detectors.ts`: workspace marker and dependency detection.
- `src/catalog.ts`: stack-to-profile catalog and recommended extensions.
- `src/profileGuide.ts`: profile template and manual switch guidance.
- `src/storage.ts`: ignored project and stack state.
- `src/extension.ts`: command registration and activation flow.

The `ProfileGuide` layer intentionally isolates profile-related behavior so future editor APIs can be adopted without changing detection logic.
