'use strict';

import {
  CREATE_TODO,
  DELETE_TODO,
  UPDATE_TODO,
  FETCH_TODOS
} from '../actions/todos';

export default function todos (state = {
  todos: [],
  todo: {
    id: '',
    text: '',
    title: '',
    createAt: '',
    updateAt: '',
    completed: false
  }
}, action) {
  const {
    type,
    todos = []
  } = action;

  switch (type) {
    default : return state;
    case FETCH_TODOS: return { ...state, todos };
    case CREATE_TODO: return state;
    case DELETE_TODO: return state;
    case UPDATE_TODO: return state;
  }
}
