importScripts('/socket.io/socket.io.js');

var socket = io('http://localhost:3000');

var connections = 0;

self.addEventListener("connect", function(e) {
    var port = e.ports[0];
    connections++;

    port.addEventListener("message", function(e) {
        if (e.data === "start") {

            port.postMessage('hello');
        }
    }, false);

    port.start();

    socket.on('connect', function () {
        port.postMessage('connect', { connections: connections });
    });

    socket.on('disconnect', function () {
        port.postMessage('disconnect', { connections: connections });
    });
}, false);

self.addEventListener('error', function onError (event) {

});
