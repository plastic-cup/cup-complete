var port = process.env.PORT || 3000;

var ac = require('./index.js');
var fs = require('fs');
var http = require('http');
var index = fs.readFileSync(__dirname + '/index.html');

ac.import(function(err, count){
  console.log('imported a bunch of words');
});


http.createServer(function handler(request, response){
    var word;
    var url = request.url;
    if (url.length === 1){
        response.writeHead(200,{'Content-Type': 'text/html'});
        response.end(index.toString());
    } else if(url.indexOf('/find/') > - 1){ //localhost:3000/find/word
      word = url.split('/')[2];
      //console.log("word before ac.findword: " + word);
      ac.findWord(word, function(err, found){
          // console.log("Found the following words: " + found);
          response.end(found.join(',')); // returns to client string of found words
      });

      // response.end('word:', word);
  }
  else if(url.indexOf('/define/') > -1){
    // define stuff here
      //console.log("url:" + url);
      word = url.split('/')[2];
      //console.log("word before ac.define: " + word);
      ac.define(word, function(err, definition){ // definition has stuff at this point
          if(err){
              response.end(err);
          }
          //console.log("DEFINITION TO STRING: " + definition);
          response.end(definition); // returns to client string of definition
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
