import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: [
      "node_modules/**",
      "public/**",
      "dist/**",
      "build/**"
    ]
  },
  {
    files: ["src/js/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.browser
      }
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-console": "off",
      "strict": ["error", "global"]
    }
  }
];

