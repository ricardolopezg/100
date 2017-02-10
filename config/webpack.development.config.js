'use strict';

const webpack = require('webpack');
const webpackCommonConfig = require('./webpack.common.js');

webpackCommonConfig.plugins = webpackCommonConfig.plugins.concat([
  new webpack.HotModuleReplacementPlugin()//, new webpack.NoEmitOnErrorsPlugin()
]);

module.exports = webpackCommonConfig;
