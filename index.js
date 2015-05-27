var fs = require('fs');
var request = require('request'); // for the requesting stuff
var ac = {};

ac.import = function(callback){
  if (typeof callback !== 'function'){
    return new Error('function plz');
  }
  var filename = __dirname + '/words.txt';
  fs.readFile(filename, 'utf8', function(err, data){
    ac.words = data.split('\n').filter(function(line){
      return line;
    });
    callback(err, ac.words);
  });
};

ac.stats = function(word, callback){
  if (!ac.searches) {
    ac.searches = {};
  }
  if (!ac.searches[word]) {
    ac.searches[word] = [];
  }
  ac.searches[word].push(new Date().getTime());
  return callback(null, ac.searches);
};

ac.findWord = function(word, callback, next){
  var statsCallback = next || function(){
    return;
  };
  var found = ac.words.filter(function(element){
    return element.indexOf(word) === 0;
  });
  ac.stats(word,statsCallback);
  //console.log(ac.searches);
  return callback(null, found);
};

ac.getDefinition = function(word, callback){
  if (typeof word !== 'string'){
    return new Error('Can only get definitions for strings');
  }
  if (typeof callback !== 'function'){
    return new Error('function please');
  }
  var definition;
  /*API stuff here, pass it @param word*/
  var wikiURL = 'http://en.wiktionary.org/w/index.php?title=' + word + '&action=raw';
  request(wikiURL, function cb(err, response, body){
    if (!err){
      //console.log("response: " + response);
      console.log("body: " + body);
    }

  });
  return callback(null, definition);
};


module.exports = ac;
