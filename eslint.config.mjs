import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default [
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', 'coverage/**'],
  },

  {
    files: ['src/js/**/*.js', '!src/js/**/*.test.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        process: 'readonly',
        google: 'readonly',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...prettier.rules,
      strict: ['error', 'global'],
      'no-console': 'off',
    },
  },

  {
    files: ['src/js/**/*.test.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        ...globals.jest,
        ...globals.node,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...prettier.rules,
      strict: 'off',
    },
  },

  {
    files: ['server.js', 'commitlint.config.js'],
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
      strict: ['error', 'global'],
    },
  },

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

  {
    files: ['**/*.test.mjs'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },

  {
    files: ['src/js/auth.js', 'src/js/script.js'],
    rules: {
      strict: 'off',
    },
  },
];
