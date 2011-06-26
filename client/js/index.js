;(function(window) {
  /*
    Bootstrap the browser
  */
  var processGameState = function(socket, gameState) {
    gameState.players.forEach(function(player) {
      var socketInstance = socket.socket;
      if (!shipInstances[player.id]) {
        var ship = new entities.Ship({ sessionid: player.id }, player);
        ship.image = imageCache.ship.default.body;
        ship.trail = imageCache.ship.default.trails.large;
      } else {
        shipInstances[player.id]._ = player;
      }
    });
  };

  window.bootstrap = function() {
    var l      = window.location;
    var socket = io.connect(l.protocol + "//" + l.hostname + ':' + l.port);
    var scale = 1;
    socket.on('connection', function(gameState) {
      processGameState(socket, gameState);

      if (shipInstances[socket.socket.sessionid]) {
        
        var ship = shipInstances[socket.socket.sessionid];
        /*
          Keybinds
        */
        ship.heldKeys = {};
        document.addEventListener('keydown', function(ev) {
          ship.heldKeys[ev.keyCode] = true;
        });

        document.addEventListener('keyup', function(ev) {
          if (ship.heldKeys[ev.keyCode]) {
            delete ship.heldKeys[ev.keyCode];
          }
        });

        /*
          Track key binds
        */
        setInterval(function() {
          socket.emit('keys', ship.heldKeys);
        }, 33);
      }

      socket.on('tick', function(gameState) {
        
        player = shipInstances[socket.socket.sessionid]
        scale = player.planet_distance();
        $("#vel").html(scale)
        
        if (scale > 150) {
          window.scale = 150 / scale;
          
        } else {
          window.scale = 1
        }
        
        processGameState(socket, gameState);
      });

      socket.on('player.disconnect', function(id) {
        scene.removePlayer(shipInstances[id]);
      });

      /*
        Render loop
      */
      var canvas = document.getElementById('render-target');
      var context = canvas.getContext('2d');

      var fps = 1000/30;
      var lastTime = Date.now();
      setTimeout(function nextFrame() {
        context.save()
        // Allow us to pass the amount of time that has passed into render methods
        var currentTime = Date.now();
        var timeDiff    = currentTime-lastTime;
        
        context.drawImage(imageCache.background.default, 0 , 0)

        context.restore();
        context.save();
        
        context.translate(300, 200);
        context.scale(window.scale, window.scale);
        context.translate(-300, -200);
        context.drawImage(imageCache.planet.default, 200, 100)
        context.restore()
        var current = scene.players.length;
        while(current--) {
          scene.players[current].render(context, timeDiff);
        };

        lastTime = currentTime;
        setTimeout(nextFrame, fps);
      }, fps);
    });
  };
})(window);