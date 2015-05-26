var fs = require('fs');
var ac = {};

ac.import = function(callback){
  if (typeof callback !== 'function') return new Error('function plz');
  var filename = __dirname + '/words.txt';
  fs.readFile(filename, 'utf8', function(err, data){
    ac.words = data.split('\n').filter(function(line){
      return line;
    });
    callback(err, ac.words);
  });
};

ac.stats = function(word, callback){
  if (!ac.searches) ac.searches = {};
  if (!ac.searches[word]) ac.searches[word] = [];
  ac.searches[word].push(new Date().getTime());
  return callback(null, ac.searches);
};

ac.findWord = function(word, callback){
  var found = ac.words.filter(function(element){
    return element.indexOf(word) === 0;
  });
  ac.stats(word);
  return callback(null, found);
};



module.exports = ac;
