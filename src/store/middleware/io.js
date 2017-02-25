'use strict';

import ACTIONS from './../actions/io';

const {
  IO_MESSAGE,
  IO_INIT,
  IO_DATA,
  IO_EMIT,
  IO_OPEN,
  IO_CLOSE,
  IO_FLUSH,
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

export default function createIOMiddleware (ns, options = {
  transports: ['websocket'], autoConnect: false
}) {
  let socket, _store;

  return store => next => action => {
    const state = store.getState, dispatch = store.dispatch, { type, message, cb } = action;
    _store = store;
    return /^IO_(?:INIT|EMIT|OPEN|CLOSE|DESTROY)/.test(type) ? (function socketio () {
      const { initialized, connected, disconnected, reconnecting } = state().io;
      switch (type) {
        default : return next(action);
        case IO_INIT : {
          if (initialized) return next(action);
          socket = io.connect(ns, options);
          socket.on('connect', () => {
            dispatch({ type: IO_CONNECTED, ...getStats(socket) });
          }).on('message', message => {
            const { type, data } = JSON.parse(message);
            console.log(message, type, data);
            switch (type) {
              default: return dispatch({
                type: IO_MESSAGE, ...getStats(socket), message: { type, data }
              });
              case 'authenticated': return dispatch({
                type: IO_AUTHORIZED, ...getStats(socket), message: { type, data }
              });
              case 'unauthorized': return dispatch({
                type: IO_UNAUTHORIZED, ...getStats(socket), message: { type, data }
              });
              case 'rooms:message': {}
            }
          }).on('flush', arg => {
            console.log('flushing ', arg);
            dispatch({ type: IO_FLUSH, ...getStats(socket) });
          }).on('disconnect', () => {
            dispatch({ type: IO_DISCONNECTED, ...getStats(socket) });
          }).on('reconnect', count => {
            dispatch({ type: IO_RECONNECTED, ...getStats(socket), reconnected: true, count });
          }).on('reconnecting', count => {
            dispatch({ type: IO_RECONNECTING, ...getStats(socket), reconnecting: true, count });
          }).on('reconnect_attempt', () => {
            dispatch({ type: IO_RECONNECT_ATTEMPT, ...getStats(socket) });
          }).on('reconnect_failed', () => {
            dispatch({ type: IO_RECONNECT_FAILED, ...getStats(socket) });
          }).on('reconnect_error', error => {
            dispatch({ type: IO_RECONNECT_ERROR, error, ...getStats(socket) });
          }).on('error', error => dispatch({ type: IO_ERROR, error, ...getStats(socket) }));
          console.log(socket)
          return dispatch({ type: IO_INITIALIZED, ...getStats(socket) });
        }
        case socket === null : return warn();
        case IO_EMIT : return socket && message ? next(emit(message, cb)) : warn(message ? undefined : 'emit needs a message.');
        case IO_OPEN : {
          //if (!socket) return warn();
          socket.open();
          return dispatch({ type: IO_OPENED });
        };
        case IO_CLOSE : {
          socket.close();
          return dispatch({ type: IO_CLOSED });
        };
        case IO_DESTROY : {
          socket.destroy();
          socket = null;
          return dispatch({ type: IO_DESTROYED });
        };
      }
    }()) : next(action);
  }

  function emit ({
    type,
    name,
    data
  }, callback = (error, data) => console.log('acknowledgement - default: ',error, data)) {
    return (dispatch, getState) => {
      return socket ? socket.send(JSON.stringify({
        type,
        name,
        data
      }), (message = {}) => {
        console.log('acknowledgement - message - firss: ',message);
        const { error = null, data = null } = message;//JSON.parse();
        callback({error, data});
        return _store.dispatch({ type: error ? 'IO_ERROR' : 'IO_DATA', error, data });
      }) : warn();
    }
  }

  const actions = {
    uploadFile(file, { filename, content_type }) {},
    downloadFile(id) {}
  };

  function warn (message = 'socket needs to be initialized') {
    _store.dispatch({ type: IO_WARN, message });
  }

  function getStats (socket) {
    const { connected, disconnected, id, nsp, io } = socket;
    return { connected, disconnected, id, nsp };
  }
}
