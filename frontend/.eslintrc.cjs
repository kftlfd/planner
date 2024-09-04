module.exports = {
  root: true,
  env: { browser: true, node: true, es6: true },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    projectService: true,
    tsconfigRootDir: __dirname,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/strict-type-checked",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "prettier",
  ],
  plugins: [
    "@typescript-eslint",
    "react",
    "react-hooks",
    "jsx-a11y",
    "simple-import-sort",
  ],
  rules: {
    "simple-import-sort/imports": [
      "error",
      {
        groups: [["^"], ["^~/", "^app/"], ["^\\."]],
      },
    ],
    "simple-import-sort/exports": "error",
  },
};
