'use strict'

import React from 'react'
import ReactDOMServer, { renderToString } from 'react-dom/server'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { RouterContext, match } from 'react-router'
import { Provider } from 'react-redux'
import { fromJS } from 'immutable'

import routes from './routes'
import reducers from './store/reducers/index.js'

function renderReact (renderProps, store, assets) {
  // things to consider is the entry route into the app, redirects and avoiding reload.
  // also make function configurable.
  const html = renderToString(
    <Provider store={store}>
      <RouterContext {...renderProps} />
    </Provider>
  ), { css, js } = assets;

  // things worth pre-rendering and storing in memory for distribution:
  /*
    - web svg icons.
  */
  return (`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${ title }</title>

        <script type="text/javascript" src="/socket.io/socket.io.js"></script>
        ${ css.join('') }
      </head>
      <body>
        <div id="app">${
          html
        }</div>
        <script>
          window.__INITIAL_STATE__ = ${
            JSON.stringify(store.getState())
          }
        </script>
        ${ js.join('') }
      </body>
    </html>
  `);
}

export default function SSR (config, assets) {
  const { initialState, tokens, headers, disable } = config || {};
  return disable ? function noop (req, res, next) { next(); } : function renderMiddleware (req, res, next) {
    // Note that req.url here should be the full URL path from
    // the original request, including the query string.
    if (headers) res.headers(headers);
    match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
      if (error) {
        res.status(500).send(error.message);
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      } else if (renderProps) {
        ////// Redux
        // Compile an initial state
        const state = fromJS(initialState || {
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
          }//, jwtToken: 'public token'
        });

        // Create a new Redux store instance
        const store = createStore(reducers, state);
        const react = renderReact(renderProps, store, assets);

        res.status(200).headers({
          'Content-Type': 'text/html',
          'Content-Length': react.length
        }).send(react);
      } else {
        res.status(404).send('Not found');
      }
    })
  }
}
