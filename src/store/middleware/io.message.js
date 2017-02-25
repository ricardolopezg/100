'use strict'

export default function ioMessage (store) {
  const getState = store.getState, dispatch = store.dispatch;
  return next => action => {
    const { type, payload } = action;

    return type === '@@io/MESSAGE' ? (function messageio () {
      const { name, action, data } = payload;
      const { thread, threads, messages, user, message, time, typing, error } = data || {};

      console.group(`${type}, ${name}:${action}`);
      error ? console.log('error: ', error) : null;
      data ? console.log('data: ', data) : null;
      console.groupEnd(`${type}, ${name}:${action}`);

      switch (`${name}:${action}`) {
        default: return next(action);
        case 'message:posted': return dispatch({
          type: 'MESSENGER_NEW_MESSAGE', user, message
        });
        case 'message:edited': return dispatch({
          type: 'MESSENGER_UPDATE_MESSAGE', user, message
        });
        case 'message:deleted': return dispatch({
          type: 'MESSENGER_DELETE_MESSAGE', user, message
        });
        case 'thread:connected': return dispatch({
          type: 'MESSENGER_FETCH_THREADS', threads, messages, event: { action, user, time }
        });
        case 'thread:created': return dispatch({
          type: 'MESSENGER_CREATE_THREAD', thread, event: { action, user, time }
        });
        case 'thread:updated': return dispatch({
          type: 'MESSENGER_UPDATE_THREAD', thread, event: { action, user, time }
        });
        case 'thread:removed': return dispatch({
          type: 'MESSENGER_REMOVE_THREAD', thread, event: { action, user, time }
        });
        case 'thread:joined': return dispatch({
          type: 'MESSENGER_JOINED_EVENT', thread, event: { action, user, time }
        });
        case 'thread:left': return dispatch({
          type: 'MESSENGER_LEFT_EVENT', thread, event: { action, user, time }
        });
        case 'thread:typing': return dispatch({
          type: 'MESSENGER_TYPING_EVENT', thread, typing, event: { action, user, time }
        });
        case 'thread:error': return dispatch({
          type: 'MESSENGER_ERROR', thread, error, event: { action, user, time }
        });
      }
    }()) : next(action);
  };
}
