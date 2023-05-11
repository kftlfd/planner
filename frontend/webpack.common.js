const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    app: "./src/index.tsx",
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    filename: "[name].js",
    // chunkFilename: "[name].chunk.js",
    clean: true,
  },

  resolve: {
    alias: {
      app: path.resolve(__dirname, "src"),
    },
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      // {
      //   test: /\.jsx?$/i,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: "babel-loader",
      //     options: {
      //       presets: ["@babel/preset-env", "@babel/preset-react"],
      //     },
      //   },
      // },
      // {
      //   test: /\.(sa|sc|c)ss$/i,
      //   use: [
      //     MiniCssExtractPlugin.loader,
      //     {
      //       loader: "css-loader",
      //       options: {
      //         sourceMap: true,
      //       },
      //     },
      //     "sass-loader",
      //   ],
      // },
    ],
  },

  plugins: [new MiniCssExtractPlugin()],
};
