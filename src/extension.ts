import * as vscode from 'vscode';
import { STACK_PROFILES } from './catalog';
import { detectWorkspaceStack } from './detectors';
import { ProfileGuide } from './profileGuide';
import { StackPilotStorage } from './storage';
import { DetectionResult } from './types';

export function activate(context: vscode.ExtensionContext): void {
  const storage = new StackPilotStorage(context.globalState);
  const guide = new ProfileGuide(context);
  let lastDetection: DetectionResult | undefined;

  context.subscriptions.push(
    vscode.commands.registerCommand('stackpilot.detectProject', async () => {
      lastDetection = await detectAndNotify(storage, guide, true);
    }),
    vscode.commands.registerCommand('stackpilot.showRecommendation', async () => {
      const result = lastDetection ?? await detectWorkspaceStack();
      if (!result) {
        void vscode.window.showInformationMessage('StackPilot did not detect a supported project stack in this workspace.');
        return;
      }

      lastDetection = result;
      await guide.showDetails(result);
    }),
    vscode.commands.registerCommand('stackpilot.openProfileTemplate', async () => {
      const result = lastDetection ?? await detectWorkspaceStack();
      if (result) {
        lastDetection = result;
        await guide.openTemplate(result.recommendedProfile);
        return;
      }

      const selected = await vscode.window.showQuickPick(
        Object.values(STACK_PROFILES).map((profile) => ({
          label: profile.profileName,
          description: profile.description,
          profile
        })),
        { placeHolder: 'Select a StackPilot profile template' }
      );

      if (selected) {
        await guide.openTemplate(selected.profile);
      }
    }),
    vscode.commands.registerCommand('stackpilot.resetIgnoredProjects', async () => {
      await storage.resetIgnoredProjects();
      void vscode.window.showInformationMessage('StackPilot ignored projects and stacks have been reset.');
    })
  );

  if (vscode.workspace.getConfiguration('stackpilot').get<boolean>('autoDetectOnStartup', true)) {
    setTimeout(() => {
      void detectAndNotify(storage, guide, false).then((result) => {
        lastDetection = result;
      });
    }, 1200);
  }
}

export function deactivate(): void {}

async function detectAndNotify(
  storage: StackPilotStorage,
  guide: ProfileGuide,
  explicit: boolean
): Promise<DetectionResult | undefined> {
  const result = await detectWorkspaceStack();

  if (!result) {
    if (explicit) {
      void vscode.window.showInformationMessage('StackPilot did not detect a supported project stack in this workspace.');
    }
    return undefined;
  }

  if (!explicit && storage.isIgnored(result)) {
    return result;
  }

  await storage.rememberRecommendation(result);

  const action = await vscode.window.showInformationMessage(
    'StackPilot detected this project. View recommended profile?',
    'View Guide',
    'Later',
    'Ignore'
  );

  if (action === 'View Guide') {
    await guide.showDetails(result);
  }

  if (action === 'Ignore') {
    await storage.ignoreProject(result);
  }

  return result;
}
