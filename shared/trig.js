(function(exports) {
  /**
   * Computes theta from the x-axis to a line between the origin and x,y
   */
  exports.calc_angle = function(x, y) {
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
  };

  exports.CONST = {
    THRUST : 20,//10, // units
    ROTATION_DELTA : 0.006, // degrees
    MAX_SPEED: 60, //6,
    GRAVITY: 1000//750
  
  };
})(typeof window === 'undefined' ? exports : window);