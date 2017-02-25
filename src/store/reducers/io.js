'use strict';

import { combineReducers } from 'redux'

import ACTIONS from './../actions/io';

const {
  IO_MESSAGE,
  IO_INIT,
  IO_DATA,
  IO_EMIT,
  IO_OPEN,
  IO_CLOSE,
  IO_DESTROY,
  IO_CONNECT,
  IO_RECONNECT,
  IO_DISCONNECT,
  IO_AUTHENTICATE,

  IO_RECONNECTING,

  IO_OPENED,
  IO_CLOSED,
  IO_DESTROYED,
  IO_INITIALIZED,
  IO_CONNECTED,
  IO_DISCONNECTED,
  IO_RECONNECTED,
  IO_AUTHORIZED,
  IO_UNAUTHORIZED,

  IO_RECONNECT_ATTEMPT,
  IO_RECONNECT_FAILED,
  IO_RECONNECT_ERROR,
  IO_CONNECT_ERROR,
  IO_ERROR,
  IO_WARN
} = ACTIONS;

const sockets = {};


//have the reducer transform to the namespaces used by the session.
export default function io (state = {
  nsp: null,
  id: null,
  connected: false,
  disconnected: true,
  reconnecting: false,
  options: {},
  rooms: [],
  warnings: [],
  errors: [],
  session: []
}, action) {
  if (action.type.startsWith('IO')) {
    // if ((action.nsp !== state.nsp) && state.id) {
    //   return combineReducers({ // also account for nth expansion and reduction.
    //     [state.nsp]: io(state, { type: IO_MERGE, index: 0 }),
    //     [action.nsp]: io(undefined)
    //   });
    // } else if (action.destroyed) { return state; } //reduce the reducer
    const {
      type, error, data, id = null, nsp, connected, disconnected, socket
    } = action;

    const nextState = (next = {}) => ({
      ...state, id, nsp, connected, disconnected, ...next
    });

    switch (type) {
      default : return state;
      case IO_INITIALIZED : return nextState();
      case IO_CONNECTED : case IO_DISCONNECTED : case IO_OPENED : case IO_CLOSED : return nextState();
      case IO_MESSAGE : return {
        ...state, id, nsp, connected, disconnected
      };
      case IO_DATA : return {
        ...state, id, nsp, connected, disconnected
      };
      case IO_ERROR : return {
        ...state, id, nsp, connected, disconnected, errors: state.errors.concat(error)
      };
    }
  } else return state;
}

function scaleState(nsps) {

}
