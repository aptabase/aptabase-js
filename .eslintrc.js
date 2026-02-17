module.exports = {
  root: true,
  extends: ['eslint:recommended', 'prettier'],
  env: {
    es2020: true,
    browser: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'no-undef': 'off',
  },
};
