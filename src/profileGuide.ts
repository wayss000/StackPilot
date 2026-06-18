import * as vscode from 'vscode';
import { DetectionResult, StackProfile } from './types';

const PROFILES_URL = 'https://github.com/wayss000/StackPilot/tree/main/profiles';
const PROFILE_FILE_URL = 'https://github.com/wayss000/StackPilot/blob/main/profiles';

export class ProfileGuide {
  constructor(private readonly context: vscode.ExtensionContext) {}

  async openTemplate(profile: StackProfile): Promise<void> {
    const remoteBaseUrl = vscode.workspace.getConfiguration('stackpilot').get<string>('templateBaseUrl', PROFILE_FILE_URL).trim();

    if (remoteBaseUrl) {
      const url = `${remoteBaseUrl.replace(/\/$/, '')}/${profile.templateFile}`;
      await vscode.env.openExternal(vscode.Uri.parse(url));
      return;
    }
  }

  async showDetails(result: DetectionResult): Promise<void> {
    const panel = vscode.window.createWebviewPanel(
      'stackpilotGuide',
      'StackPilot Profile Guide',
      vscode.ViewColumn.One,
      {
        enableScripts: true
      }
    );

    panel.webview.html = this.renderGuide(panel.webview, result);
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

  private renderGuide(webview: vscode.Webview, result: DetectionResult): string {
    const nonce = createNonce();
    const defaultLanguage = vscode.env.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
    const ideName = getIdeName();
    const data = {
      defaultLanguage,
      ideName,
      profile: result.recommendedProfile,
      detectedStacks: result.detectedStacks.map((item) => ({
        label: item.stack.label,
        evidence: item.evidence
      })),
      profileUrl: `${PROFILE_FILE_URL}/${result.recommendedProfile.templateFile}`,
      profilesUrl: PROFILES_URL,
      messages: {
        en: {
          title: `Recommended ${ideName ? `${ideName} ` : ''}Profile`,
          intro: 'StackPilot detected this project and recommends a lightweight profile to keep your editor focused.',
          detected: 'Detected technologies',
          evidence: 'Detection evidence',
          recommendation: 'Recommended profile',
          extensions: 'Recommended extensions',
          templates: 'Profile templates',
          templatesIntro: 'Profile templates are hosted on GitHub so you can review, download, and customize them manually.',
          openAllTemplates: 'View all templates',
          openRecommendedTemplate: 'View recommended template',
          howToUse: 'How to use',
          customNote: 'If your project combines multiple stacks and no combined template is available, start from the recommended template and customize it for your workflow.',
          safety: 'Safety',
          safetyText: 'StackPilot does not install extensions, remove extensions, or switch profiles automatically. You review and apply everything manually.',
          steps: [
            'Open the GitHub profiles directory.',
            'Download the recommended .code-profile file.',
            'In your editor, run Profiles: Import Profile... from the Command Palette.',
            'Select the downloaded file.',
            'Review the settings and extensions, then create the profile.'
          ]
        },
        'zh-CN': {
          title: `推荐的${ideName ? ` ${ideName}` : ''} Profile`,
          intro: 'StackPilot 检测到了当前项目，并推荐一个轻量 Profile，帮助你保持编辑器聚焦。',
          detected: '检测到的技术栈',
          evidence: '检测依据',
          recommendation: '推荐 Profile',
          extensions: '推荐插件',
          templates: 'Profile 模板',
          templatesIntro: 'Profile 模板托管在 GitHub，方便你手动查看、下载和自定义。',
          openAllTemplates: '查看全部模板',
          openRecommendedTemplate: '查看推荐模板',
          howToUse: '如何使用',
          customNote: '如果你的项目组合了多个技术栈，但暂时没有对应的组合模板，可以从推荐模板开始并按自己的工作流自定义。',
          safety: '说明',
          safetyText: 'StackPilot 不会自动安装插件、卸载插件或切换 Profile。所有内容都由你手动检查并应用。',
          steps: [
            '打开 GitHub profiles 目录。',
            '下载推荐的 .code-profile 文件。',
            '在编辑器命令面板中运行 Profiles: Import Profile...。',
            '选择下载的文件。',
            '检查设置和插件列表，然后创建 Profile。'
          ]
        }
      }
    };

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>StackPilot Profile Guide</title>
  <style>
    body { color: var(--vscode-foreground); background: var(--vscode-editor-background); font-family: var(--vscode-font-family); margin: 0; }
    main { max-width: 920px; margin: 0 auto; padding: 32px 28px 48px; }
    header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 28px; }
    h1 { font-size: 28px; line-height: 1.25; margin: 0 0 10px; }
    h2 { border-bottom: 1px solid var(--vscode-panel-border); font-size: 18px; margin: 28px 0 14px; padding-bottom: 8px; }
    p { line-height: 1.6; }
    a { color: var(--vscode-textLink-foreground); }
    .language-switch { display: flex; gap: 8px; flex-shrink: 0; }
    button { background: var(--vscode-button-secondaryBackground); border: 0; border-radius: 4px; color: var(--vscode-button-secondaryForeground); cursor: pointer; padding: 6px 10px; }
    button.active { background: var(--vscode-button-background); color: var(--vscode-button-foreground); }
    .card { background: var(--vscode-editorWidget-background); border: 1px solid var(--vscode-panel-border); border-radius: 8px; margin: 12px 0; padding: 16px; }
    .profile-name { font-size: 20px; font-weight: 700; margin-bottom: 6px; }
    .muted { color: var(--vscode-descriptionForeground); }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; }
    ul, ol { padding-left: 22px; }
    li { margin: 6px 0; }
    .links { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 12px; }
    .button-link { background: var(--vscode-button-background); border-radius: 4px; color: var(--vscode-button-foreground); padding: 8px 12px; text-decoration: none; }
    code { background: var(--vscode-textCodeBlock-background); border-radius: 3px; padding: 2px 4px; }
  </style>
</head>
<body>
  <main>
    <header>
      <div>
        <h1 id="title"></h1>
        <p id="intro" class="muted"></p>
      </div>
      <div class="language-switch" aria-label="Language">
        <button type="button" data-language="en">English</button>
        <button type="button" data-language="zh-CN">简体中文</button>
      </div>
    </header>

