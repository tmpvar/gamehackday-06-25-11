var socketio = require('socket.io');




var connect = require("connect");
var sys = require("sys");
var util = require("util");

var server = connect(
  connect.logger(),
  connect.static(__dirname + '/../'),
  connect.static(__dirname + '/../client/')
);

var io = socketio.listen(server);
server.listen(8080);

io.sockets.on('connection', function (socket) {
 socket.emit('news', { hello: 'world' });
 socket.on('my other event', function (data) {
   
 });
});
