(function(exports) {
  exports.Scene = function() {
    this.players = [];
  };

  exports.Scene.prototype = {
    removePlayerById :  function(playerId) {
      if (this.players[playerId]) {
        delete this.players[playerId];
      }
    },
    addPlayer : function(player) {
      this.players[player.id] = player;
    },
    hasPlayer : function(playerId) {
      return !!this.players[playerId];
    },
    serialize :  function() {
      var that = this;
      var lastGameState = {
        players : []
      };

      Object.keys(this.players).forEach(function(key) {
        var player = that.players[key];
        var toSend = player._;
        toSend.id = player.id;
        lastGameState.players.push(toSend);
      });

      return lastGameState;
    },
    update : function(gameState) {
      var that = this;

      gameState.players.forEach(function(player) {
        if (!that.hasPlayer(player.id)) {
          var ship = new Ship(player);
          ship.image = imageCache.ship.default.body;
          ship.trails = imageCache.ship.default.trails;
        } else {
          that.players[player.id].update(player);
        }
      });
    }
  };
})(typeof window === 'undefined' ? exports : window);