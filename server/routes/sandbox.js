'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');

const sandbox = express.Router();

sandbox.get('/playground/index.html', (req, res) => {
  let file = path.resolve(__dirname, '../..','playground','html','microphone_inline.html');
  //fs.createReadStream().pipe(res);
  res.sendFile('microphone_inline_time_freq_domain_output.html', {
    root: path.resolve(__dirname, '../..','playground','html')
  });
});

module.exports = sandbox;
