'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');

const eventStream = require('./../utils/event-stream');

const sandbox = express.Router();

sandbox.get('/eventstream', (req, res) => {
  eventStream(req, res, {
    message: 'initial connection'
  });
  //setInterval(() => , 1000);
});

sandbox.get('/playground/index.html', (req, res) => {
  let file = path.resolve(__dirname, '../..','playground','html','microphone_inline.html');
  //fs.createReadStream().pipe(res);
  res.sendFile('microphone_inline_time_freq_domain_output.html', {
    root: path.resolve(__dirname, '../..','playground','html')
  });
});

module.exports = sandbox;
