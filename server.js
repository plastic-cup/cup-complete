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
  console.log(url);
  if (url.length === 1){
    response.writeHead(200,{'Content-Type': 'text/html'});
    response.end(index.toString());
  } else if(url.indexOf('/find/') > - 1){
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
    //word = "turkey";
    ac.getDefinition(word/*turkey*/, function(err, definition){ // definition has stuff at this point
      if(err){
        console.log(err);
        return new Error("couldn't get definition");
      }
      console.log("DEFINITION: " + definition);
      response.end(definition); // returns to client string of found words
    });
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

}).listen(port); // accepts connections on the specified port

console.log('node http server listening on http://localhost:' + port);
