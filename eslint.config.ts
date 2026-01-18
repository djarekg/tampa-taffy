import js from '@eslint/js';
import ts from 'typescript-eslint';
import html from '@html-eslint/eslint-plugin';
import css from 'eslint-plugin-css';
import json from 'eslint-plugin-json';
import jsonc from 'eslint-plugin-jsonc';
import markdown from 'eslint-plugin-markdown';

export default [
  // JavaScript and TypeScript files
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    ...js.configs.recommended,
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    languageOptions: {
      parser: ts.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': ts.plugin,
    },
    rules: {
      ...ts.configs.recommended.rules,
    },
  },
  // HTML files
  {
    files: ['**/*.html'],
    plugins: {
      '@html-eslint': html,
    },
    languageOptions: {
      parser: html.parser,
    },
    rules: {
      ...html.configs.recommended.rules,
    },
  },
  // CSS files
  {
    files: ['**/*.css'],
    plugins: {
      css: css,
    },
    rules: {
      'css/no-invalid-properties': 'error',
      'css/no-duplicate-properties': 'error',
    },
  },
  // JSON files
  {
    files: ['**/*.json'],
    plugins: {
      json: json,
    },
    languageOptions: {
      parser: json.parser,
    },
    rules: {
      'json/no-duplicate-keys': 'error',
      'json/no-empty-keys': 'error',
    },
  },
  // JSONC files (JSON with comments)
  {
    files: ['**/*.jsonc'],
    plugins: {
      jsonc: jsonc,
    },
    languageOptions: {
      parser: jsonc.parser,
    },
    rules: {
      ...jsonc.configs.recommended.rules,
    },
  },
  // Markdown files
  {
    files: ['**/*.md'],
    plugins: {
      markdown: markdown,
    },
    processor: 'markdown/markdown',
  },
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
    },
  },
];
