import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
	{
		files: ['**/*.ts'],
		ignores: ['dist/', 'build/', 'node_modules/'],

		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.node,
			},
			parser: tseslint.parser,
			parserOptions: {
				projectService: true,
			},
		},

		plugins: {
			'@typescript-eslint': tseslint.plugin,
			import: importPlugin,
		},

		extends: [
			js.configs.recommended, // strict JS rules
			...tseslint.configs.strictTypeChecked, // full strict TS
			...tseslint.configs.stylisticTypeChecked,
		],

		rules: {
			// ============================================
			//  Node Best Practices (strict)
			// ============================================
			'no-console': 'warn',
			'no-process-exit': 'error',
			'no-sync': 'error',
			'no-new-require': 'error',
			'no-path-concat': 'error',
			'callback-return': 'error',
			'handle-callback-err': 'error',

			// ============================================
			//  JavaScript Strict
			// ============================================
			'no-var': 'error',
			'prefer-const': 'error',
			'prefer-template': 'error',
			'prefer-arrow-callback': 'error',
			'require-await': 'error',
			'no-return-await': 'error',
			'no-implicit-coercion': 'error',
			'consistent-return': 'error',

			// ============================================
			//  TypeScript Strictness
			// ============================================
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/no-unsafe-assignment': 'error',
			'@typescript-eslint/no-unsafe-member-access': 'error',
			'@typescript-eslint/no-unsafe-call': 'error',
			'@typescript-eslint/no-unsafe-return': 'error',
			'@typescript-eslint/no-base-to-string': 'error',
			'@typescript-eslint/no-dynamic-delete': 'error',
			'@typescript-eslint/no-confusing-void-expression': 'error',
			'@typescript-eslint/no-floating-promises': 'error',
			'@typescript-eslint/no-implied-eval': 'error',
			'@typescript-eslint/no-misused-promises': 'error',
			'@typescript-eslint/no-unnecessary-condition': 'error',
			'@typescript-eslint/no-unnecessary-type-parameters': 'error',
			'@typescript-eslint/no-unnecessary-boolean-literal-compare':
				'error',
			'@typescript-eslint/no-shadow': 'error',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
			],
			'@typescript-eslint/consistent-type-assertions': [
				'error',
				{ assertionStyle: 'never' },
			],

			// ============================================
			//  Imports (strict hygiene)
			// ============================================
			'no-duplicate-imports': 'error',
			'import/order': [
				'error',
				{
					'newlines-between': 'always',
					groups: [
						'type',
						'builtin',
						'external',
						'internal',
						'parent',
						'sibling',
						'index',
						'object',
					],
				},
			],
		},
	},
]);
