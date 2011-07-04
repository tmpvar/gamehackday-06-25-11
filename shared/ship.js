;(function(exports) {
  if (typeof require !== 'undefined') {
    var calc_angle = require('./trig').calc_angle;
    var CONST      = require('./trig').CONST;
    var Projectile = require('./projectile').Projectile;
  }
  
  var MAX_HEALTH = 100;

  exports.Ship = function(initial_state) {
    this._ = {
      rotation_delta: 0,
      thrust_delta: 0,
      rotation: 0,
      velocity_angle: 0,
      velocity: 0,
      thrust: 0,
      fuel: 100,
      health : MAX_HEALTH,
      x: undefined,
      y: undefined
    };

    this.width = 50;
    this.height = 50;

    this.projectiles = [];

    if (initial_state) this.update(initial_state);

    this.heldKeys = {};
    this.animation = {
      trails: {
        big: 0
      },
      landing: 0,
      crashing: []
    }
    
    this._.animation = {
      crashing: []
    }

    this.render = function(ctx, timeDiff) {
      ctx.save()
      ctx.translate(400, 300)
      ctx.scale(window.scale, window.scale)
      ctx.translate(-400, -300)
      ctx.translate(this._.x + 25, this._.y + 25); //that._.x, that._.y);

      ctx.rotate(Math.PI/2);
      var R=Math.floor(255*(100-this._.health))/100;
      var G=Math.floor((255*(this._.health/100)));
      var B=0;
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fillRect(-45, -25, 5, 50);
      ctx.fillStyle = 'rgba(' + R + ',' + G + ',' + B + ', 1.0)';
      var size = (this._.health/100);
      ctx.fillRect(-45, 25-(50*size), 5, 50*size);
      ctx.rotate(-Math.PI/2);

      ctx.rotate(this._.rotation + (Math.PI * 0.5));
      ctx.translate(-(this._.x + 25), -(this._.y + 25));

      if (this._.landed) {
        ctx.drawImage(imageCache.ship.default.landing[4], this._.x, this._.y);
      } else if (this._.crashed) {
        this.animation.landing += timeDiff;
        ctx.save()
        var imageIndex = Math.floor(this.animation.landing / 1000);
        if (imageIndex >= 2) imageIndex = 2;
        ctx.drawImage(imageCache.ship.default.crunching[imageIndex % 1], this._.x, this._.y);
        ctx.restore()
        
        for (var i = 0; i < 13; i ++) {
          var part = this._.animation.crashing[i];
          if (part) {
            ctx.drawImage(imageCache.ship.default.crashing[i], this._.animation.crashing[i].x, this._.animation.crashing[i].y);
          }
        };
      } else if (this.image) {
        var imageIndex = Math.floor((this.planet_distance() - 100) / 4);
        if (imageIndex < 5) {
          imageIndex = 4 - imageIndex;
          if (imageIndex > 4) imageIndex = 4;
          
          ctx.drawImage(imageCache.ship.default.landing[imageIndex], this._.x, this._.y)  
        } else {
          ctx.drawImage(this.image, this._.x, this._.y)
        }
      }

      if (!this._.crashed) {
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
          this.animation.trails.big += timeDiff;
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
          this.animation.trails.big += timeDiff;
          ctx.save();
          ctx.translate(this._.x + 10, this._.y + 35);
          var imageIndex = (this.animation.trails.big % 50) % 4;
          if (this.trails.small[imageIndex]) {
            ctx.scale(2.0);
            ctx.drawImage(this.trails.small[imageIndex], -5, 2);
          }
          ctx.restore();
        }

        if (this.heldKeys['40']) {
          this.animation.trails.big += timeDiff;
          ctx.save();
        
          var imageIndex = (this.animation.trails.big % 50) % 4;
          if (this.trails.small[imageIndex]) {
            ctx.translate(this._.x + 33, this._.y-0.5);
            ctx.rotate(Math.PI * .99999999)

            ctx.drawImage(this.trails.small[imageIndex], 0, 0);

          }
          ctx.restore();
        }
      }

      ctx.restore();
      
      this.projectiles.forEach(function(projectile) {
        projectile.render(ctx, timeDiff);
      });
      
    };
  }

  exports.Ship.prototype = {
    _lastFire : 0,
    getId : function() {
      return this._.id;
    },
    update: function(vals) {
      var that = this;
      for (var key in vals) {
        if (key === 'projectiles') {
          this.projectiles = [];
          vals[key].forEach(function(projectileData) {
            // TODO: wtf is going on?
            var projectile = new window.Projectile(this, projectileData);
            that.projectiles.push(projectile);
          });
        } else if (vals.hasOwnProperty(key)) {
          this._[key] = vals[key];
        }
      }
    },

    tick: function(scene) {

      var x = this._.velocity * Math.cos(this._.velocity_angle);
      var y = this._.velocity * Math.sin(this._.velocity_angle);

      var planet_angle = calc_angle(this._.x - 375, this._.y - 275) - Math.PI
      var planet_distance = this.planet_distance();

      x += Math.cos(planet_angle) * ((CONST.GRAVITY / Math.pow(planet_distance, 2)));
      y += Math.sin(planet_angle) * ((CONST.GRAVITY / Math.pow(planet_distance, 2)));

      // update the ship position due to speed
      
      if (planet_distance < 100) { // contact planet
        planet_angle = (planet_angle - Math.PI) % (Math.PI * 2)
        var rotation = this._.rotation % (Math.PI * 2)
        
        if (this._.velocity <= 2 && (rotation > planet_angle - 0.4) && (rotation < planet_angle + 0.4)) { // land
          this._.landed = true;
          this._.rotation = planet_angle;
        } else { // crash
          this._.crashed = true;
          for (var i = 0; i < 13; i ++) {
            var part = this._.animation.crashing[i];
            if (!part) {
              this._.animation.crashing.push({
                x: this._.x,
                y: this._.y,
                velocity: this._.velocity,
                velocity_angle: this._.velocity_angle + ((Math.random() - 0.5) * 2) - (Math.PI / 2)
              })
            } else {
              part.x += Math.cos(part.velocity_angle) * part.velocity
              part.y += Math.sin(part.velocity_angle) * part.velocity
            }
          }
        }

      } else { // flying
        
        this._.landed = false;
        
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
      }

      // update projectiles
      this.projectiles.forEach(function(projectile) {
        projectile.tick(scene);
      });
    },

    serialize : function() {
      var ret = JSON.parse(JSON.stringify(this._));
      ret.projectiles = [];
      this.projectiles.forEach(function(projectile) {
        ret.projectiles.push(projectile.serialize());
      });
      return ret;
    },

    planet_distance: function() {
      return Math.sqrt(Math.pow(this._.x - 375, 2) + Math.pow(this._.y - 275, 2));
    },

    rotate: function(degrees) {
      this._.rotation_delta -= degrees;
    },

    handleKeys: function(heldKeys) {
      // Forward
      if (heldKeys['38']) {
        if (this._.landed) {
          
          this._.landed = false;
          this.addVelocity(CONST.THRUST*40);
        }
  
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
      if (Date.now()-this._lastFire > 200) {
        var data = JSON.parse(JSON.stringify(this._))
        data.x += 25;
        data.y += 25;
        var projectile = new Projectile(this, data);
        this.projectiles.unshift(projectile);
        this.projectiles.length = 100;
        this._lastFire = Date.now();
      }
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
