'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'openseseme';
const PORT = process.env.PORT || 3000;
const PUBLIC_PATH = process.env.PUBLIC_PATH = path.join(__dirname, '../public');

const app = express();
const server = start(app);
const io = socketIO(server);

function start (app, options) {
  const ssl = require('../ssl'); // pass as (or with) options for https server.

  if (options)
    return require('https').createServer(options, app);

  return require('http').createServer(app);
}

app.disable('x-powered-by');

app.use(express.static(PUBLIC_PATH));
app.use(bodyParser.json());

// If http, passess. If https, changes to http.
app.use(function(req, res, next) {
  if (req.header('x-forwarded-proto') === 'https') {
    res.redirect('http://' + req.hostname + req.url);
  } else {
    next();
  }
});

// API based on routes.
app.use(require('./routes/api'));
app.use(require('./routes/sandbox'));

app.use((req, res, next) => {
  req.jwttoken = jwt.sign({}, JWT_SECRET);
  next();
});

io.on('connection', (socket) => {
  console.log('New user connected');
  socket.on('token', token => {
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      socket.emit('verified');
    } catch (e) {
      console.log(e);
    }
  });
  socket.on('message', (data) => {
    console.log('User sent a message: ', JSON.stringify(data, undefined, 2));
  });
  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});

server.listen(PORT, function() {
  console.log(`Express server is up on port ${PORT}.`);
});

module.exports = { app, server, io };
