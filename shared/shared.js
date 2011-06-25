;
(function() {
  var entities = window.entities = {
    Ship: function(x, y) {
      var that = this;

      that._.x = x;
      that._.y = y;

      scene.players.push(this);

      setInterval(function() {
        that._.rotation += that._.rotation_delta;

        that._.x += Math.cos(that._.velocity_angle) * that._.velocity;
        that._.y += Math.sin(that._.velocity_angle) + that._.velocity;

        if (that._.x > 900) that._.x = 0
        if (that._.x < 0) that._.x = 900
        if (that._.y > 400) that._.y = 0
        if (that._.y < 0) that._.y = 400

        $("#vel").html(that._.rotation)
        that._.rotation_delta = that._.rotation_delta * 0.99;
      },
      16)

      var im = new Image();
      im.src = 'assets/ship_default.png'

      this.render = function(ctx) {

        ctx.save()
        ctx.translate(that._.x + 25, that._.y + 25); //that._.x, that._.y);
        ctx.rotate(this._.rotation);
        ctx.translate(-(that._.x + 25), -(that._.y + 25));
        // ctx.fillStyle = "red";
        // ctx.fillRect(that._.x, that._.y, 50, 50);
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
      velocity: 0.5,
      thrust: 0,
      fuel: 100,
      x: undefined,
      y: undefined
    },
    rotate: function(degrees) {
      this._.rotation_delta += degrees;
    },
    addVelocity: function(amount) {
      var x = this._.velocity * Math.cos(this._.velocity_angle);
      var y = this._.velocity * Math.sin(this._.velocity_angle);

      var dx = (0.1 * amount) * Math.cos(this._.rotation);
      var dy = (0.1 * amount) * Math.sin(this._.rotation);

      this._.velocity_angle = Math.sqrt(Math.pow(x + dx, 2), Math.pow(y + dy, 2));
      // this._.velocity       = Math.atan((y + dy) / (x + dx));
    }
  };

  var scene = window.scene = {
    players: []
  };
})();