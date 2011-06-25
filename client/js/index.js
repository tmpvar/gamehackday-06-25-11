;(function(window) {
  /*
    Bootstrap the browser
  */

  // var l      = window.location;
  // var socket = io.connect(l.protocol + "//" + l.hostname + ':' + l.port);
  // socket.on('news', function (data) {
  //   console.log(data);
  //   socket.emit('my other event', { my: 'data' });
  // });
  // 

  window.bootstrap = function() {
    
    
    /*
      Render loop
    */
    var fps = 1000/30;
    setTimeout(function nextFrame() {
      
      
      
      
      setTimeout(nextFrame, fps);
    },fps)
    

  };

  /*
    Spawn the current user, and send a message to the server
  */
  window.scene

  

})(window);