;(function(exports) {
  exports.shipInstances = {};
  var entities = exports.entities = {
    Ship : function(socket, vals) {
      
      for (var key in vals) {
        if (vals.hasOwnProperty(key)) {
          this._[key] = vals[key];
        }
      }

      this.socket = socket;
      exports.shipInstances[socket.id] = this;
      var that = this;

      scene.players.push(this);

      setInterval(function() {
        that._.rotation += that._.rotation_delta;

        that._.x += Math.cos(that._.velocity_angle) * that._.velocity;
        that._.y += Math.sin(that._.velocity_angle) * that._.velocity;

        if (that._.x > 900) that._.x = 0
        if (that._.x < 0) that._.x = 900
        if (that._.y > 400) that._.y = 0
        if (that._.y < 0) that._.y = 400
        
        if (typeof $ !== 'undefined') {
          $("#vel").html(that._.velocity);
        }
        that._.rotation_delta = that._.rotation_delta * 0.99;
      },
      16)

      if (typeof Image !== 'undefined') {
        var im = new Image();
        im.src = 'assets/ship_default.png'
      }

      this.render = function(ctx) {
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
    _: {
      rotation_delta: 0,
      thrust_delta: 0,
      rotation: 0,
      velocity_angle: 0,
      velocity: 0,
      thrust: 0,
      fuel: 100,
      x: undefined,
      y: undefined
    },
    rotate: function(degrees) {
      this._.rotation_delta -= degrees;
    },
    addVelocity: function(amount) {
      var x = this._.velocity * Math.cos(this._.velocity_angle);
      var y = this._.velocity * Math.sin(this._.velocity_angle);

      x += (0.01 * amount) * Math.cos(this._.rotation);
      y += (0.01 * amount) * Math.sin(this._.rotation);
      
      this._.velocity       = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
      
      if (x > 0) {
        this._.velocity_angle = Math.atan(y / x);
      } else if (x < 0 && y >= 0) {
        this._.velocity_angle = Math.atan(y / x) + Math.PI;
      } else if (x < 0 && y < 0) {
        this._.velocity_angle = Math.atan(y / x) - Math.PI;
      } else if (x === 0 && y > 0) {
        this._.velocity_angle = Math.PI / 2;
      } else if (x === 0 && y < 0) {
        this._.velocity_angle = 0 - (Math.PI / 2);
      } else {
        this._.velocity_angle = 0;
      }
    }
  };

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
