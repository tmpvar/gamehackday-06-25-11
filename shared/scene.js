(function(exports) {
  exports.Scene = function() {
    this.players = [];
  };

  exports.Scene.prototype = {
    removePlayerById :  function(playerId) {
      var current = this.players.length;
      while(current--) {
        if (scene.players[current].id === playerId) {
          scene.players.splice(current, 1);
          break;
        }
      }
    },
    serialize :  function() {
      var lastGameState = {
        players : []
      };

      this.players.forEach(function(player) {
        var toSend = player._;
        toSend.id = player.socket.id;
        lastGameState.players.push(toSend);
      });

      return lastGameState;
    },
    update : function(gameState) {
      console.log(gameState)
      gameState.players.forEach(function(player) {
        if (!shipInstances[player.id]) {
          var ship = new entities.Ship({ sessionid: player.id }, player);
          ship.image = imageCache.ship.default.body;
          ship.trails = imageCache.ship.default.trails;
        } else {
          shipInstances[player.id]._ = player;
        }
      });
    }
  };
})(typeof window === 'undefined' ? exports : window);