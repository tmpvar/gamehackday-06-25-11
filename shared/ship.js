;(function(exports) {
  if (typeof require !== 'undefined') {
    var calc_angle = require('./trig').calc_angle;
    var CONST      = require('./trig').CONST;
    var Projectile = require('./projectile').Projectile;
  }

  exports.Ship = function(initial_state) {
    this._ = {
      rotation_delta: 0,
      thrust_delta: 0,
      rotation: 0,
      velocity_angle: 0,
      velocity: 0,
      thrust: 0,
      fuel: 100,
      x: undefined,
      y: undefined
    };
    
    this.projectiles = [];

    if (initial_state) this.update(initial_state);

    this.heldKeys = {};
    this.animation = {
      trails: {
        big: 0
      }
    }

    this.render = function(ctx, timeDiff) {
      ctx.save()
      ctx.translate(300, 200)
      ctx.scale(window.scale, window.scale)
      ctx.translate(-300, -200)
      ctx.translate(this._.x + 25, this._.y + 25); //that._.x, that._.y);
      ctx.rotate(this._.rotation + (Math.PI * 0.5));
      ctx.translate(-(this._.x + 25), -(this._.y + 25));
      if (this.image) {
        ctx.drawImage(this.image, this._.x, this._.y)
      }

      if (this.heldKeys['38']) {
        this.animation.trails.big += timeDiff;

        ctx.save();
        ctx.translate(this._.x + 22, this._.y + 50);
        var imageIndex = (this.animation.trails.big % 50) % 4;
        if (this.trails.large[imageIndex]) {
          ctx.scale(2.0);
          ctx.drawImage(this.trails.large[imageIndex], -7, 2);
        }
        ctx.restore();
      } else {
        this.animation.trails.big = 0;
      }

      if (this.heldKeys['37']) {
        ctx.save();
        ctx.translate(this._.x + 34, this._.y + 35);
        var imageIndex = (this.animation.trails.big % 50) % 4;
        if (this.trails.small[imageIndex]) {
          ctx.scale(2.0);
          ctx.drawImage(this.trails.small[imageIndex], -6, 2);
        }
        ctx.restore();
      }

      if (this.heldKeys['39']) {
        ctx.save();
        ctx.translate(this._.x + 10, this._.y + 35);
        var imageIndex = (this.animation.trails.big % 50) % 4;
        if (this.trails.small[imageIndex]) {
          ctx.scale(2.0);
          ctx.drawImage(this.trails.small[imageIndex], -5, 2);
        }
        ctx.restore();
      }
      ctx.restore();
    };
  }

  exports.Ship.prototype = {
    getId : function() {
      return this._.id;
    },
    update: function(vals) {
      for (var key in vals) {
        if (vals.hasOwnProperty(key)) {
          this._[key] = vals[key];
        }
      }
    },

    tick: function(scene) {

      var x = this._.velocity * Math.cos(this._.velocity_angle);
      var y = this._.velocity * Math.sin(this._.velocity_angle);

      var planet_angle = calc_angle(this._.x - 275, this._.y - 175) - Math.PI
      var planet_distance = this.planet_distance();

      if (planet_distance < 100) planet_distance = 100;

      x += Math.cos(planet_angle) * ((CONST.GRAVITY / Math.pow(planet_distance, 2)));
      y += Math.sin(planet_angle) * ((CONST.GRAVITY / Math.pow(planet_distance, 2)));

      // update the ship position due to speed
      this._.rotation += this._.rotation_delta;

      this._.velocity = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

      if (this._.velocity > CONST.MAX_SPEED) this._.velocity = CONST.MAX_SPEED;
      if (this._.velocity < 0) this._.velocity = 0;

      this._.velocity_angle = calc_angle(x, y)

      this._.x += x;
      this._.y += y;

      // update the ship position due to gravity
      this._.x += Math.cos(planet_angle)
      this._.y += Math.sin(planet_angle)

      this._.rotation_delta = this._.rotation_delta * 0.95;

      // update projectiles
      this.projectiles.forEach(function(projectile) {
        projectile.tick();
      });
    },

    serialize : function() {
      var ret = this._;
      ret.projectiles = [];
      this.projectiles.forEach(function(projectile) {
        ret.projectiles.push(projectile.serialize());
      });
      return ret;
    },

    planet_distance: function() {
      return Math.sqrt(Math.pow(this._.x - 275, 2) + Math.pow(this._.y - 175, 2));
    },

    rotate: function(degrees) {
      this._.rotation_delta -= degrees;
    },

    handleKeys: function(heldKeys) {
      // Forward
      if (heldKeys['38']) {
        // Thrust forward!
        this.addVelocity(CONST.THRUST);
      }
      // Brake
      if (heldKeys['40']) {
        // Thrust forward!
        this.addVelocity(0 - CONST.THRUST);
      }

      // Left
      if (heldKeys['37']) {
        this.rotate(CONST.ROTATION_DELTA);
      }

      // Right
      if (heldKeys['39']) {
        this.rotate(-CONST.ROTATION_DELTA);
      }

      // Fire!
      if (heldKeys['32']) {
        this.fire();
      }
    },
    fire  : function() {
      var projectile = new Projectile(this._);
      this.projectiles.push(projectile);
    },
    addVelocity: function(amount) {
      var x = this._.velocity * Math.cos(this._.velocity_angle);
      var y = this._.velocity * Math.sin(this._.velocity_angle);

      x += (0.01 * amount) * Math.cos(this._.rotation);
      y += (0.01 * amount) * Math.sin(this._.rotation);

      this._.velocity = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
      if (this._.velocity > CONST.MAX_SPEED) this._.velocity = CONST.MAX_SPEED;
      if (this._.velocity < 0) this._.velocity = 0;

      this._.velocity_angle = calc_angle(x, y)
    }
  }

})(typeof window === 'undefined' ? exports : window);
