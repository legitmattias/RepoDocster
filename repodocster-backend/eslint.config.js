import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import globals from 'globals'

export default [
  {
    files: ['**/*.ts'],
    ignores: ['**/*.d.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      globals: {
        ...globals.node,      // Node.js globals (e.g., __dirname, process)
        ...globals.es2021     // ES2021 globals (e.g., Promise, Set)
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      'semi': ['error', 'never'],           // Enforce no semicolons
      'quotes': ['error', 'single'],        // Enforce single quotes
      '@typescript-eslint/no-unused-vars': ['error'], // No unused variables
      '@typescript-eslint/no-explicit-any': 'warn'    // Warn on 'any' types
    }
  }
]
