'use strict';

const { Message, Thread } = require('./../models/messenger');

module.exports = function Threads (io) {
  const threads = io.of('/threads');
  const sessions = {}; // let redis handle this in the future.

  threads.use((socket, next) => {
    const { id, request, conn, client, rooms } = socket;
    const dispatch = dispatcher(socket);
    let user = conn.user();
    socket.thread = null;
    socket.typing = false;

    socket.use(function(packet, next) {
      const [ _event, _data = "{}", _callback ] = packet;
      const { type, name, action, data = {} } = JSON.parse(_data);
      packet[1] = { type: 'threads', name, action, data, user: conn.user() };
      packet[2] = callingBack(_callback, action);
      return next();
    });

    socket.fetchThreads = by => Thread.fetchThreads(by).then(bundle => {
      const { threads, messages } = bundle;
      return dispatch('thread','connected', { threads, messages });
    }, error => dispatch('thread','error', { error }));
    socket.isTyping = (thread, userId, typing) => {
      socket.typing = typing;
      return dispatch('thread','typing', { thread, typing }, thread._id);
    };
    socket.joinThread = (_id, userId) => {
      if (socket.thread) socket.leaveThread(socket.thread);
      return Thread.joinParty(_id, userId).then(thread => {
        const id = socket.thread = thread._id;
        sessions[id] = thread;
        socket.join(id, () => dispatch('thread','joined', {
          thread
        }, id));
        return Promise.resolve({ thread });
      }, error => Promise.reject(error));
    };
    socket.leaveThread = (_id, userId) => {
      return Thread.leaveParty(_id, userId).then(thread => {
        if (!thread.party.filter(member => member.present).length) delete sessions[thread._id]
        socket.thread = null;
        socket.leave(thread._id, () => dispatch('thread','left', {
          thread
        }, thread._id));
        return Promise.resolve({ thread });
      }, error => Promise.reject(error));
    };
    socket.createThread = (userId, party = [], title) => {
      return Thread.createParty(userId, party, title).then(thread => {
        return Promise.resolve({ thread });
      }, error => Promise.reject(error));
    };
    socket.updateThread = (_id, userId, party, title) => {
      return Thread.updateParty(_id, userId, party, title).then(thread => {
        dispatch('thread','updated', { thread }, thread._id);
        return Promise.resolve({ thread });
      }, error => Promise.reject(error));
    };
    socket.removeThread = (_id, userId) => {
      return Thread.disbandParty(_id, userId).then(thread => {
        dispatch('thread','removed', { thread }, thread._id);
        return Promise.resolve({ thread });
      }, error => Promise.reject(error));
    };

    return next();
  });

  function dispatcher (socket) {
    return (name, action, data, room) => {
      const user = socket.conn.user();
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

  threads.on('connection', socket => {
    console.log(`connection id: ${socket.id}; conn.User: ${socket.conn.user()} connected to threads.`);
    // on connection, active convos could possibly float to the users dash.

    if (socket.conn.user()) socket.fetchThreads(socket.conn.user()._id);

    socket.on('message', (packet, callback) => {
      const { type, name, action, data = {}, user } = packet;
      const { message, thread, party, title, typing, _id } = data;
      console.log(`Socket id: ${socket.id}, type: ${type},\nname ${name},\naction: ${action}.`);

      if (user && type === 'threads') {
        if (name === 'message') {
          switch (action) {
          default: return callback({ default: true });
            case 'post': return Message.create(user.id, message, thread).then(message => {
              callback({ message });
              return dispatch('message','posted', { message }, message.thread);
            }, error => callback(undefined, error));

            case 'edit': return Message.edit(_id, message).then(message => {
              if (message) {
                callback({ message });
                return dispatch('message','edited', { message }, message.thread);
              } callback(undefined, new Error('Not Found.'));
            }, error => callback(undefined, error));

            case 'delete': {
              return Message.delete(_id).then(message => {
                if (message) {
                  callback({ message });
                  return dispatch('message','deleted', { message }, message.thread);
                } callback(undefined, new Error('Not Found.'));
              }, error => callback(undefined, error));
            }
          }
        } else if (name === 'thread') {
          switch (action) {
          default: return callback({ default: true });
            case 'typing': return socket.isTyping(thread, user._id, typing);
            case 'fetch': return socket.fetchThreads(user._id);
            case 'fetch:all': return Thread.fetch().then(threads => {
              return callback({ threads });
            }, error => callback(undefined, error));
            case 'create': return socket.createThread(user._id, party, title).then(({ thread }) => {
              return socket.joinThread(thread._id, user._id).then(({ thread }) => {
                return callback({ thread });
              }).catch(error => callback(undefined, error));
            }).catch(error => callback(undefined, error));

            case 'update': return socket.updateThread(thread, user._id, party, title).then(({ thread }) => {
              return callback({ thread });
            }).catch(error => callback(undefined, error));

            case 'delete': return socket.leaveThread(thread, user._id).then(({ thread }) => {
              return socket.removeThread(thread._id, user._id).then(({ thread }) => callback({
                thread
              })).catch(error => callback(undefined, error));
            }).catch(error => callback(undefined, error));

            case 'join': return socket.joinThread(thread, user._id).then(({ thread }) => {
              return Message.findByThread(thread._id).then(messages => {
                return callback({ messages, thread });
              }, error => callback({ thread }, error));
            }).catch(error => callback(undefined, error));

            case 'leave': return socket.leaveThread(thread, user._id).then(({ thread }) => callback({
              thread
            })).catch(error => callback(undefined, error));
          }
        } else return callback({ default: true });
      } else return callback({ default: true });
    });

    socket.on('disconnect', function () {
      const user = socket.conn.user();
      console.log(`connection id: ${socket.id} has disconnected from threads.`);
      if (socket.typing && user) socket.isTyping(socket.thread, user._id, false);
      if (socket.thread && user) socket.leaveThread(socket.thread, user._id);
    });
  });

  return threads;
};
