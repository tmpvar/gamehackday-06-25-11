(function(exports) {
  
  exports.Planet = function() {

  }
  
  exports.Planet.prototype = {
    render: function(context) {
      context.drawImage(imageCache.background.default, 0 , 0)

      context.restore();
      context.save();
      
      context.translate(300, 200);
      context.scale(window.scale, window.scale);
      context.translate(-300, -200);
      context.drawImage(imageCache.planet.default, 200, 100)
      context.restore()
    }
  }

})(typeof window === 'undefined' ? exports : window);
