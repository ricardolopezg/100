'use strict';

const webpack = require('webpack');
const webpackCommonConfig = require('./webpack.common.js');

webpackCommonConfig.entry.vendor = webpackCommonConfig.entry['vendor'].concat([
  'redux-devtools',
  'redux-devtools-dispatch',
  'redux-devtools-log-monitor',
  'redux-devtools-multiple-monitors',
  'redux-devtools-dock-monitor',
  'redux-logger',
  'react-hot-loader'
]);

webpackCommonConfig.plugins = webpackCommonConfig.plugins.concat([
  new webpack.HotModuleReplacementPlugin()//, new webpack.NoEmitOnErrorsPlugin()
]);

//webpackCommonConfig.devtools = 'inline-sourcemap';

module.exports = webpackCommonConfig;
