import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import htmlPlugin from '@html-eslint/eslint-plugin';
import htmlParser from '@html-eslint/parser';
import jsonPlugin from 'eslint-plugin-json';
import jsoncPlugin from 'eslint-plugin-jsonc';
import jsoncParser from 'jsonc-eslint-parser';
import markdownPlugin from 'eslint-plugin-markdown';

export default [
  // Global ignores
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', 'package-lock.json'],
  },
  // JavaScript files
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    ...js.configs.recommended,
  },
  // TypeScript files
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
  })),
  // HTML files
  {
    files: ['**/*.html'],
    plugins: {
      '@html-eslint': htmlPlugin,
    },
    languageOptions: {
      parser: htmlParser,
    },
    rules: {
      '@html-eslint/require-doctype': 'error',
      '@html-eslint/no-duplicate-attrs': 'error',
      '@html-eslint/no-inline-styles': 'warn',
    },
  },
  // CSS files - Note: ESLint doesn't natively lint CSS files
  // For CSS linting, use stylelint instead: https://stylelint.io/
  // This placeholder is here to acknowledge the requirement but CSS linting
  // should be handled by a dedicated CSS linter like stylelint
  {
    files: ['**/*.css'],
    // Placeholder - use stylelint for CSS linting
  },
  // JSON files
  {
    files: ['**/*.json'],
    plugins: {
      json: jsonPlugin,
    },
    processor: 'json/json',
  },
  // JSONC files (JSON with comments)
  {
    files: ['**/*.jsonc', 'tsconfig.json'],
    plugins: {
      jsonc: jsoncPlugin,
    },
    languageOptions: {
      parser: jsoncParser,
    },
    rules: {
      'jsonc/no-comments': 'off',
      'jsonc/comma-dangle': ['error', 'never'],
    },
  },
  // Markdown files
  {
    files: ['**/*.md'],
    plugins: {
      markdown: markdownPlugin,
    },
    processor: 'markdown/markdown',
  },
  // JavaScript code blocks in Markdown
  {
    files: ['**/*.md/*.js', '**/*.md/*.javascript'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-console': 'off',
      'no-unused-vars': 'off',
    },
  },
];
