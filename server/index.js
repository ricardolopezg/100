'use strict';

require('babel-register')({
  ignore: /(node_modules)/
});

const env = process.env.NODE_ENV || 'development';

const SSR = require('./ssr').default;

if (env !== 'production') {
  require('./../config/config.js');

  const { app, server, io } = require('./server.js');

  if (env === 'development') {
    const webpack = require('webpack');
    const webpackMiddleware = require("webpack-dev-middleware");
    const webpackConfig = require('./../webpack.config.js');
    const webpackServer = webpackMiddleware(webpack(webpackConfig), {
      publicPath: webpackConfig.publicPath,
      serverSideRender: true,
      lazy: false,
      quiet: false,
      stats: {
        // reasons: true,
        errors: true,
        colors: true
      }
    });

    app.use(webpackServer);
    app.use((req, res, next) => {
      const output = res.locals.webpackStats.toJson().assetsByChunkName;
      const assets = {
        vendor: output.vendor instanceof Array ? output.vendor.map(path => `<script src="${path}"></script>`).join('') : `<script src="${output.vendor}"></script>`,
        manifest: `<script src="${output.manifest}"></script>`,
        js: output.app.filter(path => path.endsWith('.js')).map(path => `<script src="${path}"></script>`),
        css: output.app.filter(path => path.endsWith('.css')).map(path => `<link rel="stylesheet" href="${path}" />`)
      };

      SSR(req.url, assets, {
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
      }).then(resolution => {
        const { path, html } = resolution;
        return path ? (
          res.redirect(302, path)
        ) : html ?(
          res.status(200).send(html)
        ): res.status(404).send('Not found');
      }).catch(error => res.status(500).send(error.message));
    });
  }

  module.exports = { app, server, io };
} else {
  const { app, server, io } = require('./server.js');

  app.use((req, res, next) => {
    // TODO change asset routes dynamically, add build step to write config file with paths.
    const output = res.locals.webpackStats.toJson().assetsByChunkName;
    const assets = {
      js: output.app.filter(path => path.endsWith('.js')).map(path => `<script src="${path}"></script>`),
      css: output.app.filter(path => path.endsWith('.css')).map(path => `<link rel="stylesheet" href="${path}" />`)
    };

    SSR(req.url, assets, {}).then(resolution => {
      const { type, html } = resolution;
      return type === 'redirect' ? (
        res.redirect(302, redirectLocation.pathname + redirectLocation.search)
      ) : type === 'html' ?(
        res.status(200).send(html)
      ): type === 'not found' && res.status(404).send('Not found') || res.status(500).end();
    }).catch(error => res.status(500).send(error.message));
  });

  module.exports = { app, server, io };
}
