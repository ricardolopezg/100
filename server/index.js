'use strict';

require('babel-register')({
  ignore: /(node_modules)/
});

const fs = require('fs');
const path = require('path');
const express = require('express');

const env = process.env.NODE_ENV || 'development';
const PUBLIC_PATH = process.env.PUBLIC_PATH = path.join(__dirname, '../public');
const ASSETS_PATH = process.env.ASSETS_PATH = path.join(__dirname, '../assets');

const SSR = require('./ssr').default;

if (env !== 'production') {
  require('./../config/config.js');

  const { app, server, io } = require('./server.js');

  if (env === 'development') {
    const webpack = require('webpack');
    const webpackMiddleware = require("webpack-dev-middleware");
    const webpackHotMiddleware = require("webpack-hot-middleware");
    const webpackConfig = require('./../webpack.config.js');
    webpackConfig.entry.app = ([
      'webpack-hot-middleware/client?path=/__hmr&timeout=2000&dynamicPublicPath=true',
      'react-hot-loader/patch',
      `${__dirname}/ssr/hmr.js`
    ]);
    webpackConfig.output.publicPath = '';
    const webpackCompiler = webpack(webpackConfig);
    const webpackServer = webpackMiddleware(webpackCompiler, {
      publicPath: webpackConfig.output.publicPath,
      serverSideRender: true,
      lazy: false,
      quiet: false,
      stats: {
        errors: true,
        colors: true
      }
    });

    app.use(express.static(ASSETS_PATH));

    app.use(webpackServer);
    app.use(webpackHotMiddleware(webpackCompiler, {
      log: console.log,
      path: '/__hmr',
      heartbeat: 1000
    }));
    app.use('/*',(req, res, next) => {
      const output = res.locals.webpackStats.toJson().assetsByChunkName;
      const assets = {
        vendor: output.vendor instanceof Array ? output.vendor.map(path => `<script src="${path}"></script>`).join('') : `<script src="${output.vendor}"></script>`,
        manifest: `<script src="${output.manifest}"></script>`,
        js: output.app.filter(path => path.endsWith('.js')).map(path => `<script src="${path}"></script>`),
        css: output.app.filter(path => path.endsWith('.css')).map(path => `<link rel="stylesheet" href="${path}" />`)
      };

      res.status(200).send(`
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${ '100' }</title>

    <script type="text/javascript" src="/socket.io/socket.io.js"></script>
    ${ assets.manifest + assets.vendor }
    ${ assets.css }
    <script>
      window.__INITIAL_STATE__ = ${
        JSON.stringify({
          todo: {
            todos: [],
            todo: {
              id: '',
              text: '',
              title: '',
              createAt: '',
              updateAt: '',
              completed: false
            },
          }, tokens: {
            jwt: req.jwttoken
          }
        })
      }
    </script>
  </head>
  <body>
    <div id="app"></div>
    ${ assets.js }
  </body>
</html>
      `);
    });
  }

  module.exports = { app, server, io };
} else {
  process.env.PORT = 3000;
  process.env.JWT_SECRET = 'openseseme';
  const { app, server, io } = require('./server.js');

  const scripts = fs.readdirSync(path.resolve(__dirname, '..', 'public'));
  const styles = fs.readdirSync(path.resolve(__dirname, '..', 'public/styles'));
  const resources = {
    js: scripts.filter(src => !!src.startsWith('app')),
    manifest: scripts.filter(src => !!src.startsWith('manifest')),
    vendor: scripts.filter(src => !!src.startsWith('vendor')),
    css: styles
  };

  function source (b, src) {
    return b === 'css' ? `<link rel="stylesheet" href="styles/${src || b}" />` : `<script src="${src || b}"></script>`;
  }

  const assets = Object.keys(resources).reduce((a,b) => {
    a[b] = resources[b] instanceof Array ? resources[b].map((src)=> source(b, src)).join('') : source(b);
    return a;
  }, {});

  const initialState = undefined;

  app.use(express.static(PUBLIC_PATH));
  app.use(express.static(ASSETS_PATH));

  app.use('/*', (req, res, next) => {

    SSR(req.url, assets, initialState).then(resolution => {
      const { path, html } = resolution;
      return path ? (
        res.redirect(302, redirectLocation.pathname + redirectLocation.search)
      ) : html ?(
        res.status(200).send(html)
      ): res.status(404).send('Not found');
    }).catch(error => res.status(500).send(error.message));
  });

  module.exports = { app, server, io };
}
