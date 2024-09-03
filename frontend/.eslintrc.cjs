module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    projectService: true,
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ["webpack.*.js"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/strict-type-checked",
  ],
  plugins: ["@typescript-eslint"],
};