import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default [
  /* ---------- Ignore generated & config ---------- */
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**'
    ],
  },

  /* ---------- Browser JS (App code) ---------- */
  {
    files: ['src/js/**/*.js', '!src/js/**/*.test.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...prettier.rules,
      strict: ['error', 'global'],
      'no-console': 'off',
    },
  },

  /* ---------- Jest Test Files ---------- */
  {
    files: ['src/js/**/*.test.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...prettier.rules,
      strict: 'off',
    },
  },

  /* ---------- Node (CommonJS) ---------- */
  {
    files: ['server.js', 'commitlint.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...prettier.rules,
      strict: ['error', 'global'],
    },
  },

  /* ---------- Node (ESM .mjs files) ---------- */
  {
    files: ['**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...prettier.rules,
    },
  },
];
