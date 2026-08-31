import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["dist", "dist-ssr"] },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        __BUILD_VERSION__: "readonly",
        __BUILD_YEAR__: "readonly",
      },
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Each route exports the `metadata` object that describes its head, so
      // the description sits beside the markup it describes. It is data, and
      // Fast Refresh has nothing to do on it.
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true, allowExportNames: ["metadata"] },
      ],
      // Core no-unused-vars can't see identifiers referenced only in JSX
      // (no eslint-plugin-react installed), so exempt capitalized component
      // names and underscore-prefixed throwaways.
      "no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^[A-Z_]",
          argsIgnorePattern: "^[A-Z_]",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    // The build's own scripts run in Node, not in a browser.
    files: ["scripts/**/*.js"],
    languageOptions: { globals: globals.node },
  },
];
