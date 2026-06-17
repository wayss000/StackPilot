import * as vscode from 'vscode';

export type StackId = 'java' | 'go' | 'python' | 'vue' | 'react' | 'node' | 'rust' | 'ai-agent';

export interface RecommendedExtension {
  id: string;
  name: string;
  reason: string;
}

export interface StackProfile {
  id: StackId;
  label: string;
  profileName: string;
  templateFile: string;
  description: string;
  extensions: RecommendedExtension[];
}

export interface DetectionResult {
  stack: StackProfile;
  workspaceFolder: vscode.WorkspaceFolder;
  evidence: string[];
}
