import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import reactPlugin from 'eslint-plugin-react'

export default [
  {
    // General settings that apply to both frontend and backend
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      globals: {
        ...globals.es2021,               // ES2021 globals available everywhere
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      'semi': ['error', 'never'],        // Example rule applied everywhere
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error']
    }
  },
  {
    // Backend-specific rules
    files: ['backend/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,                 // Node.js globals for backend
      }
    },
    rules: {
      'no-console': 'off',               // Allow console logs in backend
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface']
    }
  },
  {
    // Frontend-specific rules (React)
    files: ['frontend/**/*.ts', 'frontend/**/*.tsx'],
    languageOptions: {
      globals: {
        ...globals.browser,              // Browser globals for frontend
      }
    },
    plugins: {
      'react': reactPlugin
    },
    rules: {
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface']
    }
  }
]
