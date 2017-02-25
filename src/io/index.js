'use strict';

import Threads from './messages.ns.js';
import Users from './users.ns.js';
import Todos from './todos.ns.js';

export { Todos, Users, Threads };

export default function socketIO (options = {
  transports: ['websocket'], autoConnect: false
}) {
  const socket = io.connect(location.origin, options);

  const jwt = __INITIAL_STATE__.tokens.jwt;
  socket.keys = {
    jwt
  };

  const actions = {
    authenticate(token, callback) {
      socket.send(JSON.stringify({
        type: 'method',
        name: 'authenticate',
        data: { token }
      }), callback);
    }
  };

  socket.on('connect', () => {
    console.log('connected');
  }).on('message', message => {
    return messages(message);
  }).on('disconnect', () => {
    console.log('disconnected');
  }).on('reconnect', count => {
    console.log('reconnection success - attempts: ', count);
  }).on('error', error => console.log('error: ',error));

  function emit ({
    type,
    name,
    data
  }, callback = data => console.log(data)) {
    return socket.send(JSON.stringify({
      type,
      name,
      data
    }), callback);
  }

  function messages (message) {
    const { type, name, data } = JSON.parse(message);
    console.log('message: ', { type, name, data });
    switch (type) {
      default: return;
      case 'response' : {
        switch (name) {
          default : return;
          case 'authenticated' : return;
          case 'unauthorized' : return;
        }
      }
    }
  }

  return socket;
}
