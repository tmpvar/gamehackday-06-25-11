(function(exports) {
  
  exports.Planet = function() {

  }
  
  exports.Planet.prototype = {
    render: function(context) {
      context.drawImage(imageCache.background.default, 0 , 0)

      context.restore();
      context.save();
      
      context.translate(400, 300);
      context.scale(window.scale, window.scale);
      context.translate(-400, -300);
      context.drawImage(imageCache.planet.default, 300, 200)
      context.restore()
    }
  }

})(typeof window === 'undefined' ? exports : window);
