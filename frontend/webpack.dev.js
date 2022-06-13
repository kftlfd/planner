const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = merge(common, {

  mode: 'development',

  devtool: 'inline-source-map',

  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
     template: 'templates/dev.html'
    }),
  ],

  devServer: {
    static: './dist',
    port: 8080,
    proxy: {
      '/api/': 'http://localhost:8000'
    }
  },

  optimization: {
    runtimeChunk: 'single',
  },

});
