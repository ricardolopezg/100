'use strict'

import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { browserHistory } from 'react-router'

import Root from './components/Root.jsx'
import configStore from './store'
import io from './io'
import './styles/index.css'

const initialState = window.__INITIAL_STATE__ || undefined

const socket = io();

ReactDOM.render(<Root store={configStore(initialState, {
  thunk: {
    socket: socket,
    //io,
  }, config : {}
})} history={browserHistory} />, document.getElementById('app'))
