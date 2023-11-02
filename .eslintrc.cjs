/**@type {import('eslint').Linter.BaseConfig} */
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'airbnb',
    'airbnb/hooks',
    'airbnb-typescript',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
  ignorePatterns: ['*.config.*', '*.setup.*', '.eslintrc.cjs'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-props-no-spreading': 'off',
    /**@type {import('prettier').Config} */
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
      },
    ],
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    'consistent-return': 'off',
    'react/jsx-no-bind': 'off',
    'react/no-unknown-property': [
      'error',
      { ignore: ['css', 'jsx', 'global'] },
    ],
    'jsx-a11y/label-has-associated-control': 'off',
  },
};
