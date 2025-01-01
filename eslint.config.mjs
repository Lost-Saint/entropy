import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import parser from "svelte-eslint-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:svelte/recommended",
), {
    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
        },

        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",

        parserOptions: {
            project: "./tsconfig.app.json",
            extraFileExtensions: [".svelte"],
        },
    },

    rules: {
        "no-console": "warn",
        eqeqeq: "error",
        curly: ["error", "all"],
        "no-debugger": "warn",
        "prefer-const": "error",
        "no-var": "error",
        "arrow-body-style": ["error", "as-needed"],
        "object-shorthand": ["error", "always"],
        "prefer-template": "error",
        "no-duplicate-imports": "error",
        camelcase: "error",
        "consistent-return": "error",
    },
}, {
    files: ["**/*.svelte"],

    languageOptions: {
        parser: parser,
        ecmaVersion: 5,
        sourceType: "script",

        parserOptions: {
            parser: "@typescript-eslint/parser",
            project: "./tsconfig.app.json",
        },
    },
}, {
    files: ["src/**/*.ts", "src/**/*.tsx"],

    languageOptions: {
        ecmaVersion: 5,
        sourceType: "script",

        parserOptions: {
            project: "./tsconfig.app.json",
        },
    },

    rules: {
        "@typescript-eslint/no-unused-vars": ["warn", {
            argsIgnorePattern: "^_",
        }],

        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/consistent-type-definitions": ["error", "type"],
        "@typescript-eslint/no-inferrable-types": "warn",
        "@typescript-eslint/no-non-null-assertion": "error",

        "no-console": ["warn", {
            allow: ["warn", "error"],
        }],
    },
}];
