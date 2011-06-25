;(function() {
  var entities = window.entities = {
    Ship : function(x, y) {

      scene.players.push(this);

      this.render = function(ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(x, y, 100, 100);
      }
    }
  };
  
  entities.Ship.prototype = {
    _      : {
      rotation : 0,
      thrust   : 0,
      fuel     : 100
    },
    rotate : function(degrees) {
      this.rotation += degrees;
    },
    addThrust : function(amount) {
      this.thrust += amount;
    }
  };
  
  var scene = window.scene = {
    players : []
  };
})();