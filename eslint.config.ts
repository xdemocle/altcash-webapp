import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import compat from 'eslint-plugin-compat';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
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
    'next/core-web-vitals',
    js.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.recommended,
    ...tseslint.configs.stylistic,
    compat.configs['flat/recommended'],
    'plugin:@next/next/recommended',
  ],
  files: ['**/*.{ts,tsx}'],
  languageOptions: {
    globals: globals.browser,
  },
  plugins: {
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
  },
  rules: {
    ...reactHooks['configs']['recommended-latest'].rules,
    ...reactRefresh.configs.vite.rules,
    ...eslintConfigPrettier.rules,

    // Note: you must disable the base rule as it can report incorrect errors
    'no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/prefer-ts-expect-error': 'error',
    'no-debugger': isDevelopment ? 'warn' : 'error',

    'no-empty-pattern': 'warn',
    'react-refresh/only-export-components': [
      'warn',
      {
        allowExportNames: [
          'action',
          'clientAction',
          'clientLoader',
          'ErrorBoundary',
          'handle',
          'headers',
          'HydrateFallback',
          'links',
          'loader',
          'meta',
          'middleware',
          'shouldRevalidate',
        ],
      },
    ],
  },
});
