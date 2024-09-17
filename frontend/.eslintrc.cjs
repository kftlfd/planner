module.exports = {
  root: true,
  env: { browser: true },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    projectService: true,
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ["node_modules", "dist"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/strict-type-checked",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["unused-imports", "simple-import-sort"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "prettier/prettier": "warn",
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
      { groups: [["^react", "^"], ["^@mui/"], ["^~/", "^app/"], ["^\\."]] },
    ],
  },
  overrides: [
    {
      files: [".eslintrc.cjs", "vite.config.ts"],
      env: { node: true },
    },
  ],
};
