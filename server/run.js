// var io = require('socket.io').listen(80);
// 
// io.sockets.on('connection', function (socket) {
//         socket.emit('news', { hello: 'world' });
//         socket.on('my other event', function (data) {
//                 console.log(data);
//         });
// });

var connect = require("connect");
var sys = require("sys");
var util = require("util");
sys.log(__dirname)
var server = connect.createServer(
        connect.logger(),
        connect.static(__dirname + "/../perf-test")
).listen(8080);