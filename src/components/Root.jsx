'use strict'

import React, { PropTypes } from 'react'
import { Router, browserHistory } from 'react-router'
import { Provider } from 'react-redux'

import routes from '../routes'

const Root = ({ store, history = browserHistory }) => (
  <Provider store={store}>
    <Router history={history} routes={routes} createElement={(Component, props) => <Component {...props}/>} />
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

export default Root
