var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/log"] = requestHandlers.log;
handle["/loadLog"] = requestHandlers.loadLog;
handle["/user"] = requestHandlers.user;
handle["/sync"] = requestHandlers.sync;
handle["/login"] = requestHandlers.login;

server.start(router.route, handle);
