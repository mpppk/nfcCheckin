var querystring = require("querystring");
var fs = require('fs');

function start(response) {
  console.log("Request handler 'start' was called.");
  fs.readFile("view/index.html", function(err, content){
    // エラー処理
    if(err){
      console.log("file read error!(in requestHandlers.js)  " + err.code);
    }
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(content);
    response.end();
  });
}

function upload(response, request, io) {
  console.log("Request handler 'upload' was called.");
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("in upload");
  response.end();
}

function log(response, request, io) {
  console.log("Request handler 'log' was called.");
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("in log");
  response.end();
}

function loadLog(response, request, io) {
  console.log("Request handler 'loadLog' was called.");
  io.of('/loadLog').emit('emit_from_server');
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("in addLog");
  response.end();
}

function user(response, request, io) {
  console.log("Request handler 'user' was called.");
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("in user");
  response.end();
}

function sync(response, request, io) {
  console.log("Request handler 'sync' was called.");
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("in sync");
  response.end();
}

function login(response, request, io) {
  console.log("Request handler 'login' was called.");
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("in login");
  response.end();
}


exports.start = start;
exports.upload = upload;
exports.log = log;
exports.loadLog = loadLog;
exports.user = user;
exports.sync = sync;
exports.login = login;
