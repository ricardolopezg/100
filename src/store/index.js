'use strict'

import axios from 'axios'
import Immutable, { fromJS } from 'immutable'
import { createStore, applyMiddleware, compose } from 'redux'
import _thunk from 'redux-thunk'
import _logger from 'redux-logger'

import rootReducer from './reducers'
import { socket } from './enhancers'

export default function configureStore(initialState, { thunk, config }) {
  const state = initialState && Immutable.fromJS(initialState) || undefined

  return createStore(
    rootReducer,
    state,
    applyMiddleware(
      _thunk.withExtraArgument({
        request: window ? axios.create({
          baseURL: window.location.origin,
          headers: {
            'X-Custom-Header': 'foobar'
          }
        }) : null,
        ...thunk
      }),
      _logger({ stateTransformer: state => state.toJS() })
    )
  )
}
