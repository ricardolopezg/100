io = new SharedWorker("http://localhost:3000/workers/socket.io.worker.js");

io.port.addEventListener("message", function(e) {
     console.log("Got message: " + e.data);
 }, false);
io.port.start();
io.port.postMessage("start");
