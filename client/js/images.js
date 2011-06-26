(function() {
  var total = 0;
  var current = 0;
  window.preloadProgress = function(current, total) { /* replace me */ console.log((current/total)*100, '% complete')};
  var preload = function(url) {
    preloadProgress(current, total);
    total++;
    var image = new Image();
    image.onload = function() {
      current++;
      if (total <= current) {
        window.preloadProgress(current, total);
      }
    }
    image.src = url;
    return image;
  };

  window.imageCache = {
    planet : {
      'default' : preload('assets/planet_1.png')
    },
    ship   : {
      'default' : preload('assets/ship_default.png')
    },
    background : {
      'default' : preload('assets/main_bg.png')
    }
  }
})();