;(function(window) {
  /*
    Bootstrap the browser
  */

  window.bootstrap = function() {
    var l      = window.location;
    var socket = io.connect(l.protocol + "//" + l.hostname + ':' + l.port);
    var scale = 1;
    socket.on('connection', function(gameState) {
      var scene = new Scene();
      scene.update(gameState);

      if (shipInstances[socket.socket.sessionid]) {
        var ship = scene.getPlayer(socket.socket.sessionid);

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
        
        
        socket.on('tick', function(gameState) {
          scale = ship.planet_distance();
          $("#vel").html(scale)

          if (scale > 150) {
            window.scale = 150 / scale;

          } else {
            window.scale = 1
          }
          scene.update(gameState);
        });
      }



      socket.on('player.disconnect', function(id) {
        scene.removePlayerById(id);
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