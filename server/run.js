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
var lastGameState = {};

io.sockets.on('connection', function (socket) {
 var ship = new shared.entities.Ship(socket, {
   x: Math.random()*100,
   y: Math.random()*100,
 });

 socket.emit('connection', calculateGameState());

 socket.on('disconnect', function() {
   shared.scene.removePlayer(ship);
 });
});

var calculateGameState = function() {
  lastGameState = {
    players : []
  };

  shared.scene.players.forEach(function(player) {
    console.log(player.socket.id);
    var toSend = player._;
    toSend.id = player.socket.id;
    lastGameState.players.push(toSend);
  });

  console.log(JSON.stringify(lastGameState, null, "  "));
  return lastGameState;
}


setInterval(function() {
  io.sockets.emit('tick', calculateGameState());
}, 1000)