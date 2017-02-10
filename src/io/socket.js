(function startup () {
  'use strict'

  if (this.io) {
    const socket = this.io.connect(this.location.origin);
    socket.on('connect', function connection () {
      socket.emit('token',__INITIAL_STATE__.tokens.jwt).on('verified', function () { console.log('verified!') });
      socket.emit('authenticate', {token: jwt}).on('authenticated', function () {
        //do other things
      }).on('unauthorized', function(msg) {
        console.log("unauthorized: " + JSON.stringify(msg.data));
        throw new Error(msg.data.type);
      })
    });
    return socket;
  } else return null
}).call(window || this);
