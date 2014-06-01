var path = require("path");
var fs = require('fs');

var mimeTypes = {
  '.js': 'text/javascript',
  '.html': 'text/html',
  '.css': 'text/css'
};

function route(handle, pathname, response, request) {
  console.log("About to route a request for " + pathname);
  
  var lookup = path.basename(decodeURI(request.url));
  var ext = path.extname(lookup);
  if( ext == '.js' || ext == '.css' || ext == '.html' || ext == '.php' || ext == '.ejs'){
    // 静的ファイルのロード
    fs.readFile('.' + pathname, function(err, content){
      if(err){
        console.log("file read error!(in router.js)  " + err.code);
      }
      response.writeHead(200, {"Content-Type": mimeTypes[ext]});
      response.end(content);
    });
  } else if (typeof handle[pathname] === 'function') {
    handle[pathname](response, request);
  } else {
    console.log("No request handler found for " + pathname);
    response.writeHead(404, {"Content-Type": "text/html"});
    response.write("404 Not found");
    response.end();
  }
}

exports.route = route;
