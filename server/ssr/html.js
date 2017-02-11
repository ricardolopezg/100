'use strict';

require('babel-register')({
  ignore: /(node_modules)/
});

const fs = require('fs');

const SSR = require('./server/ssr').default;
const scripts = fs.readdirSync(__dirname + '/public');
const styles = fs.readdirSync(__dirname + '/public/styles');

const resources = {
  js: scripts.filter(src => !!src.startsWith('app')),
  manifest: scripts.filter(src => !!src.startsWith('manifest')),
  vendor: scripts.filter(src => !!src.startsWith('vendor')),
  css: styles
};

const assets = Object.keys(resources).reduce((a,b) => {
  a[b] = resources[b] instanceof Array ? resources[b].map((src)=> source(b, src)).join('') : source(b);
  return a;
}, {});

function source (b, src) {
  return b === 'css' ? `<link rel="stylesheet" href="${src || b}" />` : `<script src="${src || b}"></script>`;
}

SSR('/', assets).then(result => {
  if (result.html) return fs.writeFileSync(__dirname+'/public/index.html', result.html, {
    encoding: 'utf8'
  });
}).catch(e => console.log(e));
