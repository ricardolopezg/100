'use strict';

const [
  FETCH_THREADS,
  FETCH_MESSAGES,
  NEW_MESSAGE,
  UPDATE_MESSAGE,
  SEND_MESSAGE,
  EDIT_MESSAGE,
  DELETE_MESSAGE,
  TYPING,
  JOIN_THREAD,
  CREATE_THREAD,
  UPDATE_THREAD,
  REMOVE_THREAD,
  LEAVE_THREAD,
  JOINED_EVENT,
  LEFT_EVENT,
  TYPING_EVENT,
  ERROR
] = [
  'MESSENGER_FETCH_THREADS',
  'MESSENGER_FETCH_MESSAGES',
  'MESSENGER_NEW_MESSAGE',
  'MESSENGER_UPDATE_MESSAGE',
  'MESSENGER_SEND_MESSAGE',
  'MESSENGER_EDIT_MESSAGE',
  'MESSENGER_DELETE_MESSAGE',
  'MESSENGER_TYPING',
  'MESSENGER_JOIN_THREAD',
  'MESSENGER_CREATE_THREAD',
  'MESSENGER_UPDATE_THREAD',
  'MESSENGER_REMOVE_THREAD',
  'MESSENGER_LEAVE_THREAD',
  'MESSENGER_JOINED_EVENT',
  'MESSENGER_LEFT_EVENT',
  'MESSENGER_TYPING_EVENT',
  'MESSENGER_ERROR'
];

function mergeMessages(messages, newMessages) {
  return messages.reduce((a, b) => a.find(_a => b._id === _a._id) ? a : [b, ...a], ([]).concat(newMessages));
}

export default function messenger (state = {
  messages: [],
  threads: [],
  events: [],
  typing: [],
  errors: [],
  party: [],
  thread: null
}, action) {
  const {
    user,
    type,
    error,
    messages = [],
    threads,
    event,
    typing,
    message,
    party,
    thread
  } = action;

  if (/^MESSENGER/.test(type) && event) {
    console.group('message event');
    console.log(event, action);
    console.groupEnd('message event');
    state.events = state.events.concat(event);
  }

  switch (type) {
    default : return state;
    case ERROR: return { ...state, errors: state.errors.concat(error) };
    case FETCH_MESSAGES: return { ...state, messages };
    case NEW_MESSAGE: return { ...state, messages: mergeMessages(state.messages, message) };
    case UPDATE_MESSAGE: {
      state.messages[state.messages.findIndex(({ _id }) => _id === message._id)] = message;
      return { ...state, messages: [...state.messages] };
    }
    case DELETE_MESSAGE: return { ...state, messages: state.messages.filter(({ _id }) => _id !== message._id) };

    case FETCH_THREADS: return { ...state, threads, messages: mergeMessages(state.messages, messages) };
    case JOIN_THREAD: return { ...state, thread, party, messages: mergeMessages(state.messages, messages) };
    case LEAVE_THREAD: return { ...state, thread: null, party: [] };
    case CREATE_THREAD: return { ...state, threads: state.threads.concat(thread) };
    case UPDATE_THREAD: return {
      ...state, threads: state.threads.reduce((a, b) =>  a._id === thread._id ? b.concat(thread) : b.concat(a), [])
    };
    case REMOVE_THREAD: return { ...state, threads: state.threads.filter(_thread => _thread._id !== thread._id) };

    case JOINED_EVENT: return { ...state, thread, party };
    case LEFT_EVENT: return { ...state, thread, party };
    case TYPING_EVENT: return {
      ...state, typing: typing ? state.typing.concat(event.user) : state.typing.filter(id => event.user === id ? false : true)
    };
  }
}
