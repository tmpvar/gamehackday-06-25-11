;(function() {
  var entities = window.entities = {
    Ship : function(x, y) {

      scene.players.push(this);

      this.render = function(ctx) {
        ctx.save()
          ctx.translate(x+50, y+50);
          ctx.rotate(this._.rotation);
          ctx.translate(x, y);
          ctx.fillStyle = "red";
          ctx.fillRect(x, y, 100, 100);
        ctx.restore();
      };
    }
  };

  entities.Ship.prototype = {
    _      : {
      rotation : 0,
      thrust   : 0,
      fuel     : 100
    },
    rotate : function(degrees) {
      this._.rotation += degrees;
    },
    addVelocity : function(amount) {
      this._.thrust += amount;
    }
  };
  
  var scene = window.scene = {
    players : []
  };
})();