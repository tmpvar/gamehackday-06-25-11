;(function(window) {
  /*
    Bootstrap the browser
  */

  window.bootstrap = function() {
    var l      = window.location;
    var socket = io.connect(l.protocol + "//" + l.hostname + ':' + l.port);
    var firstRun = false;
    var ship     = null;

    socket.on('connection', function(gameState) {
      /*
        Setup ships
      */
      // TODO: make this work for non-es5 browsers
      gameState.players.forEach(function(player) {
        if (!shipInstances[player.id]) {
          var socketInstance = socket.socket;
          var instance = new entities.Ship(socketInstance, player);
          if (socketInstance.sessionid === player.id) {
            ship = instance;
          }
        }
      });

      /*
        Keybinds
      */
      var heldKeys = {};
      document.addEventListener('keydown', function(ev) {
        heldKeys[ev.keyCode] = true;
      });

      document.addEventListener('keyup', function(ev) {
        if (heldKeys[ev.keyCode]) {
          delete heldKeys[ev.keyCode];
        }
      });

      /*
        Track key binds
      */
      setInterval(function() {
        if (!ship) { return; }
        
        ship.socket.emit('keys', heldKeys);
      }, 33);

      socket.on('tick', function(gameState) {
        /*
          Setup ships
        */
        // TODO: make this work for non-es5 browsers
        gameState.players.forEach(function(player) {
          if (!shipInstances[player.id]) {
            var socketInstance = socket.socket;
            var instance = new entities.Ship(socketInstance, player);
            instance.id = socketInstance.sessionid;
          } else {
            
            
            
          }
        });
      });

      setInterval(function() {
        
      }, 0)

      /*
        Render loop
      */
      var canvas = document.getElementById('render-target');
      var context = canvas.getContext('2d');
      var fps = 1000/30;
      setTimeout(function nextFrame() {
        context.fillStyle = "black";
        context.fillRect(0,0, canvas.width, canvas.height);

        var current = scene.players.length;
        while(current--) {
          scene.players[current].render(context)
        };

        setTimeout(nextFrame, fps);
      }, fps);
      
    });

    socket.on('tick', function(gameState) {

    });
  };

  /*
    Spawn the current user, and send a message to the server
  */

})(window);