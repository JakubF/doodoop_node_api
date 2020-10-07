module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 2018,
    project: './tsconfig.json',
    sourceType: 'module',
    tsconfigRootDir: './'
  },
  plugins: ['@typescript-eslint'],
  rules: {
    "comma-dangle": 0,
    "camelcase": "off",
    "@typescript-eslint/camelcase": ["error", { "properties": "always" }],
    "@typescript-eslint/class-name-casing": 1,
    "indent": "off",
    "@typescript-eslint/indent": ["error", 2],
    "@typescript-eslint/no-empty-interface": [
      "error",
      {
        "allowSingleExtends": false
      }
    ],
    "@typescript-eslint/no-extraneous-class": 2,
    "@typescript-eslint/no-misused-new": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error", {
      "vars": "all",
      "args": "after-used",
      "ignoreRestSiblings": true
    }],
    "no-use-before-define": ["error", { "functions": true, "classes": true }]
  }
}