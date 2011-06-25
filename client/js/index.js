;(function(window) {
  /*
    Bootstrap the browser
  */

  window.bootstrap = function() {
    var l      = window.location;
    var socket = io.connect(l.protocol + "//" + l.hostname + ':' + l.port);
    socket.on('news', function (data) {
      console.log(data);
      socket.emit('my other event', { my: 'data' });
    });
    
    
  };
})(window);