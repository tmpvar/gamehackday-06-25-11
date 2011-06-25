;(function() {
  var entities = window.entities = {
    ship : function() {
    }
  };
  
  entities.ship.prototype = {
    _      : {
      rotation : 0,
      thrust   : 0,
      fuel     : 100
    },
    rotate : function(degrees) {
      this.rotation += degrees;
    },
    addThrust : function(amount) {
      this.thrust += amount;
    }
  };
  
  var scene    = window.scene    = {
    players : []
  };
});