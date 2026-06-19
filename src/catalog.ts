import { StackId, StackProfile } from './types';

export const STACK_PROFILES: Record<StackId, StackProfile> = {
  java: {
    id: 'java',
    label: 'Java',
    profileName: 'StackPilot Java',
    templateFile: 'java.code-profile',
    description: 'Java and Spring Boot development.',
    extensions: [
      { id: 'vscjava.vscode-java-pack', name: 'Extension Pack for Java', reason: 'Core Java language support, debugger, test runner, Maven, and project management.' },
      { id: 'vmware.vscode-spring-boot', name: 'Spring Boot Tools', reason: 'Spring-aware navigation plus better application.properties and application.yml support.' },
      { id: 'redhat.vscode-xml', name: 'XML', reason: 'Richer pom.xml, XML, XSD, and namespace-aware editing.' }
    ]
  },
  go: {
    id: 'go',
    label: 'Go',
    profileName: 'StackPilot Go',
    templateFile: 'go.code-profile',
    description: 'Go module development.',
    extensions: [
      { id: 'golang.go', name: 'Go', reason: 'Official Go extension with language server, testing, debugging, and Go tool integration.' }
    ]
  },
  python: {
    id: 'python',
    label: 'Python',
    profileName: 'StackPilot Python',
    templateFile: 'python.code-profile',
    description: 'Python application and scripting development.',
    extensions: [
      { id: 'ms-python.python', name: 'Python', reason: 'Official Python extension with environments, testing, and core editor integration.' },
      { id: 'ms-python.vscode-pylance', name: 'Pylance', reason: 'Fast IntelliSense and type analysis.' },
      { id: 'ms-python.debugpy', name: 'Python Debugger', reason: 'Dedicated Python debugging support from the Python tooling team.' },
      { id: 'charliermarsh.ruff', name: 'Ruff', reason: 'Fast linting, formatting, and import organization for modern Python projects.' }
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
      { id: 'christian-kohler.npm-intellisense', name: 'npm Intellisense', reason: 'Autocomplete package imports and dependency names in React projects.' }
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
      { id: 'redhat.vscode-yaml', name: 'YAML', reason: 'Useful for workflow files, model configs, and tool manifests.' },
      { id: 'humao.rest-client', name: 'REST Client', reason: 'Test model, tool, and service endpoints.' },
      { id: 'yzhang.markdown-all-in-one', name: 'Markdown All in One', reason: 'Better editing for prompts, specs, and agent documentation.' }
    ]
  }
};

export const ALL_STACKS = Object.values(STACK_PROFILES);
