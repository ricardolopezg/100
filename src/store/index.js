'use strict'

import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { routerReducer as routing, routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'

import rootReducer from './reducers'
import reduxIO from './redux.io'
import { ioMessage } from './middleware'

export default function configureStore(initialState, { history }) {
  const reducers = combineReducers({ routing, socket: reduxIO(io), ...rootReducer })
  const state = initialState || undefined

  const createEnhancedStore = applyMiddleware(
    routerMiddleware(history), ioMessage, thunk
  )(createStore)

  return createEnhancedStore(
    reducers, state
  )
}
