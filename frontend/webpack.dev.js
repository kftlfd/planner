const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
  mode: "development",

  devtool: "inline-source-map",

  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "templates/dev.html",
    }),
  ],

  devServer: {
    static: {
      directory: path.join(__dirname, "static"),
      publicPath: "/",
    },
    port: 8080,
    proxy: [
      {
        context: ["/api/", "/auth/"],
        target: "http://localhost:8000",
      },
      {
        context: ["/ws/"],
        target: "ws://localhost:8000",
        ws: true,
      },
    ],
    historyApiFallback: true,
  },

  optimization: {
    runtimeChunk: "single",
  },
});
