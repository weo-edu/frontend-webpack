/**
 * Imports
 */

var path = require('path')
var webpack = require('webpack')
var Isomorphic = require('webpack-isomorphic-tools/plugin')
var isomorphic = new Isomorphic(require('./webpack.config.isomorphic'))
  .development()

/**
 * Webpack config
 */

module.exports = {
  devtool: 'source-map',
  context: path.join(__dirname, 'src'),
  entry: [
    './client.js',
    'webpack-hot-middleware/client'
  ],
  output: {
    publicPath: '/assets/',
    path: path.join(__dirname, '/assets'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: isomorphic.regular_expression('images'),
        loader: 'url-loader?limit=10240', // any image below or equal to 10K will be converted to inline base64 instead
      }
    ]
  },
  plugins: [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      isomorphic
  ]
}
