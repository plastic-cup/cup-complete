var http = require('http');
var port = process.env.PORT || 3000;
var ac = require('./index.js');
ac.import(function(err, count){
  console.log('imported a bunch of words');
});
var fs = require('fs');
var index = fs.readFileSync(__dirname + '/index.html');

http.createServer(function handler(request, response){

  console.log(request.url);
  var url = request.url;
  if (url.length === 1){
    response.writeHead(200,{'Content-Type': 'text/html'});
    response.end(index.toString());
  } else if(url.indexOf('/find/') > - 1){
    //localhost:3000/find/word
    var word = url.split('/')[2];
    ac.findWord(word, function(err, found){
      console.log(found);
      response.end(found.join(','));
    });
    // response.end('word:', word);
  } else if(url.split('/')[1] === 'stats'){
    response.writeHead(200, {'Content-Type' : 'application/json'});
    response.end(JSON.stringify(ac.searches));
  } else {
    fs.readFile(__dirname + url, function(err, data){
        if (err){
            response.end();
        } else {
            var ext = url.split('.')[1];
            response.writeHead(200, {'Content-Type' : 'text/' + ext});
            response.end(data);
        }
    });
  }

}).listen(port);

console.log('node http server listening on http://localhost:' + port);
