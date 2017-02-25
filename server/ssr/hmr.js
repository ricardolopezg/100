'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory as history } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { AppContainer } from 'react-hot-loader';

import './../../src/styles/index.css';
import Root from './../../src/components/Root.jsx';
import configStore, { DevTools } from './hmr.store.js';

const appElement = document.getElementById('app');
const initialState = window.__INITIAL_STATE__ || undefined;

const store = configStore(initialState, { history });
const story = syncHistoryWithStore(history, store);

function render (App, store, history) {
  return ReactDOM.render(
    <AppContainer key={Math.random()}>
      <div>
        <App store={store} history={history} />
        <DevTools store={store} />
      </div>
    </AppContainer>,
    appElement
  );
}

render(Root, store, story);

if (module.hot) {
  module.hot.accept('./../../src/components/Root.jsx', () => {
    const nextRoot = require('./../../src/components/Root.jsx').default;
    render(nextRoot, store, story);
  });
}
