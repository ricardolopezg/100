'use strict';

const { mongoose } = require('./../db/mongoose');

const { User } = require('./../models/user');

module.exports = function Users (io, util) {
  const users = io.of('/users');

  function dispatcher(socket) {
    return (action, data) => {
      const packet = JSON.stringify({ data });
      return action !== 'message' ? socket.emit(action, packet) : socket.send(packet);
    };
  }

  function callingBack(fn) {
    return ({ data, error } = {}) => fn(JSON.stringify({ data, error }));
  }

  users.on('connection', socket => {
    // const { id, request, conn, client, rooms } = socket;
    const dispatch = dispatcher(socket);

    console.log(`connection id: ${socket.id}; connected.`);
    socket.use((packet, next) => {
      const [event, data, callback] = packet;
      packet[1] = JSON.parse(data);
      packet[2] = callingBack(callback);
      return next();
    });

    socket.on('message', (message, callback) => {
      const { type, name, action, data } = message;
      const { id, token, email, username, password } = data;
      console.log(`connection id: ${id}; matching: ${socket.id.indexOf(id) !== -1}, message:`, message);

      // verify user here

      if (type === 'method') {
        if (name === 'user') {
          switch (action) {
            default: return callback();
            case 'login:email': return User.loginUser({ email }, password).then(user => {
              console.log('user loggingIn: ', user);
              return callback({ data: { user } });
            }, error => callback({ error }));

            case 'login:username': return User.loginUser({ username }, password).then(user => {
              return callback({ data: { user } });
            }, error => callback({ error }));

            case 'login:token': return User.findByToken(token).then(user => {
              return callback({ data: { user } });
            }, error => callback({ error }));

            case 'create': return User.create({ email, password }).then(({ user, token }) => {
              return callback({ data: { user, token } });
            }, error => callback({ error }));
          }
        }
      }

      return callback({ error: new Error('default') });
    });

    socket.on('disconnect', function () {
      console.log(`connection id: ${socket.id} has disconnected from users.`);
    });
  });

  return users;
};
