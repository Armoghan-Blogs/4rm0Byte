import globals from "globals";
import pluginJs from "@eslint/js";
import prettier from "eslint-plugin-prettier";
import tailwindcss from "eslint-plugin-tailwindcss";
import html from "eslint-plugin-html";
import markdown from "eslint-plugin-markdown";
import json from 'eslint-plugin-json';
import eslintPluginYml from 'eslint-plugin-yml';
import eslintPluginToml from 'eslint-plugin-toml';

/** @type {import('eslint').Linter.Config[]} */
export default [{
  ignores: [
    "**/node_modules/**",
    "**/.github/**",
    "**/.vscode/**",
    "**/.git/**",
    "**/.devcontainer/**",
    "**/.husky/**",
    "**/resources/**",
    "**/themes/**",
    "**/public/**",
    "**/static/**",
    "**/package.json",
    "**/package-lock.json",
    "**/.prettierrc.js",
    "**//layouts/_default/index.json"
  ],

  languageOptions: { globals: globals.browser },
  ...pluginJs.configs.recommended,

  plugins: {
    prettier,
    tailwindcss,
    html,
    markdown,
    json,
    yml: eslintPluginYml,
    toml: eslintPluginToml,
  },

  rules: {
    "prettier/prettier": "error",
    "tailwindcss/classnames-order": "warn",
    "tailwindcss/no-custom-classname": "off"
  },
}];
