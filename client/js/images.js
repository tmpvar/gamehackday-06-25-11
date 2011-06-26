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
      'default' : {
        body   : preload('assets/ship_default.png'),
        landing : [
            preload('assets/ship_landing_1.png'),
            preload('assets/ship_landing_2.png'),
            preload('assets/ship_landing_3.png'),
            preload('assets/ship_landing_4.png'),
            preload('assets/ship_landing_5.png'),
        ],
        crunching : [
          preload('assets/ship_crunch_1.png'),
          preload('assets/ship_crunch_2.png')
        ],
        crashing : [
            preload('assets/ship_part_1.png'),
            preload('assets/ship_part_2.png'),
            preload('assets/ship_part_3.png'),
            preload('assets/ship_part_4.png'),
            preload('assets/ship_part_5.png'),
            preload('assets/ship_part_6.png'),
            preload('assets/ship_part_7.png'),
            preload('assets/ship_part_8.png'),
            preload('assets/ship_part_9.png'),
            preload('assets/ship_part_10.png'),
            preload('assets/ship_part_11.png'),
            preload('assets/ship_part_12.png'),
            preload('assets/ship_part_13.png'),
            preload('assets/ship_part_14.png')
        ],
        trails : {
          large : [
            preload('assets/large_trail_1.png'),
            preload('assets/large_trail_2.png'),
            preload('assets/large_trail_3.png'),
            preload('assets/large_trail_4.png')
          ],
          small : [
            preload('assets/small_trail_1.png'),
            preload('assets/small_trail_2.png'),
            preload('assets/small_trail_3.png'),
            preload('assets/small_trail_4.png')
          ]
        }
      }
    },
    bullet : preload('assets/bullet.png'),
    background : {
      'default' : preload('assets/main_bg.png')
    }
  }
})();