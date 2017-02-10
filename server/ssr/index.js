'use strict';

import React from 'react';
import ReactDOMServer, { renderToString } from 'react-dom/server';
import { createStore } from 'redux';
import { RouterContext, match } from 'react-router';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';

import routes from './../../src/routes';
import reducers from './../../src/store/reducers';

export default function renderHTML (location, assets, initialState) {
  return new Promise((resolve, reject) => {
    match({ routes, location }, (error, redirectLocation, renderProps) => {
      if (error) return reject(error);

      return redirectLocation ? resolve({
        path: redirectLocation.pathname + redirectLocation.search
      }) : renderProps ?(
        resolve({ html: renderMarkup(renderProps, assets, initialState) })
      ): resolve({ type: 'not found' })
    });
  });
}

function renderMarkup (renderProps, assets, initialState) {
  const state = initialState ? fromJS(initialState) : undefined,
  store = createStore(reducers, state),
  html = renderToString(
    <Provider store={store}>
      <RouterContext {...renderProps} />
    </Provider>
  ),
  title = '100';

  return (`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${ title }</title>
        ${ assets.manifest + assets.vendor }
        <script type="text/javascript" src="/socket.io/socket.io.js"></script>
        ${ assets.css.join('') }
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
        ${ assets.js.join('') }
      </body>
    </html>
  `);
}
