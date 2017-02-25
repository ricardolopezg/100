'use strict';

export default function Messaging () {
  // const io = window.io;
  // console.log(io);

  const threads = io.connect(location.origin + '/threads');
  const emit = emitter(threads.send, threads.id);

  let methods, actions;

  function emitter(send, id) {
    return (name, action, data, fn = res => console.log(res)) => send(JSON.stringify({ type: '', name, data: { ...data, action, id } }), fn);
  }

  const {
    sendMessage,
    editMessage,
    deleteMessage,
    fetchThreads,
    isTyping,
    joinThread,
    leaveThread
  } = methods = {
    sendMessage(message, thread, fn) {
      return emit('message', 'post', { message, thread }, fn);
    },
    editMessage(id, message, fn) {
      return emit('message', 'edit', { id, message, thread }, fn);
    },
    deleteMessage(id, fn) {
      return emit('message', 'delete', { id }, fn);
    },
    fetchThreads(fn) {
      return emit('thread', 'fetch', {}, ({ data }) => fn({ threads: data.threads }));
    },
    isTyping(thread, typing, fn) {
      return emit('thread', 'typing', { thread, typing }, fn);
    },
    joinThread(thread, fn) {
      return emit('thread', 'join', { thread }, ({ data }) => fn({ messages: data.messages }));
    },
    leaveThread(thread, fn) {
      return emit('thread', 'leave', { thread }, fn);
    }
  };

  const {
    fetch_threads,
    send_message,
    edit_message,
    delete_message,
    is_typing,
    join_thread,
    leave_thread,
    _event
  } = actions = {
    fetch_threads() {
      return dispatch => fetchThreads(({ threads }) => dispatch({ type: 'MESSENGER_FETCH_THREADS', threads }));
    },
    update_message(message) {
      return { type: 'MESSENGER_UPDATE_MESSAGE', message };
    },
    send_message(message, thread) {
      return dispatch => sendMessage(message, thread, ({ data }) => dispatch({ type: 'MESSENGER_SEND_MESSAGE', message: data.message }))
    },
    edit_message(id, message) {
      return dispatch => editMessage(id, message, ({ data }) => dispatch({ type: 'MESSENGER_EDIT_MESSAGE', message: data.message }))
    },
    delete_message(id) {
      return dispatch => deleteMessage(id, ({ data }) => dispatch({ type: 'MESSENGER_DELETE_MESSAGE', message: data.message }))
    },
    is_typing(typing, thread) {
      return dispatch => isTyping(thread, typing, () => dispatch({ type: 'MESSENGER_TYPING', typing }));
    },
    join_thread(thread) {
      return dispatch => joinThread(thread, () => dispatch({ type: 'MESSENGER_JOIN_THREAD', thread }));
    },
    leave_thread(thread) {
      return dispatch => leaveThread(thread, () => dispatch({ type: 'MESSENGER_LEAVE_THREAD' }));
    },
    _event(type, uid) {
      return { type, uid };
    }
  };

  threads.on('connection', () => null);
  threads.on('message', msg => {
    const { error, data } = msg;
    const { action, uid, typing } = data;
    switch (action) {
      default: return;
      case 'joined': {
        return _event('MESSENGER_JOINED_EVENT', {event: {uid}});
      }
      case 'left': {
        return _event('MESSENGER_LEFT_EVENT', {event: {uid}});
      }
      case 'typing': {
        return _event('MESSENGER_TYPING_EVENT', {event: {uid}, typing});
      }
    }
  });
  threads.on('disconnect', message => {});

  return { threads, actions };
}
