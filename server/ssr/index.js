'use strict';

import React from 'react';
import ReactDOMServer, { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { createStore } from 'redux';
import { RouterContext, match } from 'react-router';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';

import routes from './../../src/routes';
import reducers from './../../src/store/reducers';

export default function renderHTML (location, assets, initialState, document) {
  return new Promise((resolve, reject) => {
    match({ routes, location }, (error, redirectLocation, renderProps) => {
      if (error) return reject(error);

      return redirectLocation ? resolve({
        path: redirectLocation.pathname + redirectLocation.search
      }) : renderProps ?(
        resolve({ html: renderMarkup(renderProps, assets, initialState, document) })
      ): resolve({ type: 'not found' })
    });
  });
}

function renderMarkup (renderProps, assets, initialState, document) {
  const { basename = 'http://localhost:3000', title = '100' } = document || {},
  state = initialState ? fromJS(initialState) : undefined,
  store = createStore(reducers, state),
  html = renderToString(
    <Provider store={store}>
      <RouterContext {...renderProps} />
    </Provider>
  );

  //console.log('renderProps: ', renderProps);

  return (`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${ title }</title>

        <script type="text/javascript" src="/socket.io/socket.io.js"></script>
        ${ assets.manifest + assets.vendor }
        ${ assets.css.join('') }
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
        ${ assets.js.join('') }
      </body>
    </html>
  `);
}

function renderCDN () {
  // TODO: read package.json for versioning.
  const resources = {
    'axios': 'https://cdnjs.cloudflare.com/ajax/libs/axios/0.15.3/axios.min.js',
    'babel-polyfill': 'https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.22.0/polyfill.min.js',
    'react': 'https://cdnjs.cloudflare.com/ajax/libs/react/15.4.2/react.min.js',
    'react-dom': 'https://cdnjs.cloudflare.com/ajax/libs/react/15.4.2/react-dom.min.js',
    'react-router': 'https://cdnjs.cloudflare.com/ajax/libs/react-router/4.0.0-beta.5/react-router.min.js',
    'react-redux': 'https://cdnjs.cloudflare.com/ajax/libs/react-redux/5.0.2/react-redux.min.js',
    'redux': 'https://cdnjs.cloudflare.com/ajax/libs/redux/3.6.0/redux.min.js',
    'redux-thunk': 'https://cdnjs.cloudflare.com/ajax/libs/redux-thunk/2.2.0/redux-thunk.min.js'
  };

  // returns string for appending to document head.
  return Object.keys(resources).map(lib => {
    return `<script type="text/javascript" src="${resources[lib]}"></script>`;
  }).join('');
}
