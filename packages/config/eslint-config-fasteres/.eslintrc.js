module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
      typescript: {
        project: '../../../tsconfig.json',
      },
    },
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-console': 'off',
    'import/extensions': 'off',
    'no-useless-constructor': 'off',
  },
};
