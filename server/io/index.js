'use strict';

const ss = require('socket.io-stream');

const { mongoose } = require('./../db/mongoose');

const Users = require('./users');
const Threads = require('./threads');
const Todos = require('./todos');

const { hash, checkHash, generateJWT, verifyJWT } = require('./../utils/hash')();

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = function NameSpaceIO (io, app, callback) {
  io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('disconnect', () => {
      console.log('User was disconnected');
    });
  });

  app.use((req, res, next) => {
    req.jwttoken = generateJWT({

    }, JWT_SECRET);
    next();
  });

  const namespaces = {
    users: Users(io),
    threads: Threads(io),
    todos: Todos(io)
  };

  const utility = {
    _uploadFile(stream, { filename, content_type, options }, callback) {
      const writestream = mongoose.gfs.createWriteStream({ filename, content_type });
      writestream.on('close', file => callback(undefined, file));
      writestream.on('error', e => callback(e, undefined));
      stream.pipe(writestream);
    },
    _downloadFile(stream, { _id, filename, content_type, options }, callback) {
      const readstream = mongoose.gfs.createReadStream({ _id, filename, content_type }, options);
      readstream.on('close', file => callback(undefined, file));
      readstream.on('error', e => callback(e, undefined));
      readstream.pipe(stream);
    }
  };

  io.use((socket, next) => {
    const { id, request, conn, client, rooms } = socket;
    // :internal protocol. emitted via ('message', { type: 'system' })
    // never directly called by the user; a relay message via private client code.
    // create a digestible code that is consumed by the internal method.
    ss(socket).on(':upload', (stream, data, callback) => {
      utility._uploadFile(stream, data, callback);
    });
    ss(socket).on(':download', (stream, data, callback) => {
      utility._downloadFile(stream, data, callback);
    });

    return next();
  });

  io.sockets.on('connection', function (socket) {
    const { id, request, conn, client, rooms } = socket;
    socket.on('message', function onMessage (message, fn = () => undefined) {
      const { type, name, data = {} } = JSON.parse(message || {});
      console.log(`Socket id: ${id}, Message - type: ${type}`);

      switch (type) {
        default: {
          console.log(`Unregistered message fired.\nName: ${name},\nData: ${data}`);
          return fn({
            error: null, data: { type: 'default', message: 'default message type' }
          });
        }
        case 'method' : {
          console.log(`Method fired.\nName: ${name},\nData: ${data}`);
          switch (name) {
            default: return fn({ error: 'The method does not exist.' });
            case 'mock::error': return fn({ error: { loggingIn: false }  });
            case 'login': return fn({ data: { loggingIn: true }  });
            case 'login::token': return fn({ error: null, data: null });
            case 'logout': return fn({ error: null, data: { loggedOut: true } });
            case 'join': case 'leave': {
              const { room } = data;
              return name === 'join' && room ? socket.join(room, fn) : (
                name === 'leave' && room ? (
                  socket.leave(room, fn)
                ) : socket.rooms.forEach(room => socket.leave(room, fn))
              );
            }
            case 'rooms': {
              const { room, message } = data;
              return socket.to(room).send({ type: 'rooms:message', data: message });
            }
            case 'authenticate': {
              const { token } = data;
              verifyJWT(token, JWT_SECRET).then(data => {
                socket.send({ type: 'authenticated', error: null, data });
              }).catch(error => {
                socket.send({ type: 'unauthorized', data: null, error });
              });
              return fn({ error: null, data: {  } });
            }
          }
        }
        case 'system': {
          console.log(`System method fired.\nName: ${name},\nData: ${data}`);
          const { file, token, stream } = data;
          switch (name) {
            default: return fn({ error: 'The method does not exist.' });
            case 'upload': {
              // checks the token, then accepts the stream.
            }
            case 'file:upload': {
              // this requests the upload, sending a token.
              // on clientside - send acknowledgement with token and streams the queue.
            }
          }
        }
      }

      fn({ error: null, data: {} });
    });
  });


  callback(namespaces);
}
