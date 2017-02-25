'use strict';

const { Message, Thread } = require('./../models/messenger');

module.exports = function Threads (io) {
  const threads = io.of('/threads');
  const users = [];
  const rooms = {};

  threads.on('connection', socket => {
    const dispatch = dispatcher(socket);
    let user = socket.user = users[users.length] = users.length;
    socket.thread = null;

    socket.joinThread = (_id, userId = user) => {
      if (socket.thread) socket.leaveThread(socket.thread);
      return Thread.joinParty(_id, userId).then(thread => {
        const id = socket.thread = thread._id;
        socket.join(id, () => dispatch('thread','joined', {
          thread, user: userId
        }, id));
        return Promise.resolve({ thread });
      }, error => Promise.reject(error));
    };
    socket.leaveThread = (_id, userId = user) => {
      return Thread.leaveParty(_id, userId).then(thread => {
        socket.thread = null;
        socket.leave(thread._id, () => dispatch('thread','left', {
          thread, user: userId
        }, thread._id));
        return Promise.resolve({ thread });
      }, error => Promise.reject(error));
    };
    socket.createThread = (userId = user, party = [], title) => {
      return Thread.createParty(userId, party, title).then(thread => {
        if (party.length > 1) party.forEach(member => {
          return member.user === userId ? undefined : dispatch('thread','created', {
            thread, user: userId
          }, thread._id);
        });
        return Promise.resolve({ thread });
      }, error => Promise.reject(error));
    };
    socket.updateThread = (_id, party, title) => {
      return Thread.updateParty(_id, userId, party, title).then(thread => {
        dispatch('thread','updated', { thread, user, typing }, thread._id);
        return Promise.resolve({ thread });
      }, error => Promise.reject(error));
    };
    socket.removeThread = (_id) => {
      return Thread.dispose(_id).then(thread => {
        dispatch('thread','removed', { thread, user }, thread._id);
        return Promise.resolve({ thread });
      }, error => Promise.reject(error));
    };
    socket.isTyping = (thread, userId = user, typing) => {
      socket.typing = typing;
      return dispatch('thread','typing', { thread, user, typing }, thread._id);
    };

    socket.use(function(packet, next) {
      const [ _event, _data = "{}", _callback ] = packet;
      const { type = 'threads', name, action, data = {} } = JSON.parse(_data);
      packet[1] = { type, name, action, data };
      return next();
    });

    function dispatcher (socket) {
      return (name, action, data, room) => {
        const packet = JSON.stringify({ name, action, data: { ...data, user, time: Date.now() } });
        return room ? socket.to(room).send(packet) : socket.send(packet);
      };
    }
    function callingBack (fn, action) {
      return fn ? (data, error) => {
        error ? console.log(error) : null;
        return fn(JSON.stringify({ action, data: { ...data, time: Date.now() }, error }));
      } : () => null;
    }
    console.log(`connection id: ${socket.id}; User: ${user} connected to threads.`);

    Thread.fetch().then(threads => dispatch('thread','connected', {
      user, threads
    }), error => dispatch('thread','error', { user, error }));

    socket.on('message', (packet, fn) => {
      const { type, name, action, data = {} } = packet;
      const { message, thread, party, typing, _id } = data;
      const callback = callingBack(fn, action);
      console.log(`Socket id: ${socket.id}, type: ${type},\nname ${name},\naction: ${action}.`);

      switch (type) {
      default: //return callback({ default: true });
        switch (name) {
        default: return callback({ default: true });
          case 'message': {
            switch (action) {
            default: return callback({ default: true });
              case 'post': return Message.create(user, message, thread).then(message => {
                callback({ message });
                return dispatch('message','posted', { user, message }, message.thread);
              }, error => callback(undefined, error));

              case 'edit': return Message.edit(_id, message).then(message => {
                if (message) {
                  callback({ message });
                  return dispatch('message','edited', { user, message }, message.thread);
                } callback(undefined, new Error('Not Found.'));
              }, error => callback(undefined, error));

              case 'delete': {
                return Message.delete(_id).then(message => {
                  if (message) {
                    callback({ message });
                    return dispatch('message','deleted', { user, message }, message.thread);
                  } callback(undefined, new Error('Not Found.'));
                }, error => callback(undefined, error));
              }
            }
          }
          case 'thread': {
            switch (action) {
            default: return callback({ default: true });
              case 'fetch': {
                return Thread.fetch().then(threads => callback({ threads }), error => callback(undefined, error));
              }
              case 'typing': return socket.isTyping(thread, user, typing);

              case 'create': return socket.createThread(user, party, title).then(({ thread }) => {
                return socket.joinThread(thread._id, user).then(({ thread }) => {
                  callback({ thread });
                }).catch(error => callback(undefined, error));
              }).catch(error => callback(undefined, error));

              case 'update': return socket.updateThread(thread, party, title).then(({ thread }) => {
                return callback({ thread });
              }).catch(error => callback(undefined, error));

              case 'delete': return socket.leaveThread(thread).then(({ thread }) => {
                return socket.removeThread(thread._id).then(({ thread }) => callback({
                  thread
                })).catch(error => callback(undefined, error));
              }).catch(error => callback(undefined, error));

              case 'join': return socket.joinThread(thread, user).then(({ thread }) => {
                return Message.findByThread(thread._id).then(messages => {
                  return callback({ messages, thread });
                }, error => callback({ thread }, error));
              }).catch(error => callback(undefined, error));

              case 'leave': return socket.leaveThread(thread).then(({ thread }) => callback({
                thread
              })).catch(error => callback(undefined, error));
            }
          }
        }
      }
    });

    socket.on('disconnect', function () {
      console.log(`connection id: ${socket.id} has disconnected from threads.`);
      if (socket.typing) socket.isTyping(socket.thread, user, false);
      if (socket.thread) socket.leaveThread(socket.thread, user);
    });
  });

  return threads;
};
