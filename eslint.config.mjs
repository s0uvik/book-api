import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin"; // Note: Correct import for the TypeScript plugin

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // Disable core `no-unused-vars` rule
      "no-unused-vars": "off",

      // Use TypeScript-specific rule for unused variables
      "@typescript-eslint/no-unused-vars": [
        "warn", // Set to "warn" or "off" as per your preference
        {
          argsIgnorePattern: "^_", // Ignore function arguments starting with `_`
          varsIgnorePattern: "^_", // Ignore variables starting with `_`
        },
      ],
    },
  },
  pluginJs.configs.recommended,
  tseslint.configs.recommended, // Fix for correct TypeScript plugin usage
];
