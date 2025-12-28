// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
	{
		ignores: ['node_modules/', 'dist/'],
	},

	// JavaScript рекомендации (объект)
	js.configs.recommended,

	// TypeScript рекомендации (массив)
	...tseslint.configs.recommended,

	// Настройки для TypeScript-файлов
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parserOptions: {
				project: true,
				tsconfigRootDir: import.meta.dirname,
			},
			globals: {
				...globals.node,
			},
		},
		rules: {
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/ban-types': 'off',
			'@typescript-eslint/explicit-function-return-type': 'warn',
		},
	},

	// Prettier в конце
	eslintConfigPrettier,
];
