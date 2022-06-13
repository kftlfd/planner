const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = merge(common, {

  mode: 'production',

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/i,
        use: [
          MiniCssExtractPlugin.loader, 
          {
            loader: 'css-loader', 
            options: {
              sourceMap: true,
            }
          },
          'sass-loader'
        ],
      },
    ]
  },

  plugins: [
    new MiniCssExtractPlugin()
  ],

  optimization: {
    minimizer: [
      `...`,
      new CssMinimizerPlugin(),
    ],
  },

});
