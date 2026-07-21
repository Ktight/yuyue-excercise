import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**'],
  },

  // Base JavaScript recommended rules
  js.configs.recommended,

  // TypeScript strict rules
  ...tseslint.configs.strict,

  // Vue flat recommended rules
  ...pluginVue.configs['flat/recommended'],

  // Override for Vue files: use the TypeScript parser inside Vue SFC
  {
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    rules: {
      // The app uses single-word component names like <App />, <Login /> etc.
      'vue/multi-word-component-names': 'off',
    },
  },

  // Override for Node.js scripts: allow console, process, etc.
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
      },
    },
  },

  // Disable ESLint rules that conflict with Prettier (must be last)
  // eslint-config-prettier v10 exports { rules: {...} } for flat config
  eslintConfigPrettier,
);
