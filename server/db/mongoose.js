'use strict'

const mongoose = require('mongoose');

const mongodb_uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/100';

mongoose.Promise = global.Promise;
mongoose.connect(mongodb_uri);

module.exports = { mongoose };
