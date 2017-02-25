'use strict';

export default function Users (options = {
  transports: ['websocket'], autoConnect: false
}) {
  let users = null;

  function emit (type, name, data = {}) {
    return JSON.stringify((type && name ? {
      type, name, data
    } : { type: 'ping', name: 'pong' }));
  }

  return {
    login() {
      users.send(emit(''))
    },
    register() {},
    verify() {},
  };
}
