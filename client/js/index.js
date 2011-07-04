;(function(window) {
  /*
    Bootstrap the browser
  */
  
  valid_keys = {
    32 : true,
    37 : true,
    38 : true,
    39 : true,
    40 : true
  }

  window.bootstrap = function() {
    var l      = window.location;
    var socket = io.connect(l.protocol + "//" + l.hostname + ':' + l.port);
    var scale = 1;
    socket.on('connection', function(gameState) {
      var scene = window.scene = new Scene();
      scene.addPlanet(new Planet());
      scene.update(gameState);

      if (scene.hasPlayer(socket.socket.sessionid)) {
        var ship = window.ship = scene.getPlayer(socket.socket.sessionid);

        /*
          Keybinds
        */
        ship.heldKeys = {};
        document.addEventListener('keydown', function(ev) {
          ship.heldKeys[ev.keyCode] = true;
          if (valid_keys[ev.keyCode]) ev.preventDefault();
        });

        document.addEventListener('keyup', function(ev) {
          if (ship.heldKeys[ev.keyCode]) {
            delete ship.heldKeys[ev.keyCode];
          }
          if (valid_keys[ev.keyCode]) ev.preventDefault();
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

          if (scale > 200) {
            window.scale = 200 / scale;

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

      var fps = 1000/40;
      var lastTime = Date.now();
      setTimeout(function nextFrame() {
        // Allow us to pass the amount of time that has passed into render methods
        var currentTime = Date.now();
        var timeDiff    = currentTime-lastTime;
        scene.render(context, timeDiff);

        lastTime = currentTime;
        setTimeout(nextFrame, fps);
      }, fps);
    });
  };
})(window);