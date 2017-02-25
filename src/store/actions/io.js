'use strict';

export default [
  'MESSAGE',
  'INIT',
  'DATA',
  'EMIT',
  'OPEN',
  'CLOSE',
  'FLUSH',
  'DESTROY',
  'CONNECT',
  'RECONNECT',
  'DISCONNECT',
  'AUTHENTICATE',

  'RECONNECTING',

  'OPENED',
  'CLOSED',
  'DESTROYED',
  'INITIALIZED',
  'CONNECTED',
  'DISCONNECTED',
  'RECONNECTED',
  'AUTHORIZED',
  'UNAUTHORIZED',

  'RECONNECT_ATTEMPT',
  'RECONNECT_FAILED',
  'RECONNECT_ERROR',
  'CONNECT_ERROR',
  'ERROR',
  'WARN'
].map(a => 'IO_' + a).reduce((a, b) => {
  a[b] = b;
  return a;
}, {});
