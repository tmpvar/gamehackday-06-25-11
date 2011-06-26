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
      var x = this._.velocity * Math.cos(this._.velocity_angle);
      var y = this._.velocity * Math.sin(this._.velocity_angle);

      this._.x += x;
      this._.y += y;

      this._.rotation_delta = this._.rotation_delta * 0.95;
    },
    update : function(vals) {
      for (var key in vals) {
        if (vals.hasOwnProperty(key)) {
          console.log(vals[key]);
          this._[key] = vals[key];
        }
      }
    },
    render  : function(ctx, timeDiff) {
      ctx.save();
      ctx.fillStyle = "red";
      ctx.fillRect(0, 0, 10, 10);
      ctx.restore();
    },
    serialize : function() {
      return this._;
    }
  };

})(typeof window === 'undefined' ? exports : window);