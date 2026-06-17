import * as vscode from 'vscode';
import { STACK_PROFILES } from './catalog';
import { DetectionResult, StackId } from './types';

type PackageJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

export async function detectWorkspaceStack(): Promise<DetectionResult | undefined> {
  const folder = vscode.workspace.workspaceFolders?.[0];
  if (!folder) {
    return undefined;
  }

  const checks: Array<() => Promise<DetectionResult | undefined>> = [
    () => detectAiAgent(folder),
    () => detectJava(folder),
    () => detectGo(folder),
    () => detectRust(folder),
    () => detectPackageStack(folder),
    () => detectPython(folder)
  ];

  for (const check of checks) {
    const result = await check();
    if (result) {
      return result;
    }
  }

  return undefined;
}

async function detectJava(folder: vscode.WorkspaceFolder): Promise<DetectionResult | undefined> {
  const evidence = await existingFiles(folder, ['pom.xml', 'build.gradle', 'build.gradle.kts']);
  return evidence.length ? result('java', folder, evidence) : undefined;
}

async function detectGo(folder: vscode.WorkspaceFolder): Promise<DetectionResult | undefined> {
  const evidence = await existingFiles(folder, ['go.mod']);
  return evidence.length ? result('go', folder, evidence) : undefined;
}

async function detectRust(folder: vscode.WorkspaceFolder): Promise<DetectionResult | undefined> {
  const evidence = await existingFiles(folder, ['Cargo.toml']);
  return evidence.length ? result('rust', folder, evidence) : undefined;
}

async function detectPython(folder: vscode.WorkspaceFolder): Promise<DetectionResult | undefined> {
  const evidence = await existingFiles(folder, ['requirements.txt', 'pyproject.toml', 'Pipfile', 'poetry.lock', 'uv.lock']);
  return evidence.length ? result('python', folder, evidence) : undefined;
}

async function detectAiAgent(folder: vscode.WorkspaceFolder): Promise<DetectionResult | undefined> {
  const evidence = await existingFiles(folder, ['mcp.json', '.mcp.json', 'agents.md', 'AGENTS.md', '.cursor/rules']);
  const packageJson = await readPackageJson(folder);

  if (packageJson) {
    const deps = dependencyNames(packageJson);
    const agentDeps = ['@modelcontextprotocol/sdk', 'ai', 'langchain', 'openai', '@langchain/core'];
    const matched = agentDeps.filter((dep) => deps.has(dep));
    evidence.push(...matched.map((dep) => `package.json dependency: ${dep}`));
  }

  return evidence.length ? result('ai-agent', folder, evidence) : undefined;
}

async function detectPackageStack(folder: vscode.WorkspaceFolder): Promise<DetectionResult | undefined> {
  const packageJson = await readPackageJson(folder);
  if (!packageJson) {
    return undefined;
  }

  const deps = dependencyNames(packageJson);

  if (deps.has('vue') || deps.has('nuxt')) {
    return result('vue', folder, ['package.json dependency: vue/nuxt']);
  }

  if (deps.has('react') || deps.has('next')) {
    return result('react', folder, ['package.json dependency: react/next']);
  }

  return result('node', folder, ['package.json']);
}

async function existingFiles(folder: vscode.WorkspaceFolder, paths: string[]): Promise<string[]> {
  const found: string[] = [];

  for (const path of paths) {
    try {
      await vscode.workspace.fs.stat(vscode.Uri.joinPath(folder.uri, path));
      found.push(path);
    } catch {
      // Missing marker files are expected while probing a workspace.
    }
  }

  return found;
}

async function readPackageJson(folder: vscode.WorkspaceFolder): Promise<PackageJson | undefined> {
  try {
    const bytes = await vscode.workspace.fs.readFile(vscode.Uri.joinPath(folder.uri, 'package.json'));
    return JSON.parse(Buffer.from(bytes).toString('utf8')) as PackageJson;
  } catch {
    return undefined;
  }
}

function dependencyNames(packageJson: PackageJson): Set<string> {
  return new Set([
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.devDependencies ?? {}),
    ...Object.keys(packageJson.peerDependencies ?? {})
  ]);
}

function result(stackId: StackId, workspaceFolder: vscode.WorkspaceFolder, evidence: string[]): DetectionResult {
  return {
    stack: STACK_PROFILES[stackId],
    workspaceFolder,
    evidence
  };
}
