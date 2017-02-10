'use strict';

const fs = require('fs');
const _ = require('underscore');
const express = require('express');

const files = express.Router();

const paths = {
  'index.html': path.resolve(__dirname, '../../', 'public', 'index.html');
};

files.get('/index.html', (req, res) => {
  res.send();
});

module.exports = files;
