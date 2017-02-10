'use strict';

const path = require('path');
const webpack = require('webpack');
const extractTextWebpackPlugin = require('extract-text-webpack-plugin');

const contextPath = path.join(__dirname, '..');
const publicPath = path.join(__dirname, '..', 'public');
const srcPath = path.join(__dirname, '..', 'src');

const extractCSS = new extractTextWebpackPlugin({
  filename: 'styles/[name].[hash].css'
});

module.exports = {
  target: 'web',
  context: contextPath,
  entry: {
    app: [
      'babel-polyfill',
      srcPath + '/index.js'
    ],
    vendor: [
      'axios',
      'react',
      'react-dom',
      'react-router',
      'react-redux',
      'redux',
      'redux-actions',
      'redux-immutable',
      'redux-logger',
      'redux-thunk'
    ]
  },
  output: {
    path: publicPath,
    publicPath: publicPath,
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
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest'],
      filename: '[name].[hash].js',
    })
  ],
  devtool: 'inline-sourcemap'
};
