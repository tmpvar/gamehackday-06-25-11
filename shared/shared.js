;(function() {
  var entities = window.entities = {
    Ship : function(x, y) {
      var that = this;
      scene.players.push(this);

      setInterval(function() {
        that._.rotation += that._.rotation_delta;
        that._.velocity += that._.thrust_delta;
      }, 16)

      this.render = function(ctx) {
        ctx.save()
          ctx.translate(x+50, y+50);
          ctx.rotate(this._.rotation);
          ctx.translate(x-50, y-50);
          ctx.fillStyle = "red";
          ctx.fillRect(x, y, 100, 100);
        ctx.restore();
      };
    }
  };

  entities.Ship.prototype = {
    _      : {
      rotation_delta : 0,
      thrust_delta   : 0,
      rotation       : 0,
      thrust         : 0,
      fuel           : 100
    },
    rotate : function(degrees) {
      this._.rotation_delta += degrees;
    },
    addVelocity : function(amount) {
      this._.thrust_delta += amount;
    }
  };
  
  var scene = window.scene = {
    players : []
  };
})();