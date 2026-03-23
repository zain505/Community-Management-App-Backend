module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint'],
  env: {
    node: true,
    jest: true,
    es2022: true,
  },
  ignorePatterns: [
    'dist/',
    'coverage/',
    'node_modules/',
    'src/generated/',
    'src/modules/auth/',
    'tests/unit/auth.schemas.test.ts',
  ],
  rules: {
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
  },
};
