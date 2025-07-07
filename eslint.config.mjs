import { globals, makeEslintConfig } from '@averay/codeformat';

export default [
  ...makeEslintConfig({ tsconfigPath: './tsconfig.json' }),
  {
    files: ['index.ts', 'lib/**/*.ts'],
    languageOptions: { globals: { ...globals.browser, ...globals.es2025 } },
    rules: {
      'unicorn/prefer-spread': 'off', // Need to support older NodeList instances
    },
  },
];
