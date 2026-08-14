import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig([
	{
		files: ["**/*.{js,mjs,cjs}"],
		plugins: {
			js: js,
		},
		extends: ["js/recommended", eslintConfigPrettier],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.jest,
			},
		},
		rules: {
			"no-unused-vars": "warn",
			"no-undef": "warn",
		},
	},
]);
