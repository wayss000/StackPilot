import * as vscode from 'vscode';
import { DetectionResult, StackId } from './types';

const IGNORED_PROJECTS_KEY = 'ignoredProjects';
const IGNORED_STACKS_KEY = 'ignoredStacks';
const LAST_RECOMMENDATION_KEY = 'lastRecommendation';

export class StackPilotStorage {
  constructor(private readonly state: vscode.Memento) {}

  isIgnored(result: DetectionResult): boolean {
    return this.getIgnoredProjects().includes(this.workspaceKey(result)) || this.getIgnoredStacks().includes(result.recommendedProfile.id);
  }

  async ignoreProject(result: DetectionResult): Promise<void> {
    const ignored = new Set(this.getIgnoredProjects());
    ignored.add(this.workspaceKey(result));
    await this.state.update(IGNORED_PROJECTS_KEY, [...ignored]);
  }

  async ignoreStack(stackId: StackId): Promise<void> {
    const ignored = new Set(this.getIgnoredStacks());
    ignored.add(stackId);
    await this.state.update(IGNORED_STACKS_KEY, [...ignored]);
  }

  async rememberRecommendation(result: DetectionResult): Promise<void> {
    await this.state.update(LAST_RECOMMENDATION_KEY, {
      stack: result.recommendedProfile.id,
      profileName: result.recommendedProfile.profileName,
      detectedStacks: result.detectedStacks.map((item) => item.stack.id),
      workspace: this.workspaceKey(result),
      timestamp: new Date().toISOString()
    });
  }

  async resetIgnoredProjects(): Promise<void> {
    await this.state.update(IGNORED_PROJECTS_KEY, []);
    await this.state.update(IGNORED_STACKS_KEY, []);
  }

  private getIgnoredProjects(): string[] {
    return this.state.get<string[]>(IGNORED_PROJECTS_KEY, []);
  }

  private getIgnoredStacks(): StackId[] {
    return this.state.get<StackId[]>(IGNORED_STACKS_KEY, []);
  }

  private workspaceKey(result: DetectionResult): string {
    return result.workspaceFolder.uri.toString();
  }
}
