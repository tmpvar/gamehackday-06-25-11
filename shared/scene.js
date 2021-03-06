(function(exports) {
  exports.Scene = function() {
    this.players = {};
    this.planets = [];
  };

  exports.Scene.prototype = {
    removePlayerById :  function(playerId) {
      if (this.players[playerId]) {
        delete this.players[playerId];
      }
    },
    addPlayer : function(player) {
      this.players[player.getId()] = player;
    },
    hasPlayer : function(playerId) {
      return !!this.players[playerId];
    },
    getPlayer : function(playerId) {
      return this.players[playerId] || null;
    },
    addPlanet : function(planet) {
      this.planets.push(planet);
    },
    serialize :  function() {
      var that = this;
      var lastGameState = {
        players : []
      };

      Object.keys(this.players).forEach(function(key) {
        var player = that.players[key];
        var toSend = player.serialize();
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
          that.addPlayer(ship);
        } else {
          that.players[player.id].update(player);
        }
      });
    },

    tick : function() {
      var that = this;
      Object.keys(this.players).forEach(function(player_key) {
        var player = that.players[player_key];
        player.tick(that);
      });
    },

    render : function(context, timeDiff) {
      var planet = this.planets.length;

      while(planet--) {
        this.planets[planet].render(context, timeDiff);
      };


      var keys = Object.keys(this.players);
      var player = keys.length;

      while(player--) {
        var currentPlayer = window.ship && window.ship._ && window.ship._.id === this.players[keys[player]]._.id;
        this.players[keys[player]].render(context, timeDiff, currentPlayer);
      };

    }
  };
})(typeof window === 'undefined' ? exports : window);
