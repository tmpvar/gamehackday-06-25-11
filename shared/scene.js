(function(exports) {
  exports.Scene = function() {
    this.players = [];
  };

  exports.Scene.prototype = {
    removePlayer :  function(player) {
      var current = scene.players.length;
      while(current--) {
        if (scene.players[current] === player) {
          scene.players.splice(current, 1);
          delete exports.shipInstances[player.socket.id];
          break;
        }
      }
    }
  };
})(typeof window === 'undefined' ? exports : window);