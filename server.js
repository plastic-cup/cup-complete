var http = require('http');
var port = process.env.PORT || 3000;
var ac = require('./index.js');
ac.import(function(err, count){
  console.log('imported a bunch of words');
});
var fs = require('fs');
var index = fs.readFileSync(__dirname + '/index.html');

http.createServer(function handler(request, response){
  var word;
  console.log(request.url);
  var url = request.url;
  if (url.length === 1){
    response.writeHead(200,{'Content-Type': 'text/html'});
    response.end(index.toString());
  }
  else if(url.indexOf('/find/') > - 1){
    //localhost:3000/find/word
    word = url.split('/')[2];
    ac.findWord(word, function(err, found){
      console.log("Found the following words: " + found);
      response.end(found.join(',')); // returns to client string of found words
    });
    // response.end('word:', word);
  }
  else if(url.indexOf('/define/') > -1){
    // define stuff here
    word = url.split('/')[2];
    ac.getDefinition(word, function(err, definition){
      if(err){
        throw new Error("couldn't get definition");
      }
      response.end(definition); // returns to client string of found words
    });
  }
  else {
    response.end('hello Rafe!');
  }

}).listen(port); // accepts connections on the specified port

console.log('node http server listening on http://localhost:' + port);
