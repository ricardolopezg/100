'use strict'

import { combineReducers } from 'redux-immutable'

import todo from './todos'
import tokens from './tokens'

const rootReducer = combineReducers({
  todo, tokens
})

export default rootReducer
