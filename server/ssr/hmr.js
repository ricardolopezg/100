'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import { AppContainer } from 'react-hot-loader';

import Root from './../../src/components/Root.jsx';
import configStore from './../../src/store';
import io from './../../src/io';
import './../../src/styles/index.css';

const initialState = window.__INITIAL_STATE__ || undefined;

const store = configStore(initialState, { thunk: { socket, io, }, config : {} });

const appElement = document.getElementById('app');

const socket = io();

function render (App) {
  console.log(module);
  return ReactDOM.render(
    <AppContainer key={Math.random()}>
      <App store={store} history={browserHistory} />
    </AppContainer>,
    appElement
  )
}

render(Root);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./../../src/components/Root.jsx', () => {
    render(require('./../../src/components/Root.jsx').default);
  });

  module.hot.accept('./../../src/store/reducers', () => {
    const nextRootReducer = require('./../../src/store/reducers/index').default;
    store.replaceReducer(nextRootReducer);
  });
}
