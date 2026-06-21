import * as vscode from 'vscode';
import { STACK_PROFILES } from './catalog';
import { DetectedStack, DetectionResult, StackId } from './types';

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

  const checks: Array<() => Promise<DetectedStack | undefined>> = [
    () => detectAiAgent(folder),
    () => detectJava(folder),
    () => detectGo(folder),
    () => detectRust(folder),
    () => detectPackageStack(folder),
    () => detectPython(folder),
    () => detectMarkdownKnowledgeBase(folder)
  ];
  const detectedStacks = new Map<StackId, DetectedStack>();

  for (const check of checks) {
    const result = await check();
    if (result) {
      detectedStacks.set(result.stack.id, result);
    }
  }

  const languageStacks = await detectLanguageFiles(folder);
  for (const detected of languageStacks) {
    const existing = detectedStacks.get(detected.stack.id);
    if (existing) {
      existing.evidence.push(...detected.evidence);
    } else {
      detectedStacks.set(detected.stack.id, detected);
    }
  }

  const stacks = [...detectedStacks.values()];
  if (!stacks.length) {
    return undefined;
  }

  const recommendedProfile = selectRecommendedProfile(stacks.map((item) => item.stack.id));

  return {
    recommendedProfile: STACK_PROFILES[recommendedProfile],
    detectedStacks: stacks,
    workspaceFolder: folder,
    evidence: stacks.flatMap((item) => item.evidence)
  };
}

async function detectJava(folder: vscode.WorkspaceFolder): Promise<DetectedStack | undefined> {
  const evidence = await existingFiles(folder, ['pom.xml', 'build.gradle', 'build.gradle.kts']);
  return evidence.length ? result('java', evidence) : undefined;
}

async function detectGo(folder: vscode.WorkspaceFolder): Promise<DetectedStack | undefined> {
  const evidence = await existingFiles(folder, ['go.mod']);
  return evidence.length ? result('go', evidence) : undefined;
}

async function detectRust(folder: vscode.WorkspaceFolder): Promise<DetectedStack | undefined> {
  const evidence = await existingFiles(folder, ['Cargo.toml']);
  return evidence.length ? result('rust', evidence) : undefined;
}

async function detectPython(folder: vscode.WorkspaceFolder): Promise<DetectedStack | undefined> {
  const evidence = await existingFiles(folder, ['requirements.txt', 'pyproject.toml', 'Pipfile', 'poetry.lock', 'uv.lock']);
  return evidence.length ? result('python', evidence) : undefined;
}

async function detectAiAgent(folder: vscode.WorkspaceFolder): Promise<DetectedStack | undefined> {
  const evidence = await existingFiles(folder, ['mcp.json', '.mcp.json', 'agents.md', 'AGENTS.md', '.cursor/rules']);
  const packageJson = await readPackageJson(folder);

  if (packageJson) {
    const deps = dependencyNames(packageJson);
    const agentDeps = ['@modelcontextprotocol/sdk', 'ai', 'langchain', 'openai', '@langchain/core'];
    const matched = agentDeps.filter((dep) => deps.has(dep));
    evidence.push(...matched.map((dep) => `package.json dependency: ${dep}`));
  }

  return evidence.length ? result('ai-agent', evidence) : undefined;
}

async function detectMarkdownKnowledgeBase(folder: vscode.WorkspaceFolder): Promise<DetectedStack | undefined> {
  const files = await vscode.workspace.findFiles(
    new vscode.RelativePattern(folder, '**/*.md'),
    new vscode.RelativePattern(folder, '{**/node_modules/**,**/.git/**,**/dist/**,**/build/**,**/out/**,**/target/**,**/coverage/**,**/vendor/**,**/.venv/**,**/venv/**}'),
    500
  );

  return files.length
    ? result('markdown', [`${files.length}${files.length === 500 ? '+' : ''} Markdown document${files.length === 1 ? '' : 's'}`])
    : undefined;
}

async function detectPackageStack(folder: vscode.WorkspaceFolder): Promise<DetectedStack | undefined> {
  const packageJson = await readPackageJson(folder);
  if (!packageJson) {
    return undefined;
  }

  const deps = dependencyNames(packageJson);

  if (deps.has('vue') || deps.has('nuxt')) {
    return result('vue', ['package.json dependency: vue/nuxt']);
  }

  if (deps.has('react') || deps.has('next')) {
    return result('react', ['package.json dependency: react/next']);
  }

  return result('node', ['package.json']);
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

async function detectLanguageFiles(folder: vscode.WorkspaceFolder): Promise<DetectedStack[]> {
  const files = await vscode.workspace.findFiles(
    new vscode.RelativePattern(folder, '**/*.{java,kt,kts,go,rs,py,vue,tsx,jsx,ts,js}'),
    new vscode.RelativePattern(folder, '{**/node_modules/**,**/.git/**,**/dist/**,**/build/**,**/out/**,**/target/**,**/coverage/**,**/vendor/**,**/.venv/**,**/venv/**}'),
    500
  );
  const counts = new Map<StackId, number>();

  for (const file of files) {
    const path = file.path.toLowerCase();
    const stackId = stackIdFromPath(path);
    if (stackId) {
      counts.set(stackId, (counts.get(stackId) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .filter(([, count]) => count > 0)
    .map(([stackId, count]) => result(stackId, [`${count} ${STACK_PROFILES[stackId].label} source file${count === 1 ? '' : 's'}`]));
}

function stackIdFromPath(path: string): StackId | undefined {
  if (path.endsWith('.vue')) {
    return 'vue';
  }
  if (path.endsWith('.tsx') || path.endsWith('.jsx')) {
    return 'react';
  }
  if (path.endsWith('.java') || path.endsWith('.kt') || path.endsWith('.kts')) {
    return 'java';
  }
  if (path.endsWith('.go')) {
    return 'go';
  }
  if (path.endsWith('.rs')) {
    return 'rust';
  }
  if (path.endsWith('.py')) {
    return 'python';
  }
  if (path.endsWith('.ts') || path.endsWith('.js')) {
    return 'node';
  }

  return undefined;
}

function selectRecommendedProfile(stackIds: StackId[]): StackId {
  const priority: StackId[] = ['ai-agent', 'java', 'go', 'rust', 'python', 'vue', 'react', 'node', 'markdown'];
  return priority.find((stackId) => stackIds.includes(stackId)) ?? stackIds[0];
}

function result(stackId: StackId, evidence: string[]): DetectedStack {
  return {
    stack: STACK_PROFILES[stackId],
    evidence
  };
}
