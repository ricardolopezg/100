'use strict'

const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

const mongodb_uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/100';

mongoose.gfs = null;
mongoose.Promise = global.Promise;

mongoose.connect(mongodb_uri);

const connection = mongoose.createConnection(mongodb_uri);

connection.once('open', function onConnect () {
  mongoose.gfs = Grid(connection.db, mongoose.mongo);
});

module.exports = { mongoose };
