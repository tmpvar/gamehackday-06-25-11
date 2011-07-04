(function(exports) {
  
  if (typeof require !== 'undefined') {
    var calc_angle = require('./trig').calc_angle;
    var CONST      = require('./trig').CONST
  }

  exports.Projectile = function(ship, data) {
    this.ship = ship;
    this._ = {
      active : true
    };
    this.update(data);
  };

  exports.Projectile.prototype = {
    tick :  function(scene) {
      if (!this._.active) {
        return;
      }
      var x = 10 * Math.cos(this._.rotation);
      var y = 10 * Math.sin(this._.rotation);

      this._.x += x;
      this._.y += y;
      var newx = this._.x;
      var newy = this._.y;

      // Simple AABB collision detection
      var shipKeys = Object.keys(scene.players);

      for (var i=0, l=shipKeys.length;i<l;i++) {
        var ship = scene.players[shipKeys[i]];
        if (this.ship._.id !== shipKeys[i] && 
            ship._.x < newx && ship.width  + ship._.x > newx &&
            ship._.y < newy && ship.height + ship._.y > newy)
        {
          // ship got hit.
          ship._.health -= 10;
          if (ship._.health <= 0) {
            ship._.health = 0;
            ship._.crashed = true;
            this._.active = false;
          }
        }
      }
    },
    update : function(vals) {
      for (var key in vals) {
        if (vals.hasOwnProperty(key)) {
          this._[key] = vals[key];
        }
      }
    },
    render  : function(ctx, timeDiff) {
      if (!this._.active) {
        return;
      }

      ctx.save();
      ctx.translate(400, 300)
      ctx.scale(window.scale, window.scale)
      ctx.translate(-400, -300)
      ctx.translate(this._.x, this._.y); //that._.x, that._.y);
      ctx.rotate(this._.rotation + (Math.PI * 0.5));      
      ctx.drawImage(imageCache.bullet, -6.5, -18);
      ctx.restore();
    },
    serialize : function() {
      return this._;
    }
  };

})(typeof window === 'undefined' ? exports : window);