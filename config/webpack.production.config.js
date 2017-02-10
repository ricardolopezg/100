'use strict';

const path = require('path');
const webpack = require('webpack');
const extractTextWebpackPlugin = require('extract-text-webpack-plugin');

const contextPath = path.join(__dirname, '..');
const publicPath = path.join(__dirname, '..', 'public');
const srcPath = path.join(__dirname, '..', 'src');

const extractCSS = new extractTextWebpackPlugin({
  filename: 'styles/[name].[chunkhash].css'
});

module.exports = {
  target: 'web',
  context: contextPath,
  entry: {
    app: './src/index.js'
  },
  output: {
    path: publicPath,
    publicPath: publicPath, // http://www.100.com
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js'
  },
  resolve: {
    modules: ['node_modules', 'lib'],
    extensions: ['*', '.js', '.jsx', '.json', '.css', '.less']
  },
  resolveLoader: {
    modules: ['node_modules'],
    moduleExtensions: ['-loader']
  },
  module: {
    rules: [{
      test: /\.css$/i,
      use: extractCSS.extract('css')
    },{
      test: /\.jsx$|\.js$/,
      exclude: /node_modules/,
      use: 'babel'
    },{
      test: /\.json$/,
      use: 'json'
    },{
      test: /\.svg$/,
      use: 'file'
    }],
  },
  plugins: [
    extractCSS,
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest'],
      filename: '[name].[hash].min.js',
    }),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false,
        drop_console: false,
      }
    })
  ]
};
