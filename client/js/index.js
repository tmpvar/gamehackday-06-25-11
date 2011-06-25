;(function(window) {
  /*
    Bootstrap the browser
  */

  var CONST = {
    THRUST : 10, // units
    ROTATION_DELTA : 0.006 // degrees
  };

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
      console.log("before")
      gameState.players.forEach(function(player) {
        console.log(player.id);
        if (!shipInstances[player.id]) {
          var socketInstance = socket.socket;
          var instance = new entities.Ship(socketInstance, player);
          if (instance.id === player.id) {
            ship = instance;
          }
        }
      });
      console.log('after');

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

        // Up
        if (heldKeys['38']) {
          // Thrust forward!
          ship.addVelocity(CONST.THRUST);
        }
        // Brake
        if (heldKeys['40']) {
          // Thrust forward!
          ship.addVelocity(0 - CONST.THRUST);
        }

        // Left
        if (heldKeys['37']) {
          ship.rotate(CONST.ROTATION_DELTA)
        }

        // Right
        if (heldKeys['39']) {
          ship.rotate(-CONST.ROTATION_DELTA)
        }

        // Fire!
        if (heldKeys['32']) {
          ship.fire();
        }
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