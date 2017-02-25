'use strict';

export default function IO () {
  ioWorker = new SharedWorker("http://localhost:3000/workers/socket.io.worker.js");
  ioWorker.port.addEventListener("message", function(e) {
       console.log("Got message: " + e.data);
   }, false);
  ioWorker.port.start();
  ioWorker.port.postMessage("start");
  return ioWorker;
}
