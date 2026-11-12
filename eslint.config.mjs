/*
 * This repository's own lint: the design-system rules on the kit's source, with the kit-internal
 * allowances (the kit builds raw controls; its field insets use spacing steps 7 and 9), plus the
 * React hooks rules. Apps use the shareable config instead: aero-design-system/eslint.
 */
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import { designSystem } from './eslint/index.mjs';

export default [
  { ignores: ['dist/**', '.test-dist/**', '.design-system-dist/**', 'node_modules/**', 'design-system/**'] },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { parser: tseslint.parser, parserOptions: { ecmaFeatures: { jsx: true } } },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  ...designSystem({ files: ['src/**/*.{ts,tsx}'], kitFiles: ['src/components/**', 'src/lib/**'] }),
];
