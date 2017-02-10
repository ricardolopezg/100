'use strict';

const path = require('path');
const webpack = require('webpack');
const extractTextWebpackPlugin = require('extract-text-webpack-plugin');

const contextPath = path.join(__dirname, '..');
const publicPath = path.join(__dirname, '..', 'public');
const srcPath = path.join(__dirname, '..', 'src');

const extractCSS = new extractTextWebpackPlugin({
  filename: 'styles/[name].[contenthash].css'
});

module.exports = {
  target: 'web',
  context: contextPath,
  entry: {
    app: [ srcPath + '/index.js' ],
    vendor: [
      'axios',
      'babel-polyfill',
      'immutable',
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
      test: /\.css$/,
      use: extractCSS.extract([{
        loader: 'css',
        options: {
          importLoaders: 1
        }
      }, 'postcss'])
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
    },{
      test: /\.(eot|svg|ttf|woff|woff2)$/,
      use: 'file?name=fonts/[name].[ext]'
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
