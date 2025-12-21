import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";
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
      ...prettier.rules,
      "no-console": "off",
      "strict": ["error", "global"]
    }
  }
  
];

