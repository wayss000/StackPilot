import { StackId, StackProfile } from './types';

export const STACK_PROFILES: Record<StackId, StackProfile> = {
  java: {
    id: 'java',
    label: 'Java',
    profileName: 'StackPilot Java',
    templateFile: 'java.code-profile',
    description: 'Java and Spring Boot development.',
    extensions: [
      { id: 'vscjava.vscode-java-pack', name: 'Extension Pack for Java', reason: 'Language support, build tools, test runner, and debugger.' },
      { id: 'vmware.vscode-spring-boot', name: 'Spring Boot Extension Pack', reason: 'Spring Boot navigation, app properties, and dashboard support.' },
      { id: 'redhat.vscode-xml', name: 'XML', reason: 'Better pom.xml and XML editing.' }
    ]
  },
  go: {
    id: 'go',
    label: 'Go',
    profileName: 'StackPilot Go',
    templateFile: 'go.code-profile',
    description: 'Go module development.',
    extensions: [
      { id: 'golang.go', name: 'Go', reason: 'Official Go language support.' },
      { id: 'streetsidesoftware.code-spell-checker', name: 'Code Spell Checker', reason: 'Useful lightweight checks for docs and identifiers.' }
    ]
  },
  python: {
    id: 'python',
    label: 'Python',
    profileName: 'StackPilot Python',
    templateFile: 'python.code-profile',
    description: 'Python application and scripting development.',
    extensions: [
      { id: 'ms-python.python', name: 'Python', reason: 'Official Python language support.' },
      { id: 'ms-python.vscode-pylance', name: 'Pylance', reason: 'Fast IntelliSense and type analysis.' },
      { id: 'charliermarsh.ruff', name: 'Ruff', reason: 'Fast linting and formatting.' },
      { id: 'tamasfe.even-better-toml', name: 'Even Better TOML', reason: 'Better pyproject.toml editing.' }
    ]
  },
  vue: {
    id: 'vue',
    label: 'Vue',
    profileName: 'StackPilot Vue',
    templateFile: 'vue.code-profile',
    description: 'Vue and Nuxt frontend development.',
    extensions: [
      { id: 'Vue.volar', name: 'Vue - Official', reason: 'Official Vue language tooling.' },
      { id: 'dbaeumer.vscode-eslint', name: 'ESLint', reason: 'JavaScript and TypeScript linting.' },
      { id: 'esbenp.prettier-vscode', name: 'Prettier', reason: 'Consistent formatting.' }
    ]
  },
  react: {
    id: 'react',
    label: 'React',
    profileName: 'StackPilot React',
    templateFile: 'react.code-profile',
    description: 'React and Next.js frontend development.',
    extensions: [
      { id: 'dbaeumer.vscode-eslint', name: 'ESLint', reason: 'JavaScript and TypeScript linting.' },
      { id: 'esbenp.prettier-vscode', name: 'Prettier', reason: 'Consistent formatting.' },
      { id: 'dsznajder.es7-react-js-snippets', name: 'ES7+ React/Redux/React-Native snippets', reason: 'Common React snippets.' }
    ]
  },
  node: {
    id: 'node',
    label: 'Node.js',
    profileName: 'StackPilot Node',
    templateFile: 'node.code-profile',
    description: 'General Node.js backend and tooling projects.',
    extensions: [
      { id: 'dbaeumer.vscode-eslint', name: 'ESLint', reason: 'JavaScript and TypeScript linting.' },
      { id: 'esbenp.prettier-vscode', name: 'Prettier', reason: 'Consistent formatting.' },
      { id: 'humao.rest-client', name: 'REST Client', reason: 'Quick API checks from .http files.' },
      { id: 'christian-kohler.npm-intellisense', name: 'npm Intellisense', reason: 'Autocomplete npm imports.' }
    ]
  },
  rust: {
    id: 'rust',
    label: 'Rust',
    profileName: 'StackPilot Rust',
    templateFile: 'rust.code-profile',
    description: 'Rust and Cargo development.',
    extensions: [
      { id: 'rust-lang.rust-analyzer', name: 'rust-analyzer', reason: 'Official Rust language server.' },
      { id: 'tamasfe.even-better-toml', name: 'Even Better TOML', reason: 'Better Cargo.toml editing.' },
      { id: 'vadimcn.vscode-lldb', name: 'CodeLLDB', reason: 'Rust debugging support.' }
    ]
  },
  'ai-agent': {
    id: 'ai-agent',
    label: 'AI Agent',
    profileName: 'StackPilot AI Agent',
    templateFile: 'ai-agent.code-profile',
    description: 'MCP, agent, prompt, and AI application projects.',
    extensions: [
      { id: 'ms-python.python', name: 'Python', reason: 'Common agent runtime support.' },
      { id: 'dbaeumer.vscode-eslint', name: 'ESLint', reason: 'Useful for TypeScript agent projects.' },
      { id: 'humao.rest-client', name: 'REST Client', reason: 'Test model, tool, and service endpoints.' },
      { id: 'bierner.markdown-mermaid', name: 'Markdown Preview Mermaid Support', reason: 'Document agent workflows and tool graphs.' }
    ]
  }
};

export const ALL_STACKS = Object.values(STACK_PROFILES);
