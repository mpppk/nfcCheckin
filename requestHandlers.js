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

function upload(response, request) {
  console.log("Request handler 'upload' was called.");
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("in upload");
  response.end();
}

exports.start = start;
exports.upload = upload;
