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
    "unused-imports",
    "simple-import-sort",
  ],
  rules: {
    "object-shorthand": "error",
    "@typescript-eslint/restrict-template-expressions": [
      "error",
      { allowBoolean: true, allowNumber: true },
    ],
    "jsx-a11y/no-autofocus": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": "error",
    "simple-import-sort/exports": "error",
    "simple-import-sort/imports": [
      "error",
      {
        groups: [["^react", "^"], ["^@mui/"], ["^~/", "^app/"], ["^\\."]],
      },
    ],
  },
};
