;(function(exports) {
  var CONST = {
    THRUST : 10, // units
    ROTATION_DELTA : 0.006, // degrees
    MAX_SPEED: 3
    
  };
  
  exports.shipInstances = {};
  var entities = exports.entities = {
    Ship : function(socket, vals) {
      
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

      for (var key in vals) {
        if (vals.hasOwnProperty(key)) {
          this._[key] = vals[key];
        }
      }

      this.socket = socket;
      exports.shipInstances[socket.sessionid] = this;
      var that = this;

      scene.players.push(this);

      this.tick = function() {
        
        // update the ship position due to speed
        that._.rotation += that._.rotation_delta;

        that._.x += Math.cos(that._.velocity_angle) * that._.velocity;
        that._.y += Math.sin(that._.velocity_angle) * that._.velocity;
        
        // update the ship position due to gravity
        // planet_angle = 
        // 
        // that._.x += Math.cos(planet_angle) * 2
        // that._.y += Math.sin(planet_angle) * 2
        

        if (that._.x > 600) that._.x = 0
        if (that._.x < 0) that._.x = 600
        if (that._.y > 400) that._.y = 0
        if (that._.y < 0) that._.y = 400
        
        that._.rotation_delta = that._.rotation_delta * 0.95;
        
      }

      if (typeof Image !== 'undefined') {
        var im = new Image();
        im.src = 'assets/ship_default.png'
        
        var planet = new Image();
        planet.src = 'assets/planet_1.png'
      }

      this.render = function(ctx) {
        ctx.drawImage(planet, 200, 100)
        
        ctx.save()
        ctx.translate(that._.x + 25, that._.y + 25); //that._.x, that._.y);
        ctx.rotate(that._.rotation + (Math.PI * 0.5));
        ctx.translate(-(that._.x + 25), -(that._.y + 25));
        ctx.drawImage(im, that._.x, that._.y)
        ctx.restore();
        
        
      };
    }
  };

  entities.Ship.prototype = {
    rotate: function(degrees) {
      this._.rotation_delta -= degrees;
    },

    handleKeys : function(heldKeys) {
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
    addVelocity: function(amount) {
      var x = this._.velocity * Math.cos(this._.velocity_angle);
      var y = this._.velocity * Math.sin(this._.velocity_angle);

      x += (0.01 * amount) * Math.cos(this._.rotation);
      y += (0.01 * amount) * Math.sin(this._.rotation);
      
      this._.velocity       = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
      if (this._.velocity > CONST.MAX_SPEED) this._.velocity = CONST.MAX_SPEED;
      if (this._.velocity < 0) this._.velocity = 0;
      
      this._.velocity_angle = calc_angle(x, y)
    }
  };
  
  function calc_angle(x, y) {
    if (x > 0) {
      return Math.atan(y / x);
    } else if (x < 0 && y >= 0) {
      return  Math.atan(y / x) + Math.PI;
    } else if (x < 0 && y < 0) {
      return  Math.atan(y / x) - Math.PI;
    } else if (x === 0 && y > 0) {
      return  Math.PI / 2;
    } else if (x === 0 && y < 0) {
      return  0 - (Math.PI / 2);
    } else {
      return  0;
    }
    
  }

  var scene = exports.scene = {
    removePlayer :  function(player) {
      var current = scene.players.length;
      while(current--) {
        if (scene.players[current] === player) {
          scene.players.splice(current, 1);
          delete exports.shipInstances[player.socket.id];
          break;
        }
      }
    },
    players : []
  };
})(typeof window === 'undefined' ? exports : window);
