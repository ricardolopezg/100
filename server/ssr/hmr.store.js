'use strict'

import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { routerReducer as routing, routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import { persistState } from 'redux-devtools'

import rootReducer from './../../src/store/reducers'
import reduxIO from './../../src/store/redux.io'
import { ioMessage } from './../../src/store/middleware'

import DevTools from './hmr.devtools.js'

const logger = createLogger()

export { DevTools }

export default function configureStore(initialState, { history }) {
  const reducers = combineReducers({ ...rootReducer, socket: reduxIO(io), routing })
  const state = initialState || undefined

  const createEnhancedStore = compose(
    applyMiddleware(
      routerMiddleware(history),
      ioMessage,
      thunk,
      logger
    ),
    DevTools.instrument()
  )(createStore)

  const store = createEnhancedStore(
    reducers, state
  )

  if (module.hot) {
    module.hot.accept('./../../src/store/reducers/index.js', id => {
      const nextRootReducer = require('./../../src/store/reducers/index.js').default;
      const nextReduxIO = require('./../../src/store/redux.io').default;
      store.replaceReducer(combineReducers({ ...nextRootReducer, socket: nextReduxIO(io), routing }));
    });
  }

  return store;
}
