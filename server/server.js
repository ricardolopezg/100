'use strict';

const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');

const PORT = process.env.PORT;

const app = express();
const server = start(app);
const io = socketIO(server);

// namespacing the socket.
require('./io')(io, app, function namespaces (ns) {});

function start (app, options) {
  const credentials = require('../ssl'); // pass as (or with) options for https server.

  if (options)
    return require('https').createServer(options, app);

  return require('http').createServer(app);
}

app.disable('x-powered-by');

app.use(bodyParser.json());

// API based on routes.
app.use(require('./routes/api'));
app.use(require('./routes/sandbox'));

server.listen(PORT, function() {
  console.log(`Express server is up on port ${PORT}.`);
});

module.exports = { app, server, io };
