export type LanguageCode = 'en' | 'zh-CN' | 'ja' | 'ko' | 'pt-BR' | 'es' | 'de';

export interface GuideMessages {
  title: string;
  intro: string;
  detected: string;
  evidence: string;
  recommendation: string;
  extensions: string;
  templates: string;
  templatesIntro: string;
  openAllTemplates: string;
  openRecommendedTemplate: string;
  howToUse: string;
  customNote: string;
  safety: string;
  safetyText: string;
  officialGithubLabel: string;
  openOfficialGithub: string;
  languageLabel: string;
  steps: string[];
}

export interface LanguageOption {
  code: LanguageCode;
  label: string;
}

export const FALLBACK_LANGUAGE: LanguageCode = 'en';
const OFFICIAL_GITHUB_URL = 'https://github.com/wayss000/StackPilot';

export const GUIDE_LANGUAGES: readonly LanguageOption[] = [
  { code: 'en', label: 'English' },
  { code: 'zh-CN', label: '简体中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'pt-BR', label: 'Português (Brasil)' },
  { code: 'es', label: 'Español' },
  { code: 'de', label: 'Deutsch' }
];

export function resolveGuideLanguage(locale: string | undefined): LanguageCode {
  const normalized = locale?.toLowerCase() ?? '';
  if (normalized.startsWith('zh')) {
    return 'zh-CN';
  }
  if (normalized.startsWith('ja')) {
    return 'ja';
  }
  if (normalized.startsWith('ko')) {
    return 'ko';
  }
  if (normalized.startsWith('pt')) {
    return 'pt-BR';
  }
  if (normalized.startsWith('es')) {
    return 'es';
  }
  if (normalized.startsWith('de')) {
    return 'de';
  }

  return FALLBACK_LANGUAGE;
}

export function buildGuideMessages(ideName: string): Record<LanguageCode, GuideMessages> {
  return {
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
      officialGithubLabel: 'Official GitHub',
      openOfficialGithub: 'Open official GitHub repository',
      languageLabel: 'Language',
      steps: [
        'Open the GitHub profiles directory.',
        'Download the recommended .code-profile file.',
        'In your editor, run Profiles: Import Profile... from the Command Palette.',
        'Select the file you just downloaded.',
        'Install and configure the recommended extensions. Some editors may install them automatically after importing the profile.',
        'If you have your own preferences, you can customize the profile settings further.',
        'Enjoy it. The next time you open this project, your editor can switch to this profile more easily.'
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
      officialGithubLabel: 'GitHub 官方地址',
      openOfficialGithub: '打开 GitHub 官方仓库',
      languageLabel: '语言',
      steps: [
        '打开 GitHub profiles 目录。',
        '下载推荐的 .code-profile 文件。',
        '在编辑器命令面板中运行 Profiles: Import Profile...。',
        '选择刚才下载的文件。',
        '按照推荐插件进行下载和配置。有些 IDE 在导入 Profile 后会自动安装这些插件。',
        '如果你有自己的偏好，也可以继续自定义这个 Profile 的设置。',
        '开始使用吧。下次再进入这个项目时，你的编辑器会更容易切换到这个 Profile。'
      ]
    },
    ja: {
      title: `${ideName ? `${ideName} ` : ''}おすすめプロフィール`,
      intro: 'StackPilot がこのプロジェクトを検出し、エディタをより集中しやすくするための軽量プロフィールをおすすめします。',
      detected: '検出された技術スタック',
      evidence: '検出根拠',
      recommendation: 'おすすめプロフィール',
      extensions: 'おすすめ拡張機能',
      templates: 'プロフィールテンプレート',
      templatesIntro: 'プロフィールテンプレートは GitHub で公開されているため、手動で確認、ダウンロード、カスタマイズできます。',
      openAllTemplates: 'すべてのテンプレートを見る',
      openRecommendedTemplate: 'おすすめテンプレートを見る',
      howToUse: '使い方',
      customNote: 'プロジェクトが複数の技術スタックを含み、対応する複合テンプレートがまだない場合は、おすすめテンプレートを出発点にして自分のワークフローに合わせて調整してください。',
      safety: '補足',
      safetyText: 'StackPilot は拡張機能のインストールや削除、プロフィールの切り替えを自動では行いません。内容を確認して手動で適用してください。',
      officialGithubLabel: '公式 GitHub',
      openOfficialGithub: '公式 GitHub リポジトリを開く',
      languageLabel: '言語',
      steps: [
        'GitHub の profiles ディレクトリを開きます。',
        'おすすめの .code-profile ファイルをダウンロードします。',
        'エディタのコマンドパレットで Profiles: Import Profile... を実行します。',
        '先ほどダウンロードしたファイルを選択します。',
        'おすすめされた拡張機能をインストールして設定します。IDE によっては、Profile のインポート後に自動で拡張機能がインストールされる場合があります。',
        '自分の好みがあれば、この Profile の設定をさらにカスタマイズできます。',
        'ぜひ使ってみてください。次回このプロジェクトを開くときは、この Profile により切り替えやすくなります。'
      ]
    },
    ko: {
      title: `${ideName ? `${ideName} ` : ''}추천 프로필`,
      intro: 'StackPilot이 이 프로젝트를 감지하고, 에디터를 더 집중해서 사용할 수 있도록 가벼운 프로필을 추천합니다.',
      detected: '감지된 기술 스택',
      evidence: '감지 근거',
      recommendation: '추천 프로필',
      extensions: '추천 확장 프로그램',
      templates: '프로필 템플릿',
      templatesIntro: '프로필 템플릿은 GitHub에 있으므로 직접 확인하고, 다운로드하고, 원하는 대로 수정할 수 있습니다.',
      openAllTemplates: '모든 템플릿 보기',
      openRecommendedTemplate: '추천 템플릿 보기',
      howToUse: '사용 방법',
      customNote: '프로젝트가 여러 기술 스택을 함께 사용하지만 아직 해당 조합 템플릿이 없다면, 추천 템플릿을 시작점으로 삼아 자신의 워크플로에 맞게 조정하세요.',
      safety: '안내',
      safetyText: 'StackPilot은 확장 프로그램 설치, 제거 또는 프로필 전환을 자동으로 수행하지 않습니다. 모든 내용은 직접 검토하고 적용해야 합니다.',
      officialGithubLabel: '공식 GitHub 주소',
      openOfficialGithub: '공식 GitHub 저장소 열기',
      languageLabel: '언어',
      steps: [
        'GitHub의 profiles 디렉터리를 엽니다.',
        '추천된 .code-profile 파일을 다운로드합니다.',
        '에디터 명령 팔레트에서 Profiles: Import Profile... 을 실행합니다.',
        '방금 다운로드한 파일을 선택합니다.',
        '추천 확장 프로그램을 설치하고 설정합니다. 일부 IDE는 Profile을 가져온 뒤 자동으로 확장 프로그램을 설치할 수 있습니다.',
        '원하는 설정이 있다면 이 Profile을 추가로 사용자화할 수 있습니다.',
        '이제 사용해 보세요. 다음에 이 프로젝트를 열 때는 이 Profile로 더 쉽게 전환할 수 있습니다.'
      ]
    },
    'pt-BR': {
      title: `Perfil recomendado do ${ideName ? `${ideName} ` : ''}`.trim(),
      intro: 'O StackPilot detectou este projeto e recomenda um perfil leve para manter seu editor mais focado.',
      detected: 'Tecnologias detectadas',
      evidence: 'Evidências da detecção',
      recommendation: 'Perfil recomendado',
      extensions: 'Extensões recomendadas',
      templates: 'Templates de perfil',
      templatesIntro: 'Os templates de perfil ficam no GitHub para que você possa revisar, baixar e personalizar manualmente.',
      openAllTemplates: 'Ver todos os templates',
      openRecommendedTemplate: 'Ver o template recomendado',
      howToUse: 'Como usar',
      customNote: 'Se o seu projeto combina várias stacks e ainda não existe um template combinado, comece pelo template recomendado e personalize-o para o seu fluxo de trabalho.',
      safety: 'Observação',
      safetyText: 'O StackPilot não instala extensões, remove extensões nem troca perfis automaticamente. Você revisa e aplica tudo manualmente.',
      officialGithubLabel: 'GitHub oficial',
      openOfficialGithub: 'Abrir repositório oficial no GitHub',
      languageLabel: 'Idioma',
      steps: [
        'Abra o diretório profiles no GitHub.',
        'Baixe o arquivo .code-profile recomendado.',
        'No editor, execute Profiles: Import Profile... pela Command Palette.',
        'Selecione o arquivo que você acabou de baixar.',
        'Instale e configure as extensões recomendadas. Alguns editores podem instalá-las automaticamente após importar o perfil.',
        'Se você tiver preferências próprias, também pode personalizar ainda mais as configurações desse perfil.',
        'Aproveite. Na próxima vez que você abrir este projeto, seu editor poderá alternar para esse perfil com mais facilidade.'
      ]
    },
    es: {
      title: `Perfil recomendado de ${ideName}`.trim(),
      intro: 'StackPilot detectó este proyecto y recomienda un perfil ligero para mantener tu editor más enfocado.',
      detected: 'Tecnologías detectadas',
      evidence: 'Evidencia de detección',
      recommendation: 'Perfil recomendado',
      extensions: 'Extensiones recomendadas',
      templates: 'Plantillas de perfil',
      templatesIntro: 'Las plantillas de perfil están alojadas en GitHub para que puedas revisarlas, descargarlas y personalizarlas manualmente.',
      openAllTemplates: 'Ver todas las plantillas',
      openRecommendedTemplate: 'Ver la plantilla recomendada',
      howToUse: 'Cómo usarlo',
      customNote: 'Si tu proyecto combina varias tecnologías y todavía no existe una plantilla combinada, empieza con la plantilla recomendada y ajústala a tu flujo de trabajo.',
      safety: 'Información',
      safetyText: 'StackPilot no instala extensiones, no elimina extensiones ni cambia perfiles automáticamente. Tú revisas y aplicas todo manualmente.',
      officialGithubLabel: 'GitHub oficial',
      openOfficialGithub: 'Abrir repositorio oficial en GitHub',
      languageLabel: 'Idioma',
      steps: [
        'Abre el directorio profiles en GitHub.',
        'Descarga el archivo .code-profile recomendado.',
        'En tu editor, ejecuta Profiles: Import Profile... desde la paleta de comandos.',
        'Selecciona el archivo que acabas de descargar.',
        'Instala y configura las extensiones recomendadas. Algunos IDE pueden instalarlas automáticamente después de importar el perfil.',
        'Si tienes tus propias preferencias, también puedes personalizar más la configuración de este perfil.',
        'Disfrútalo. La próxima vez que abras este proyecto, tu editor podrá cambiar a este perfil más fácilmente.'
      ]
    },
    de: {
      title: `Empfohlenes ${ideName ? `${ideName} ` : ''}Profil`,
      intro: 'StackPilot hat dieses Projekt erkannt und empfiehlt ein schlankes Profil, damit dein Editor fokussiert bleibt.',
      detected: 'Erkannte Technologien',
      evidence: 'Erkennungsgrundlage',
      recommendation: 'Empfohlenes Profil',
      extensions: 'Empfohlene Erweiterungen',
      templates: 'Profilvorlagen',
      templatesIntro: 'Die Profilvorlagen liegen auf GitHub, damit du sie manuell prüfen, herunterladen und anpassen kannst.',
      openAllTemplates: 'Alle Vorlagen ansehen',
      openRecommendedTemplate: 'Empfohlene Vorlage ansehen',
      howToUse: 'Verwendung',
      customNote: 'Wenn dein Projekt mehrere Technologien kombiniert und noch keine passende kombinierte Vorlage vorhanden ist, starte mit der empfohlenen Vorlage und passe sie an deinen Workflow an.',
      safety: 'Hinweis',
      safetyText: 'StackPilot installiert oder entfernt keine Erweiterungen und wechselt Profile nicht automatisch. Du prüfst und übernimmst alles manuell.',
      officialGithubLabel: 'Offizielles GitHub',
      openOfficialGithub: 'Offizielles GitHub-Repository öffnen',
      languageLabel: 'Sprache',
      steps: [
        'Öffne das GitHub-Verzeichnis profiles.',
        'Lade die empfohlene .code-profile-Datei herunter.',
        'Führe im Editor über die Befehlspalette Profiles: Import Profile... aus.',
        'Wähle die Datei aus, die du gerade heruntergeladen hast.',
        'Installiere und konfiguriere die empfohlenen Erweiterungen. Manche IDEs installieren sie nach dem Import des Profils automatisch.',
        'Wenn du eigene Vorlieben hast, kannst du die Einstellungen dieses Profils weiter anpassen.',
        'Viel Spaß damit. Wenn du dieses Projekt das nächste Mal öffnest, kann dein Editor leichter zu diesem Profil wechseln.'
      ]
    }
  };
}

export { OFFICIAL_GITHUB_URL };
