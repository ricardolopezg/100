'use strict'

import { fromJS } from 'immutable'
import { handleActions } from 'redux-actions'

import {
  CREATE_TODO,
  DELETE_TODO,
  CHANGE_TEXT,
} from '../actions/todos'

const todoReducers = handleActions({
  [CREATE_TODO]: (state) => {
    let todos = state.get('todos').push(state.get('todo'));
    return state.set('todos', todos)
  },
  [DELETE_TODO]: (state, { payload }) => (
    state.set('todos', state.get('todos').splice(payload.index, 1))
  ),
  [CHANGE_TEXT]: (state, { payload }) => (
    state.mergeDeep({ 'todo': payload })
  )
}, fromJS({
  todos: [],
  todo: {
    id: '',
    text: '',
    title: '',
    createAt: '',
    updateAt: '',
    completed: false
  }
}))

export default todoReducers
