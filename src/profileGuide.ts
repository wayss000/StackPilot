import * as vscode from 'vscode';
import { DetectionResult, StackProfile } from './types';

export class ProfileGuide {
  constructor(private readonly context: vscode.ExtensionContext) {}

  async openTemplate(profile: StackProfile): Promise<void> {
    const remoteBaseUrl = vscode.workspace.getConfiguration('stackpilot').get<string>('templateBaseUrl', '').trim();

    if (remoteBaseUrl) {
      const url = `${remoteBaseUrl.replace(/\/$/, '')}/${profile.templateFile}`;
      await vscode.env.openExternal(vscode.Uri.parse(url));
      return;
    }

    const templateUri = vscode.Uri.joinPath(this.context.extensionUri, 'profiles', profile.templateFile);
    await vscode.env.clipboard.writeText(templateUri.fsPath);
    const document = await vscode.workspace.openTextDocument(templateUri);
    await vscode.window.showTextDocument(document, { preview: true });
    void vscode.window.showInformationMessage(`Copied local template path for ${profile.profileName}. Use Profiles: Import Profile... to import it.`);
  }

  async showDetails(result: DetectionResult): Promise<void> {
    const profile = result.stack;
    const extensions = profile.extensions
      .map((extension) => `- ${extension.name} (${extension.id}): ${extension.reason}`)
      .join('\n');

    const body = [
      `# ${profile.profileName}`,
      '',
      profile.description,
      '',
      '## Detection Evidence',
      '',
      ...result.evidence.map((item) => `- ${item}`),
      '',
      '## Recommended Extensions',
      '',
      extensions,
      '',
      '## How to Use',
      '',
      '1. Run `Profiles: Import Profile...` from the Command Palette.',
      `2. Select the bundled template file: \`profiles/${profile.templateFile}\`.`,
      `3. Create or select \`${profile.profileName}\` for the current workspace.`,
      '',
      'StackPilot only recommends and guides. It does not install, uninstall, or silently switch extensions.'
    ].join('\n');

    const document = await vscode.workspace.openTextDocument({
      language: 'markdown',
      content: body
    });
    await vscode.window.showTextDocument(document, { preview: true });
  }

  async showManualSwitchReason(profile: StackProfile): Promise<void> {
    const message = [
      `VS Code does not expose a stable extension API for silently switching the current window to ${profile.profileName}.`,
      'Use the Profiles menu or Command Palette command "Profiles: Switch Profile" and select the recommended profile.'
    ].join(' ');

    const action = await vscode.window.showInformationMessage(message, 'Copy Profile Name', 'Open Template');

    if (action === 'Copy Profile Name') {
      await vscode.env.clipboard.writeText(profile.profileName);
    }

    if (action === 'Open Template') {
      await this.openTemplate(profile);
    }
  }
}
