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

```bash
npm install
npm run compile
```

Open this folder in VS Code and press `F5` to launch an Extension Development Host.
