'use strict';

export default function socketIO (options) {
  // possibly set this script via SSR, assign proper tokens there.
  const socket = window.socket = window.io.connect(window.location.origin, options);
  socket.on('connect',function () {
    socket.emit('token',__INITIAL_STATE__.tokens.jwt).on('verified', function () { console.log('verified!') });
  });
}