    <section>
      <h2 id="detected-heading"></h2>
      <div id="detected-stacks" class="grid"></div>
    </section>

    <section>
      <h2 id="recommendation-heading"></h2>
      <div class="card">
        <div class="profile-name">${escapeHtml(result.recommendedProfile.profileName)}</div>
        <div class="muted">${escapeHtml(result.recommendedProfile.description)}</div>
      </div>
    </section>

    <section>
      <h2 id="extensions-heading"></h2>
      <div class="card">
        <ul id="extensions-list"></ul>
      </div>
    </section>

    <section>
      <h2 id="templates-heading"></h2>
      <p id="templates-intro"></p>
      <div class="links">
        <a id="recommended-template-link" class="button-link" href="${escapeAttribute(`${PROFILE_FILE_URL}/${result.recommendedProfile.templateFile}`)}"></a>
        <a id="all-templates-link" class="button-link" href="${escapeAttribute(PROFILES_URL)}"></a>
      </div>
    </section>

    <section>
      <h2 id="how-to-use-heading"></h2>
      <ol id="steps-list"></ol>
      <p id="custom-note" class="muted"></p>
    </section>

    <section>
      <h2 id="safety-heading"></h2>
      <p id="safety-text"></p>
    </section>
  </main>

  <script nonce="${nonce}">
    const data = ${JSON.stringify(data).replace(/</g, '\\u003c')};
    let language = data.defaultLanguage;

    function render() {
      const messages = data.messages[language] || data.messages.en;
      document.documentElement.lang = language;
      document.getElementById('title').textContent = messages.title;
      document.getElementById('intro').textContent = messages.intro;
      document.getElementById('detected-heading').textContent = messages.detected;
      document.getElementById('recommendation-heading').textContent = messages.recommendation;
      document.getElementById('extensions-heading').textContent = messages.extensions;
      document.getElementById('templates-heading').textContent = messages.templates;
      document.getElementById('templates-intro').textContent = messages.templatesIntro;
      document.getElementById('recommended-template-link').textContent = messages.openRecommendedTemplate;
      document.getElementById('all-templates-link').textContent = messages.openAllTemplates;
      document.getElementById('how-to-use-heading').textContent = messages.howToUse;
      document.getElementById('custom-note').textContent = messages.customNote;
      document.getElementById('safety-heading').textContent = messages.safety;
      document.getElementById('safety-text').textContent = messages.safetyText;

      document.querySelectorAll('[data-language]').forEach((button) => {
        button.classList.toggle('active', button.dataset.language === language);
      });

      const stacks = document.getElementById('detected-stacks');
      stacks.textContent = '';
      data.detectedStacks.forEach((stack) => {
        const card = document.createElement('div');
        card.className = 'card';
        const title = document.createElement('strong');
        title.textContent = stack.label;
        const evidenceTitle = document.createElement('p');
        evidenceTitle.className = 'muted';
        evidenceTitle.textContent = messages.evidence;
        const list = document.createElement('ul');
        stack.evidence.forEach((item) => {
          const li = document.createElement('li');
          li.textContent = item;
          list.appendChild(li);
        });
        card.append(title, evidenceTitle, list);
        stacks.appendChild(card);
      });

      const extensions = document.getElementById('extensions-list');
      extensions.textContent = '';
      data.profile.extensions.forEach((extension) => {
        const li = document.createElement('li');
        li.textContent = extension.name + ' (' + extension.id + '): ' + extension.reason;
        extensions.appendChild(li);
      });

      const steps = document.getElementById('steps-list');
      steps.textContent = '';
      messages.steps.forEach((step) => {
        const li = document.createElement('li');
        li.textContent = step;
        steps.appendChild(li);
      });
    }

    document.querySelectorAll('[data-language]').forEach((button) => {
      button.addEventListener('click', () => {
        language = button.dataset.language;
        render();
      });
    });

    render();
  </script>
</body>
</html>`;
  }
}

function getIdeName(): string {
  const appName = vscode.env.appName;
  if (/cursor/i.test(appName)) {
    return 'Cursor';
  }
  if (/trae/i.test(appName)) {
    return 'Trae';
  }
  if (/visual studio code/i.test(appName)) {
    return 'VS Code';
  }

  return '';
}

function createNonce(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let nonce = '';
  for (let i = 0; i < 32; i++) {
    nonce += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return nonce;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttribute(value: string): string {
  return escapeHtml(value);
}
