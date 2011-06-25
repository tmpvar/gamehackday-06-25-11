;(function(window) {
  /*
    Bootstrap the browser
  */
  var processGameState = function(socket, gameState) {
    gameState.players.forEach(function(player) {
      var socketInstance = socket.socket;
      if (!shipInstances[player.id]) {
        new entities.Ship({ sessionid: player.id }, player);
      } else {
        shipInstances[player.id]._ = player;
      }
    });
  };

  window.bootstrap = function() {
    var l      = window.location;
    var socket = io.connect(l.protocol + "//" + l.hostname + ':' + l.port);
    var firstRun = false;

    socket.on('connection', function(gameState) {
      processGameState(socket, gameState);
      
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
        socket.emit('keys', heldKeys);
      }, 33);


      socket.on('tick', function(gameState) {
        processGameState(socket, gameState);
      });
      
      socket.on('player.disconnect', function(id) {
        scene.removePlayer(shipInstances[id]);
      })

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
  };
})(window);