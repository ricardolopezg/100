'use strict'

import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { browserHistory } from 'react-router'

import Root from './components/Root.jsx'
import configStore from './store'
import './styles/main.css'

const initialState = window.__INITIAL_STATE__ || undefined;

const socket = io.connect(window.location.origin);
socket.on('connect',function () {
  socket.emit('token',__INITIAL_STATE__.tokens.jwt).on('verified', function () { console.log('verified!') });
});

ReactDOM.render(<Root store={configStore(initialState, {
  thunk: {
    socket: socket
  }, config : {}
})} history={browserHistory} />, document.getElementById('app'))
