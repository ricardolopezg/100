'use strict'

import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { browserHistory as history } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import Root from './components/Root.jsx'
import createStore from './store'
import './styles/index.css'

const store = createStore((__INITIAL_STATE__ || undefined), { history })

const story = syncHistoryWithStore(history, store)

ReactDOM.render(<Root store={store} history={story} />, document.getElementById('app'))
