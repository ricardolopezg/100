'use strict'

module.exports = require(`./config/webpack.${process.env.NODE_ENV || 'development'}.config.js`);
