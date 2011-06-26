var socketio = require('socket.io');
var connect  = require("connect");
var util     = require("util");
var server   = connect(
  connect.static(__dirname + '/../'),
  connect.static(__dirname + '/../client/')
);

var io = socketio.listen(server);
io.set('log level', 0);
server.listen(8080);

var Ship = require(__dirname + '/../shared/ship').Ship;
var Planet = require(__dirname + '/../shared/planet').Planet;
var Projectile = require(__dirname + '/../shared/ship').Projectile;
var Scene = require(__dirname + '/../shared/scene').Scene;
var scene = new Scene();

var lastGameState = {};

io.sockets.on('connection', function (socket) {
 var ship = new Ship(socket, {
   x: Math.random()*100,
   y: Math.random()*100,
 });

 socket.emit('connection', calculateGameState());

 socket.on('keys', function(heldKeys) {
  ship.handleKeys(heldKeys);
 });

 socket.on('disconnect', function(client) {
   io.sockets.emit('player.disconnect', socket.id);
   shared.scene.removePlayer(ship);
 }); 
});

var calculateGameState = function() {
  lastGameState = {
    players : []
  };

  scene.players.forEach(function(player) {
    var toSend = player._;
    toSend.id = player.socket.id;
    lastGameState.players.push(toSend);
  });

  return lastGameState;
}


setInterval(function() {
  scene.players.forEach(function(player) { player.tick() });
  io.sockets.emit('tick', calculateGameState());
}, 33)