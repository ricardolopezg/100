'use strict';

import React from 'react';
import ReactDOMServer, { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { RouterContext, createMemoryHistory, match } from 'react-router';
import { createStore, combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'

import Root from './../../src/components/Root.jsx';
import rootReducer from './../../src/store/reducers'
import reduxIO from './../../src/store/redux.io'
import routes from './../../src/routes';

export default function renderHTML (location, assets, initialState, document) {
  return new Promise((resolve, reject) => {
    match({ routes, location }, (error, redirectLocation, renderProps) => {
      if (error) return reject(error);

      return redirectLocation ? resolve({
        path: redirectLocation.pathname + redirectLocation.search
      }) : renderProps ?(
        resolve({ html: renderMarkup(renderProps, assets, initialState, { location }) })
      ): resolve({ type: 'not found' })
    });
  });
}

function renderMarkup (renderProps, assets, initialState, document) {
  const { basename = 'http://localhost:3000', title = '100', location } = document || {},
  history = createMemoryHistory(location),
  store = createStore(
    combineReducers({ routing, socket: reduxIO(), ...rootReducer }), initialState
  ),
  html = renderToString(<Root store={store} history={history} />);

  return (`
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${ title }</title>

    <script type="text/javascript" src="/socket.io/socket.io.js"></script>
    ${ assets.manifest + assets.vendor }
    ${ assets.css }
    <script>
      window.__INITIAL_STATE__ = ${
        JSON.stringify(store.getState())
      }
    </script>
  </head>
  <body>
    <div id="app">${
      html
    }</div>
    ${ assets.js }
  </body>
</html>
  `);
}
