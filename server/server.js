'use strict'

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.disable('x-powered-by');

app.use(bodyParser.json());

// If http, passess. If https, changes to http.
app.use(function(req, res, next) {
  if (req.headers['x-forwarded-proto'] === 'https') {
    res.redirect('http://' + req.hostname + req.url);
  } else {
    next();
  }
});

// CRUD API based on routes.
app.use(require('./routes/api'));

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log('Express server is up on port ' + PORT);
});

module.exports = { app };
