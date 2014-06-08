var http = require("http");
var url = require("url");
function start(route, handle) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
    route(handle, pathname, response, request, io);
  }

  var app = http.createServer(onRequest);
  var io = require('socket.io').listen(app);
  app.listen(8888);
  console.log("Server has started.");

// websocket
  io.of('/loadLog').on('connection', function(socket){
  	socket.on('emit_from_client', function(data){
  		console.log(data);
  		socket.emit('emit_from_server', 'hello from server loadlog');
  	});
  });

  io.of('/hello').on('connection', function(socket){
    socket.on('emit_from_client', function(data){
      console.log(data);
      socket.emit('emit_from_server', 'hello from server hello');
    });
  });

}

exports.start = start;
