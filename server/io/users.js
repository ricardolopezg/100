'use strict';

const { mongoose } = require('./../db/mongoose');

const { User } = require('./../models/user');

module.exports = function Users (io, util) {
  const users = io.of('/users');

  users.use((socket, next) => {
    const { id, request, conn, client, rooms } = socket;
    const dispatch = dispatcher(socket);

    socket.use((packet, next) => {
      const [event, data, callback] = packet;
      packet[1] = JSON.parse(data);
      packet[2] = { dispatch, callback: callingBack(callback), user: conn.user, id };
      return next();
    });
    return next();
  });

  users.on('connection', socket => {
    socket.on('message', onMessage);
    socket.on('disconnect', function () {
      console.log(`connection id: ${socket.id} has disconnected from users.`);
    });
  });

  function dispatcher(socket) {
    return (action, data) => {
      const packet = JSON.stringify({ data });
      return action !== 'message' ? socket.emit(action, packet) : socket.send(packet);
    };
  }

  function callingBack(fn) {
    return ({ data, error } = {}) => fn(JSON.stringify({ data, error }));
  }

  function onMessage(message, { dispatch, callback, user, id }) {
    const { type, name, action, data } = message;
    const { token, email, username, password } = data;
    console.log(data);
    if (type === 'method') {
      if (name === 'user') {
      // verify user here
      switch (action) {
      default: return callback();
        case 'login:email': return User.loginUser({ email }, password).then(_user => {
          const token = _user.tokens.find(t => t.access === 'auth').token;
          return callback({ data: { user: user(_user), token } });
        }, error => callback({ error }));

        case 'login:username': return User.loginUser({ username }, password).then(_user => {
          const token = _user.tokens.find(t => t.access === 'auth').token;
          return callback({ data: { user: user(_user), token } });
        }, error => callback({ error }));

        case 'login:token': return User.loginUser({ token }).then(_user => {
          return callback({ data: { user: user(_user), token } });
        }, error => callback({ error }));

        case 'create': return User.create({ email, password }).then(({ user: _user, token }) => {
          return callback({ data: { user: user(_user), token } });
        }, error => callback({ error }));

        case 'verify:email': return User.verifyEmail(token).then(_user => {
          return callback({ data: { user: user(_user), token } });
        }, error => callback({ error }));

        case 'logout': return user() ? User.logout(user()._id).then(_user => {
          return callback({ data: { user: user(null), token } });
        }, error => callback({ error })) : callback({});
      }
      } else return callback({ error: new Error('Unknown Name') });
    } else return callback({ error: new Error('Unknown Type') });
  }

  return users;
};
