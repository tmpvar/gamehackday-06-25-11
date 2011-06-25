var socketio = require('socket.io');
var connect  = require("connect");
var util     = require("util");
var server   = connect(
  connect.logger(),
  connect.static(__dirname + '/../'),
  connect.static(__dirname + '/../client/')
);

var io = socketio.listen(server);
server.listen(8080);

var shared = require(__dirname + '/../shared/shared');
console.log(shared);

io.sockets.on('connection', function (socket) {
 socket.on('disconnect', function() {
   
 });
});
