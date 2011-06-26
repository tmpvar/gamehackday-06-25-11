(function(exports) {
  
  if (typeof require !== 'undefined') {
    var calc_angle = require('./trig').calc_angle;
    var CONST      = require('./trig').CONST
  }

  exports.Projectile = function(data) {
    this._ = {};
    this.update(data);
  };

  exports.Projectile.prototype = {
    tick :  function() {

      var x = 10 * Math.cos(this._.rotation);
      var y = 10 * Math.sin(this._.rotation);

      this._.x += x;
      this._.y += y;

    },
    update : function(vals) {
      for (var key in vals) {
        if (vals.hasOwnProperty(key)) {
          this._[key] = vals[key];
        }
      }
    },
    render  : function(ctx, timeDiff) {
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