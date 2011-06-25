;(function(window) {
  /*
    Bootstrap the browser
  */

  // var l      = window.location;
  // var socket = io.connect(l.protocol + "//" + l.hostname + ':' + l.port);
  // socket.on('news', function (data) {
  //   console.log(data);
  //   socket.emit('my other event', { my: 'data' });
  // });
  // 

  var CONST = {
    THRUST : 10, // units
    ROTATION_DELTA : 0.1 // degrees
  };

  window.bootstrap = function() {
    // TODO: wait for server to add an instance for this client.
    // TODO: implement ship { setThrust }


    var postConnect = function() {
      /*
        Setup Local ship
      */

      var ship = new entities.Ship(10, 10);

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
        // Up
        if (heldKeys['38']) {
          // Thrust forward!
          ship.addVelocity(CONST.THRUST);
        }

        // Left
        if (heldKeys['37']) {
          ship.rotate(-CONST.ROTATION_DELTA)
        }

        // Right
        if (heldKeys['39']) {
          ship.rotate(CONST.ROTATION_DELTA)
        }

        // Fire!
        if (heldKeys['32']) {
          ship.fire();
        }
      }, 33);

      /*
        Render loop
      */
      var canvas = document.getElementById('render-target');
      var context = canvas.getContext('2d');
      var fps = 1000/30;
      setTimeout(function nextFrame() {

        var current = scene.players.length;
        while(current--) {
          
          context.fillStyle = "black";
          context.fillRect(0,0, canvas.width, canvas.height);
          
          scene.players[current].render(context)
          
        };

        setTimeout(nextFrame, fps);
      }, fps);
    }();
  };

  /*
    Spawn the current user, and send a message to the server
  */
  

  

})(window);