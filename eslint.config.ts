import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import eslintConfigPrettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const isDevelopment = process.env.NODE_ENV === 'development';

export default defineConfig({
  ignores: [
    'dist',
    'dist/**/*',
    '.wrangler',
    '.wrangler/**/*',
    'worker-configuration.d.ts',
    '.react-router',
    '.react-router/**/*',
    'build',
    'build/**/*',
    '**/*.json',
    '**/*.md',
    '**/*.test.ts',
    '*/test/**/*',
    '*/setupTests.ts',
    '*/__tests__/**/*',
  ],
  extends: [
    js.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.recommended,
    ...tseslint.configs.stylistic,
    nextPlugin.configs.recommended,
    nextPlugin.configs['core-web-vitals'],
  ],
  files: ['**/*.{ts,tsx}'],
  languageOptions: {
    globals: globals.browser,
  },
  rules: {
    ...nextPlugin.configs.recommended.rules,
    ...eslintConfigPrettier.rules,

    // Note: you must disable the base rule as it can report incorrect errors
    'no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/prefer-ts-expect-error': 'error',
    'no-debugger': isDevelopment ? 'warn' : 'error',

    'no-empty-pattern': 'warn',
  },
});
