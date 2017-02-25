'use strict';

export default function Todos (options = {
  transports: ['websocket'], autoConnect: false
}) {
  let todos = null;

  function emit (type, name, data = {}) {
    return JSON.stringify((type && name ? {
      type, name, data
    } : { type: 'ping', name: 'pong' }));
  }

  const cb = (data) => console.log(data);

  return {
    init(onConnect = cb, onMessage = cb, onDisconnect = cb) {
      if (todos) return todos;
      todos = io.connect(location.origin + '/todos', options);
      todos.on('connect', onConnect);
      todos.on('message', onMessage);
      todos.on('disconnect', onDisconnect);
      return todos;
    },
    connect() {
      return todos ? todos.open() : null;
    },
    disconnect() {
      return todos ? todos.close() : null;
    },
    destroy() {
      if (todos) { todos.destroy(); todos = null; }
    },
    emit(type, name, data = {}, callback = cb) {
      todos.send(emit(type, name, data), callback = cb);
    },
    fetch(query = {}, callback = cb) {
      return todos ? todos.send(emit('method','fetch', query), callback) : null;
    },
    create({ text }, callback = cb) {
      return todos ? todos.send(emit('method','create', { text }), callback) : null;
    },
    edit({ id, text, completed }, callback = cb) {
      return todos ? todos.send(emit('method','edit', { id, text, completed }), callback) : null;
    },
    delete({ id }, callback = cb) {
      return todos ? todos.send(emit('method','delete', { id }), callback) : null;
    }
  }
}
