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
var Projectile = require(__dirname + '/../shared/projectile').Projectile;
var Scene = require(__dirname + '/../shared/scene').Scene;
var scene = new Scene();
var lastGameState = {};

io.sockets.on('connection', function (socket) {
 var ship = new Ship({
   x: Math.random()*100,
   y: Math.random()*100,
   id : socket.id.split('#').pop()
 });

 scene.addPlayer(ship);

 socket.emit('connection', scene.serialize());

 socket.on('keys', function(heldKeys) {
  ship.handleKeys(heldKeys);
 });

 socket.on('disconnect', function(client) {
   io.sockets.emit('player.disconnect', socket.id);
   scene.removePlayerById(socket.id);
 });
});

setInterval(function() {
  scene.tick();
  try {
    io.sockets.emit('tick', scene.serialize());
  } catch (e) {
    process.exit();
  }
}, 33)
