'use strict';

const webpack = require('webpack');

const webpackCommonConfig = require('./webpack.common.js');

webpackCommonConfig.plugins = webpackCommonConfig.plugins.concat([
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': '"production"',
  }),
  new webpack.optimize.UglifyJsPlugin({
    minimize: true,
    compress: {
      warnings: false,
      drop_console: false,
    }
  })
]);

// webpackCommonConfig.output.publicPath = 'http://www.100.com';

module.exports = webpackCommonConfig;
