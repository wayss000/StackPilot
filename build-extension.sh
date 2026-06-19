#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$ROOT_DIR"

echo "==> Bumping patch version"
npm version patch --no-git-tag-version

echo "==> Installing dependencies with pnpm"
pnpm install

echo "==> Compiling extension"
pnpm run compare

echo "==> Packaging VSIX"
yes | npx @vscode/vsce package --allow-missing-repository

echo "==> Done"
